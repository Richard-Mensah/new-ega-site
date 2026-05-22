"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChatMessage = {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  read_at: string | null
  created_at: string
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
  const [isPartnerOnline, setIsPartnerOnline] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastTypingRef = useRef(0)
  const supabase = createClient()

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

  // Mark current thread as read on mount
  useEffect(() => { markRead() }, [markRead])

  useEffect(() => {
    const channelId = [currentUserId, partnerId].sort().join("-")
    const ch = supabase.channel(`dm:${channelId}`)

    ch
      // --- Presence: online dot ---
      .on("presence", { event: "sync" }, () => {
        const state = ch.presenceState<{ userId: string }>()
        const online = Object.values(state)
          .flat()
          .some((p) => (p as { userId: string }).userId === partnerId)
        setIsPartnerOnline(online)
      })
      // --- Broadcast: fast incoming message ---
      .on("broadcast", { event: "new_message" }, ({ payload }) => {
        if (payload.sender_id !== partnerId) return
        setMessages((prev) =>
          prev.some((m) => m.id === payload.id) ? prev : [...prev, payload as ChatMessage]
        )
        markRead()
      })
      // --- Broadcast: typing indicator ---
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        if (payload.userId !== partnerId) return
        setIsTyping(true)
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
        typingTimerRef.current = setTimeout(() => setIsTyping(false), 2000)
      })
      // --- postgres_changes: fallback for multi-device ---
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
      supabase.removeChannel(ch)
      channelRef.current = null
    }
  }, [supabase, currentUserId, partnerId, markRead])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput("")
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient_id: partnerId, content: text }),
      })
      if (res.ok) {
        const msg = await res.json() as ChatMessage
        setMessages((prev) => [...prev, msg])
        // Broadcast for instant delivery on recipient's side
        channelRef.current?.send({ type: "broadcast", event: "new_message", payload: msg })
      }
    } finally {
      setSending(false)
    }
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white shrink-0">
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
                {msg.content}
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
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${partnerName}…`}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy max-h-32"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 bg-brand-navy text-white rounded-xl flex items-center justify-center hover:bg-brand-navy/90 transition-colors disabled:opacity-40 shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
