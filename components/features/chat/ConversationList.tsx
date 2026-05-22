"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import { cn } from "@/lib/utils"

export type Conversation = {
  partnerId: string
  partnerName: string
  partnerAvatar: string | null
  lastMessage: string
  lastAt: string
  unread: number
}

type Props = {
  conversations: Conversation[]
  currentUserId: string
}

export default function ConversationList({ conversations }: Props) {
  const pathname = usePathname()

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-sm text-center px-4">
        <p>No conversations yet.</p>
        <p className="text-xs mt-1">Use the Chat button on a participant or mentor profile to start one.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((c) => {
        const isActive = pathname === `/dashboard/chat/${c.partnerId}`
        return (
          <Link
            key={c.partnerId}
            href={`/dashboard/chat/${c.partnerId}`}
            className={cn(
              "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors",
              isActive && "bg-brand-navy/5"
            )}
          >
            <div className="relative shrink-0">
              <ProfileAvatar avatarUrl={c.partnerAvatar} fullName={c.partnerName} size="md" />
              {c.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {c.unread > 9 ? "9+" : c.unread}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm truncate", c.unread > 0 ? "font-bold text-brand-navy" : "font-medium text-gray-800")}>
                {c.partnerName}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{c.lastMessage}</p>
            </div>
            <span className="text-[10px] text-gray-400 shrink-0">
              {new Date(c.lastAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
