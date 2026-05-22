"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
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
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    fetch("/api/messages/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id: partnerId }),
    })
  }, [partnerId])

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${currentUserId}:${partnerId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${currentUserId}`,
        },
        (payload) => {
          const msg = payload.new as ChatMessage
          if (msg.sender_id === partnerId) {
            setMessages((prev) => [...prev, msg])
            fetch("/api/messages/read", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sender_id: partnerId }),
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [supabase, currentUserId, partnerId])

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
      }
    } finally {
      setSending(false)
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
        <ProfileAvatar avatarUrl={partnerAvatar} fullName={partnerName} size="md" />
        <p className="font-bold text-brand-navy">{partnerName}</p>
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
            onChange={(e) => setInput(e.target.value)}
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
