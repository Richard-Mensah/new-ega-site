"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function DashboardContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isChatPage = pathname.startsWith("/dashboard/chat")
  return (
    <div className={cn(
      "flex-1 flex flex-col md:ml-14 pb-20 md:pb-0",
      isChatPage ? "overflow-hidden" : "min-h-screen"
    )}>
      {children}
    </div>
  )
}
