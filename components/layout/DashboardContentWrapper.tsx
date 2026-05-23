"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatPage = pathname.startsWith("/dashboard/chat")
  return (
    <div className={cn(
      "flex-1 flex flex-col min-h-0 md:ml-14",
      isChatPage
        ? "overflow-hidden"
        : "overflow-y-auto overflow-x-hidden pb-20 md:pb-0"
    )}>
      {children}
    </div>
  )
}
