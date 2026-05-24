"use client"

import { useEffect } from "react"
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
    isMuted, callDuration, callError,
    acceptCall, rejectCall, endCall, toggleMute, clearCallError,
  } = useCallContext()

  useEffect(() => {
    if (callState !== "incoming" && callState !== "calling") return
    let ctx: AudioContext | null = null
    let active = true

    const play = async (onMs: number, offMs: number) => {
      try { ctx = new AudioContext() } catch { return }
      try { await ctx.resume() } catch { /* suspended on iOS without user gesture */ }
      while (active) {
        const g = ctx.createGain()
        g.gain.value = 0.18
        g.connect(ctx.destination)
        const oscs = [440, 480].map(hz => {
          const o = ctx!.createOscillator()
          o.frequency.value = hz
          o.connect(g)
          o.start()
          return o
        })
        await new Promise(r => setTimeout(r, onMs))
        oscs.forEach(o => o.stop())
        if (!active) break
        await new Promise(r => setTimeout(r, offMs))
      }
    }

    if (callState === "incoming") play(2000, 4000)
    else play(1000, 3000)

    return () => {
      active = false
      ctx?.close()
    }
  }, [callState])

  const errorToast = callError ? (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg flex items-center gap-3 max-w-xs">
      <span className="flex-1 min-w-0 truncate">{callError}</span>
      <button type="button" onClick={clearCallError} className="shrink-0 hover:opacity-75">✕</button>
    </div>
  ) : null

  if (callState === "idle") return errorToast

  // ── Incoming call ──────────────────────────────────────────────────────────
  if (callState === "incoming") {
    return (
      <>
        {errorToast}
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
              <p className="text-xl font-bold text-brand-navy mt-1">{incomingCallerName ?? "Unknown"}</p>
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
      </>
    )
  }

  // ── Outgoing / calling ─────────────────────────────────────────────────────
  if (callState === "calling") {
    return (
      <>
        {errorToast}
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
              <p className="text-xl font-bold text-brand-navy mt-1">{activePartnerName ?? "Unknown"}</p>
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
      </>
    )
  }

  // ── Connected / in-call bar ────────────────────────────────────────────────
  return (
    <>
      {errorToast}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
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
    </>
  )
}
