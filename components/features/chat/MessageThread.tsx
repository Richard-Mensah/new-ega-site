"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import { Send, ChevronLeft, Paperclip, Mic, MicOff, File as FileIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChatMessage = {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  read_at: string | null
  created_at: string
  attachment_url?: string | null
  attachment_type?: "image" | "audio" | "file" | null
  attachment_name?: string | null
}

type Props = {
  currentUserId: string
  partnerId: string
  partnerName: string
  partnerAvatar: string | null
  initialMessages: ChatMessage[]
}

export default function MessageThread({ currentUserId, partnerId, partnerName, partnerAvatar, initialMessages }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isPartnerOnline, setIsPartnerOnline] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSecs, setRecordingSecs] = useState(0)
  // Recorded audio waiting to be reviewed/sent
  const [pendingAudio, setPendingAudio] = useState<{ blob: Blob; url: string; name: string } | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTypingRef = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Create Supabase client once — recreating it every render causes the realtime channel to
  // disconnect and reconnect on every state update, losing messages mid-send.
  const supabase = useMemo(() => createClient(), [])

  const markRead = useCallback(() => {
    fetch("/api/messages/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id: partnerId }),
    })
  }, [partnerId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => { markRead() }, [markRead])

  // Revoke blob URL when pending audio is cleared
  useEffect(() => {
    return () => {
      if (pendingAudio) URL.revokeObjectURL(pendingAudio.url)
    }
  }, [pendingAudio])

  useEffect(() => {
    const channelId = [currentUserId, partnerId].sort().join("-")
    const ch = supabase.channel(`dm:${channelId}`)

    ch
      .on("presence", { event: "sync" }, () => {
        const state = ch.presenceState<{ userId: string }>()
        const online = Object.values(state)
          .flat()
          .some((p) => (p as { userId: string }).userId === partnerId)
        setIsPartnerOnline(online)
      })
      .on("broadcast", { event: "new_message" }, ({ payload }) => {
        if (payload.sender_id !== partnerId) return
        setMessages((prev) =>
          prev.some((m) => m.id === payload.id) ? prev : [...prev, payload as ChatMessage]
        )
        markRead()
      })
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.userId !== partnerId) return
        setIsTyping(true)
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        typingTimerRef.current = setTimeout(() => setIsTyping(false), 2000)
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${currentUserId}` },
        (payload) => {
          const msg = payload.new as ChatMessage
          if (msg.sender_id !== partnerId) return
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
          )
          markRead()
        }
      )

    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ userId: currentUserId })
      }
    })

    channelRef.current = ch

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
      supabase.removeChannel(ch)
      channelRef.current = null
    }
  }, [supabase, currentUserId, partnerId, markRead])

  async function postMessage(
    text: string,
    attachType?: string | null,
    attachUrl?: string | null,
    attachName?: string | null
  ) {
    if (!text.trim() && !attachUrl) return
    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_id: partnerId,
          content: text.trim() || "",
          attachment_url: attachUrl ?? null,
          attachment_type: attachType ?? null,
          attachment_name: attachName ?? null,
        }),
      })
      if (res.ok) {
        const msg = await res.json() as ChatMessage
        setMessages((prev) => [...prev, msg])
        channelRef.current?.send({ type: "broadcast", event: "new_message", payload: msg })
      }
    } finally {
      setSending(false)
    }
  }

  async function uploadFile(file: File, type: "image" | "audio" | "file") {
    setUploading(true)
    setUploadError(null)
    try {
      const path = `${currentUserId}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from("chat-attachments").upload(path, file)
      if (error) {
        setUploadError(error.message.includes("Bucket not found")
          ? "Storage not configured — ask the admin to set up the chat-attachments bucket."
          : `Upload failed: ${error.message}`)
        return
      }
      if (!data) return
      const { data: urlData } = supabase.storage.from("chat-attachments").getPublicUrl(data.path)
      return { url: urlData.publicUrl, name: file.name }
    } finally {
      setUploading(false)
    }
  }

  async function handleSend() {
    // Pending audio: upload first, then send
    if (pendingAudio) {
      const file = new File([pendingAudio.blob], pendingAudio.name, { type: pendingAudio.blob.type })
      const uploaded = await uploadFile(file, "audio")
      if (uploaded) {
        await postMessage("", "audio", uploaded.url, uploaded.name)
      }
      URL.revokeObjectURL(pendingAudio.url)
      setPendingAudio(null)
      return
    }
    // Text message
    const text = input.trim()
    if (!text || sending) return
    setInput("")
    await postMessage(text)
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""
    const type: "image" | "audio" | "file" = file.type.startsWith("image/") ? "image"
      : file.type.startsWith("audio/") ? "audio" : "file"
    const uploaded = await uploadFile(file, type)
    if (uploaded) await postMessage("", type, uploaded.url, uploaded.name)
  }

  function toggleRecording() {
    if (isRecording) {
      // Stop → audio lands in pendingAudio via onstop handler
      mediaRecorderRef.current?.stop()
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current)
      setIsRecording(false)
    } else {
      startRecording()
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      audioChunksRef.current = []
      setRecordingSecs(0)

      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        const name = `voice-${Date.now()}.webm`
        // Show preview — don't send yet
        setPendingAudio({ blob, url, name })
      }

      mr.start()
      mediaRecorderRef.current = mr
      setIsRecording(true)

      // Tick timer so user sees duration while recording
      recordingTimerRef.current = setInterval(() => {
        setRecordingSecs((s) => s + 1)
      }, 1000)
    } catch {
      // mic permission denied — silently ignore
    }
  }

  function discardPendingAudio() {
    if (pendingAudio) URL.revokeObjectURL(pendingAudio.url)
    setPendingAudio(null)
  }

  function handleInputChange(val: string) {
    setInput(val)
    const now = Date.now()
    if (now - lastTypingRef.current > 1000) {
      lastTypingRef.current = now
      channelRef.current?.send({ type: "broadcast", event: "typing", payload: { userId: currentUserId } })
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function formatSecs(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${m}:${sec}`
  }

  const isBusy = sending || uploading

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white shrink-0">
        <button
          type="button"
          onClick={() => router.push("/dashboard/chat")}
          className="md:hidden shrink-0 p-2 -ml-1 mr-1 rounded-xl hover:bg-gray-100 text-brand-navy transition-colors"
          aria-label="Back to messages"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="relative shrink-0">
          <ProfileAvatar avatarUrl={partnerAvatar} fullName={partnerName} size="md" />
          <span
            className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
              isPartnerOnline ? "bg-green-400" : "bg-gray-300"
            )}
          />
        </div>
        <div>
          <p className="font-bold text-brand-navy leading-tight">{partnerName}</p>
          <p className="text-xs text-gray-400">
            {isTyping ? (
              <span className="text-brand-navy italic">typing…</span>
            ) : isPartnerOnline ? (
              <span className="text-green-500">Online</span>
            ) : (
              "Offline"
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-12">
            <p>No messages yet.</p>
            <p className="text-xs mt-1">Say hello!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
              {!isMe && (
                <div className="shrink-0 mr-2 mt-1">
                  <ProfileAvatar avatarUrl={partnerAvatar} fullName={partnerName} size="xs" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  isMe
                    ? "bg-brand-navy text-white rounded-tr-sm"
                    : "bg-gray-100 text-gray-800 rounded-tl-sm"
                )}
              >
                {msg.attachment_type === "image" && msg.attachment_url && (
                  <img
                    src={msg.attachment_url}
                    alt={msg.attachment_name ?? "image"}
                    className="rounded-xl max-w-full mb-1 cursor-pointer"
                    onClick={() => window.open(msg.attachment_url!, "_blank")}
                  />
                )}
                {msg.attachment_type === "audio" && msg.attachment_url && (
                  <audio controls muted preload="none" src={msg.attachment_url} className="max-w-full mb-1" />
                )}
                {msg.attachment_type === "file" && msg.attachment_url && (
                  <a
                    href={msg.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center gap-2 mb-1 px-3 py-2 rounded-lg text-sm transition-colors",
                      isMe ? "bg-white/20 hover:bg-white/30" : "bg-gray-200 hover:bg-gray-300"
                    )}
                  >
                    <FileIcon size={14} />
                    <span className="truncate max-w-[180px]">{msg.attachment_name ?? "File"}</span>
                  </a>
                )}
                {msg.content && <p>{msg.content}</p>}
                <p className={cn("text-[10px] mt-1 text-right", isMe ? "text-white/60" : "text-gray-400")}>
                  {new Date(msg.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
        {uploadError && (
          <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
            <span className="flex-1">{uploadError}</span>
            <button type="button" onClick={() => setUploadError(null)} className="shrink-0 font-bold hover:text-red-800">✕</button>
          </div>
        )}
        {/* === RECORDING in progress === */}
        {isRecording && (
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span className="text-sm font-medium text-red-500 tabular-nums">{formatSecs(recordingSecs)}</span>
            <span className="flex-1 text-sm text-gray-400">Recording…</span>
            <button
              type="button"
              onClick={toggleRecording}
              aria-label="Stop recording"
              className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shrink-0"
            >
              <MicOff size={18} />
            </button>
          </div>
        )}

        {/* === PENDING AUDIO preview — waiting for user to send === */}
        {!isRecording && pendingAudio && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={discardPendingAudio}
              aria-label="Discard recording"
              className="w-9 h-9 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shrink-0"
            >
              <X size={18} />
            </button>
            <audio controls src={pendingAudio.url} title="Voice message preview" className="flex-1 h-9 min-w-0" />
            <button
              type="button"
              onClick={handleSend}
              disabled={isBusy}
              aria-label="Send voice message"
              className="w-10 h-10 bg-brand-navy text-white rounded-xl flex items-center justify-center hover:bg-brand-navy/90 transition-colors disabled:opacity-40 shrink-0"
            >
              {uploading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        )}

        {/* === NORMAL text + attach input === */}
        {!isRecording && !pendingAudio && (
          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
              onChange={handleFileSelect}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isBusy}
              aria-label="Attach file"
              className="w-10 h-10 rounded-xl text-gray-400 hover:text-brand-navy hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
            >
              <Paperclip size={18} />
            </button>

            <button
              type="button"
              onClick={toggleRecording}
              disabled={isBusy}
              aria-label="Record voice message"
              className="w-10 h-10 rounded-xl text-gray-400 hover:text-brand-navy hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
            >
              <Mic size={18} />
            </button>

            <textarea
              rows={1}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={uploading ? "Uploading…" : `Message ${partnerName}…`}
              disabled={uploading}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy max-h-32 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isBusy}
              aria-label="Send message"
              className="w-10 h-10 bg-brand-navy text-white rounded-xl flex items-center justify-center hover:bg-brand-navy/90 transition-colors disabled:opacity-40 shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
