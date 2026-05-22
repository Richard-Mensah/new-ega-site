"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatThread = /^\/dashboard\/chat\/.+/.test(pathname)
  return (
    <div className={cn(
      "flex-1 flex flex-col min-h-screen pb-20 md:pb-0",
      isChatThread ? "md:ml-14" : "md:ml-14"
    )}>
      {children}
    </div>
  )
}
