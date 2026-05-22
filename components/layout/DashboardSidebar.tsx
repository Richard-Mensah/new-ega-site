"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Home, BookOpen, Folder, Users, Briefcase, Globe, Settings, LogOut, ShieldCheck, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Overview" },
  { href: "/dashboard/learning", icon: BookOpen, label: "Learning" },
  { href: "/dashboard/projects", icon: Folder, label: "Projects" },
  { href: "/dashboard/community", icon: Globe, label: "Community" },
  { href: "/dashboard/mentor", icon: Users, label: "Mentor" },
  { href: "/dashboard/portfolio", icon: Briefcase, label: "Portfolio" },
  { href: "/dashboard/chat", icon: MessageCircle, label: "Chat" },
]

export default function DashboardSidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [unreadCount, setUnreadCount] = useState(0)
  const [sidebarUserId, setSidebarUserId] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  async function fetchUnread() {
    const res = await fetch("/api/messages/unread-count")
    if (!res.ok) return
    const { count } = await res.json()
    setUnreadCount(count ?? 0)
  }

  // On mount: get user, fetch initial count, subscribe to new messages
  useEffect(() => {
    let cancelled = false
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return
      setSidebarUserId(user.id)
      await fetchUnread()

      const ch = supabase
        .channel(`sidebar-unread:${user.id}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages", filter: `recipient_id=eq.${user.id}` },
          () => { setUnreadCount((prev) => prev + 1) }
        )
        .subscribe()
      channelRef.current = ch
    }
    init()
    return () => {
      cancelled = true
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch when route changes (handles messages being marked as read)
  useEffect(() => {
    if (!sidebarUserId) return
    if (pathname.startsWith("/dashboard/chat/")) {
      const t = setTimeout(fetchUnread, 700)
      return () => clearTimeout(t)
    }
    fetchUnread()
  }, [pathname, sidebarUserId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-14 bg-brand-navy flex flex-col items-center py-4 gap-1 z-30 shadow-lg">
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
        const isChat = href === "/dashboard/chat"
        return (
          <Link
            key={href}
            href={href}
            title={label}
            className={cn(
              "group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
              isActive
                ? "bg-brand-gold text-white"
                : "text-white/60 hover:text-white hover:bg-white/10"
            )}
          >
            <div className="relative">
              <Icon size={20} />
              {isChat && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[1rem] h-4 text-[9px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center px-0.5 leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {label}{isChat && unreadCount > 0 ? ` (${unreadCount})` : ""}
            </span>
          </Link>
        )
      })}

      <div className="flex-1" />

      {isAdmin && (
        <Link
          href="/dashboard/admin"
          title="Manage Participants"
          className={cn(
            "group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all",
            pathname.startsWith("/dashboard/admin")
              ? "bg-brand-gold text-white"
              : "text-amber-400/80 hover:text-amber-300 hover:bg-white/10"
          )}
        >
          <ShieldCheck size={20} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Manage Participants
          </span>
        </Link>
      )}

      <Link
        href="/dashboard/settings"
        title="Settings"
        className={cn(
          "group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all",
          pathname.startsWith("/dashboard/settings")
            ? "bg-brand-gold text-white"
            : "text-white/60 hover:text-white hover:bg-white/10"
        )}
      >
        <Settings size={20} />
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          Settings
        </span>
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        title="Sign Out"
        className="group relative flex items-center justify-center w-10 h-10 rounded-xl text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
      >
        <LogOut size={20} />
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          Sign Out
        </span>
      </button>
    </aside>
  )
}
