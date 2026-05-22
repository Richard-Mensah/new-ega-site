import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import ConversationList, { type Conversation } from "@/components/features/chat/ConversationList"
import MessageThread, { type ChatMessage } from "@/components/features/chat/MessageThread"
import { MessageCircle } from "lucide-react"

export default async function ChatThreadPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId: partnerId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: partnerRaw }, { data: threadRaw }, { data: allRaw }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, avatar_url").eq("id", partnerId).single(),
    supabase
      .from("messages")
      .select("id, sender_id, recipient_id, content, read_at, created_at")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true })
      .limit(200),
    supabase
      .from("messages")
      .select("id, sender_id, recipient_id, content, read_at, created_at, sender:profiles!sender_id(id, full_name, avatar_url), recipient:profiles!recipient_id(id, full_name, avatar_url)")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(500),
  ])

  if (!partnerRaw) notFound()

  const partner = partnerRaw as { id: string; full_name: string; avatar_url: string | null }
  const threadMessages = (threadRaw ?? []) as ChatMessage[]

  type RawMsg = {
    id: string; sender_id: string; recipient_id: string; content: string; read_at: string | null; created_at: string
    sender: { id: string; full_name: string; avatar_url: string | null } | null
    recipient: { id: string; full_name: string; avatar_url: string | null } | null
  }

  const convMap = new Map<string, Conversation>()
  for (const msg of ((allRaw ?? []) as RawMsg[])) {
    const isMe = msg.sender_id === user.id
    const convPartnerId = isMe ? msg.recipient_id : msg.sender_id
    const convPartner = isMe ? msg.recipient : msg.sender
    if (!convPartner || convMap.has(convPartnerId)) continue
    const unread = !isMe && !msg.read_at ? 1 : 0
    convMap.set(convPartnerId, {
      partnerId: convPartnerId,
      partnerName: convPartner.full_name,
      partnerAvatar: convPartner.avatar_url,
      lastMessage: msg.content,
      lastAt: msg.created_at,
      unread,
    })
  }

  if (!convMap.has(partnerId)) {
    convMap.set(partnerId, {
      partnerId,
      partnerName: partner.full_name,
      partnerAvatar: partner.avatar_url,
      lastMessage: "No messages yet",
      lastAt: new Date().toISOString(),
      unread: 0,
    })
  }

  const conversations = Array.from(convMap.values())

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="hidden md:flex md:w-80 border-r border-gray-100 bg-white flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <MessageCircle size={18} className="text-brand-navy" />
          <h1 className="font-bold text-brand-navy">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList conversations={conversations} currentUserId={user.id} />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <MessageThread
          currentUserId={user.id}
          partnerId={partnerId}
          partnerName={partner.full_name}
          partnerAvatar={partner.avatar_url}
          initialMessages={threadMessages}
        />
      </div>
    </div>
  )
}
