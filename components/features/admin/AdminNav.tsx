"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, GraduationCap, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"

const TABS = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/admin/participants", label: "Participants", icon: Users, exact: false },
  { href: "/dashboard/admin/mentors", label: "Mentors", icon: GraduationCap, exact: false },
  { href: "/dashboard/admin/pairings", label: "Pairings", icon: GitBranch, exact: false },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
      {TABS.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-white text-brand-navy shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-white/60"
            )}
          >
            <Icon size={15} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
