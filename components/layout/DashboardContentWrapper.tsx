"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatThread = /^\/dashboard\/chat\/.+/.test(pathname)
  return (
    <div className={cn(
      "flex-1 flex flex-col min-h-screen",
      isChatThread ? "md:ml-14" : "ml-14"
    )}>
      {children}
    </div>
  )
}
