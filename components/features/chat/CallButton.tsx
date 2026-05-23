"use client"

import { Phone } from "lucide-react"
import { useCallContext } from "@/context/CallContext"
import { cn } from "@/lib/utils"

interface CallButtonProps {
  partnerId: string
  partnerName: string
}

export default function CallButton({ partnerId, partnerName }: CallButtonProps) {
  const { callState, startCall } = useCallContext()
  const isIdle = callState === "idle"

  return (
    <button
      type="button"
      disabled={!isIdle}
      onClick={() => startCall(partnerId, partnerName)}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-xl transition-all",
        isIdle
          ? "text-brand-navy hover:bg-brand-navy/10"
          : "text-gray-300 cursor-not-allowed"
      )}
      aria-label="Start audio call"
    >
      <Phone size={20} />
    </button>
  )
}
