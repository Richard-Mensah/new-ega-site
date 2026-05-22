"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  Home, BookOpen, Folder, Globe, Users, Briefcase,
  MessageCircle, Settings, LogOut, ShieldCheck, LayoutGrid, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const NAV_ITEMS = [
  { href: "/dashboard", icon: Home, label: "Overview" },
  { href: "/dashboard/learning", icon: BookOpen, label: "Learning" },
  { href: "/dashboard/projects", icon: Folder, label: "Projects" },
  { href: "/dashboard/community", icon: Globe, label: "Community" },
  { href: "/dashboard/mentor", icon: Users, label: "Mentor" },
  { href: "/dashboard/portfolio", icon: Briefcase, label: "Portfolio" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

interface MobileNavProps {
  isAdmin?: boolean
}

export default function MobileNav({ isAdmin = false }: MobileNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useRef(createClient()).current
  const [open, setOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  async function fetchUnread() {
    const res = await fetch("/api/messages/unread-count")
    if (!res.ok) return
    const { count } = await res.json()
    setUnreadCount(count ?? 0)
  }

  useEffect(() => {
    let cancelled = false
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return
      setUserId(user.id)
      await fetchUnread()
      const ch = supabase
        .channel(`mobile-nav-unread:${user.id}`)
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

  useEffect(() => {
    if (!userId) return
    if (pathname.startsWith("/dashboard/chat/")) {
      const t = setTimeout(fetchUnread, 700)
      return () => clearTimeout(t)
    }
    fetchUnread()
    setOpen(false)
  }, [pathname, userId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const allItems = [
    ...NAV_ITEMS,
    ...(isAdmin ? [{ href: "/dashboard/admin", icon: ShieldCheck, label: "Admin" }] : []),
  ]

  // Items rendered bottom-to-top: last item appears just above the FAB
  const orderedItems = [...allItems].reverse()

  return (
    <div className="md:hidden">
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Speed-dial nav pills — above menu FAB */}
      <div className="fixed bottom-20 left-4 z-50 flex flex-col-reverse gap-2">
        {orderedItems.map(({ href, icon: Icon, label }, index) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold transition-all duration-200",
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
                isActive
                  ? "bg-brand-gold text-white"
                  : "bg-brand-navy text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
        {/* Sign out pill */}
        <button
          type="button"
          onClick={handleLogout}
          style={{ transitionDelay: open ? `${orderedItems.length * 35}ms` : "0ms" }}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold transition-all duration-200",
            open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
            "bg-brand-navy text-red-400"
          )}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* Menu FAB — bottom-left */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-4 left-4 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200",
          open ? "bg-brand-gold rotate-90" : "bg-brand-navy"
        )}
        aria-label="Navigation menu"
      >
        {open ? <X size={24} /> : <LayoutGrid size={22} />}
      </button>

      {/* Chat FAB — bottom-right */}
      <Link
        href="/dashboard/chat"
        className={cn(
          "fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-brand-navy shadow-xl flex items-center justify-center text-white transition-all duration-200",
          unreadCount > 0 && "ring-2 ring-brand-gold ring-offset-2"
        )}
        aria-label="Chat"
      >
        <div className="relative">
          <MessageCircle size={24} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[1.1rem] h-[1.1rem] text-[9px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center px-0.5 leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </Link>
    </div>
  )
}
