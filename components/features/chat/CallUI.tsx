"use client"

import { Phone, PhoneOff, PhoneCall, MicOff, Mic } from "lucide-react"
import { useCallContext } from "@/context/CallContext"
import { cn } from "@/lib/utils"

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0")
  const s = (secs % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export default function CallUI() {
  const {
    callState, incomingCallerName, activePartnerName,
    isMuted, callDuration,
    acceptCall, rejectCall, endCall, toggleMute,
  } = useCallContext()

  if (callState === "idle") return null

  // ── Incoming call ──────────────────────────────────────────────────────────
  if (callState === "incoming") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-72 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-200">
          {/* Pulsing ring */}
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center">
              <PhoneCall size={36} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Incoming call</p>
            <p className="text-xl font-bold text-brand-navy mt-1">{incomingCallerName}</p>
          </div>
          <div className="flex gap-8">
            {/* Decline */}
            <button
              type="button"
              onClick={rejectCall}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors"
              aria-label="Decline call"
            >
              <PhoneOff size={24} className="text-white" />
            </button>
            {/* Accept */}
            <button
              type="button"
              onClick={acceptCall}
              className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-lg transition-colors"
              aria-label="Accept call"
            >
              <Phone size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Outgoing / calling ─────────────────────────────────────────────────────
  if (callState === "calling") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-72 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-200">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-brand-navy/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center">
              <Phone size={36} className="text-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Calling…</p>
            <p className="text-xl font-bold text-brand-navy mt-1">{activePartnerName}</p>
          </div>
          <button
            type="button"
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-lg transition-colors"
            aria-label="Cancel call"
          >
            <PhoneOff size={24} className="text-white" />
          </button>
        </div>
      </div>
    )
  }

  // ── Connected / in-call bar ────────────────────────────────────────────────
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <div className="mb-4 mx-4 bg-brand-navy text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-6 w-full max-w-sm">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/60 leading-none">In call with</p>
          <p className="font-semibold truncate mt-0.5">{activePartnerName}</p>
        </div>
        <span className="text-sm text-white/70 tabular-nums shrink-0">
          {formatDuration(callDuration)}
        </span>
        {/* Mute toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors",
            isMuted ? "bg-red-500/80 hover:bg-red-600" : "bg-white/10 hover:bg-white/20"
          )}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        {/* End call */}
        <button
          type="button"
          onClick={endCall}
          className="w-11 h-11 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shrink-0 transition-colors"
          aria-label="End call"
        >
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  )
}
