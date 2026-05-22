import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ConversationList, { type Conversation } from "@/components/features/chat/ConversationList"
import { MessageCircle } from "lucide-react"

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: rawMessages } = await supabase
    .from("messages")
    .select("id, sender_id, recipient_id, content, read_at, created_at, sender:profiles!sender_id(id, full_name, avatar_url), recipient:profiles!recipient_id(id, full_name, avatar_url)")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(500)

  type RawMsg = {
    id: string; sender_id: string; recipient_id: string; content: string; read_at: string | null; created_at: string
    sender: { id: string; full_name: string; avatar_url: string | null } | null
    recipient: { id: string; full_name: string; avatar_url: string | null } | null
  }

  const convMap = new Map<string, Conversation>()
  for (const msg of ((rawMessages ?? []) as RawMsg[])) {
    const isMe = msg.sender_id === user.id
    const partner = isMe ? msg.recipient : msg.sender
    const partnerId = isMe ? msg.recipient_id : msg.sender_id
    if (!partner || convMap.has(partnerId)) continue
    const unread = !isMe && !msg.read_at ? 1 : 0
    convMap.set(partnerId, {
      partnerId,
      partnerName: partner.full_name,
      partnerAvatar: partner.avatar_url,
      lastMessage: msg.content,
      lastAt: msg.created_at,
      unread,
    })
  }

  const conversations = Array.from(convMap.values())

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 border-r border-gray-100 bg-white flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <MessageCircle size={18} className="text-brand-navy" />
          <h1 className="font-bold text-brand-navy">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList conversations={conversations} currentUserId={user.id} />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
        <div className="text-center">
          <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a conversation</p>
        </div>
      </div>
    </div>
  )
}
