"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, Users, Calendar, Globe, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

const NAV_ITEMS = [
  { href: "/mentor", icon: Home, label: "Overview" },
  { href: "/mentor/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/mentor/mentees", icon: Users, label: "Mentees" },
  { href: "/mentor/sessions", icon: Calendar, label: "Sessions" },
  { href: "/mentor/participants", icon: Globe, label: "Participants" },
]

export default function MentorSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-14 bg-brand-navy flex-col items-center py-4 gap-1 z-30 shadow-lg">
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || (href !== "/mentor" && pathname.startsWith(href))
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
            <Icon size={20} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {label}
            </span>
          </Link>
        )
      })}

      <div className="flex-1" />

      <Link
        href="/mentor/settings"
        title="Settings"
        className={cn(
          "group relative flex items-center justify-center w-10 h-10 rounded-xl transition-all",
          pathname.startsWith("/mentor/settings")
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
