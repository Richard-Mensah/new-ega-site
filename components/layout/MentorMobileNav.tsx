"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Home, BarChart2, Users, Calendar, Globe, Settings, LogOut, LayoutGrid, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

const NAV_ITEMS = [
  { href: "/mentor", icon: Home, label: "Overview" },
  { href: "/mentor/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/mentor/mentees", icon: Users, label: "Mentees" },
  { href: "/mentor/sessions", icon: Calendar, label: "Sessions" },
  { href: "/mentor/participants", icon: Globe, label: "Participants" },
  { href: "/mentor/settings", icon: Settings, label: "Settings" },
]

export default function MentorMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  const orderedItems = [...NAV_ITEMS].reverse()

  return (
    <div className="md:hidden">
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Speed-dial pills above menu FAB */}
      <div className="fixed bottom-20 left-4 z-50 flex flex-col-reverse gap-2">
        {orderedItems.map(({ href, icon: Icon, label }, index) => {
          const isActive = pathname === href || (href !== "/mentor" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold transition-all duration-200",
                open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
                isActive ? "bg-brand-gold text-white" : "bg-brand-navy text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
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
    </div>
  )
}
