# Audio Calling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add peer-to-peer audio calling between participants using WebRTC and Supabase Realtime Broadcast for signaling.

**Architecture:** A `CallContextProvider` (React Context) wraps the dashboard layout and owns all WebRTC + signaling state. Components read from context via `useCallContext()`. A single hidden `<audio>` element in the provider plays the remote stream. Each user subscribes to their own `call-signal:{userId}` Broadcast channel; to send a signal to a partner the sender temporarily subscribes to the partner's channel and broadcasts.

**Tech Stack:** WebRTC (browser-native), Supabase Realtime Broadcast, React Context, Lucide icons, Tailwind CSS.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `context/CallContext.tsx` | All WebRTC + signaling state, provider + hook |
| Create | `components/features/chat/CallUI.tsx` | Renders incoming/outgoing/in-call overlays from context |
| Create | `components/features/chat/CallButton.tsx` | Phone icon button in chat header |
| Modify | `app/dashboard/layout.tsx` | Wrap with `CallContextProvider`, render `CallUI` |
| Modify | `components/features/chat/MessageThread.tsx` | Add `CallButton` to header |

---

## Task 1: CallContext — core state, signaling, WebRTC

**Files:**
- Create: `context/CallContext.tsx`

- [ ] **Step 1: Create the file with types and context shape**

```tsx
"use client"

import {
  createContext, useCallback, useContext, useEffect,
  useMemo, useRef, useState,
} from "react"
import { createClient } from "@/lib/supabase/client"

// ─── Types ──────────────────────────────────────────────────────────────────

export type CallState = "idle" | "calling" | "incoming" | "connected"

export type SignalMessage =
  | { type: "call-offer";  from: string; fromName: string; sdp: RTCSessionDescriptionInit }
  | { type: "call-answer"; from: string; sdp: RTCSessionDescriptionInit }
  | { type: "call-ice";    from: string; candidate: RTCIceCandidateInit }
  | { type: "call-reject"; from: string }
  | { type: "call-end";    from: string }

export interface CallContextValue {
  callState: CallState
  incomingCallerName: string | null
  activePartnerName: string | null
  isMuted: boolean
  callDuration: number
  startCall: (partnerId: string, partnerName: string) => Promise<void>
  acceptCall: () => Promise<void>
  rejectCall: () => void
  endCall: () => void
  toggleMute: () => void
}

const CallContext = createContext<CallContextValue | null>(null)

export function useCallContext(): CallContextValue {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error("useCallContext must be inside CallContextProvider")
  return ctx
}

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
}
```

- [ ] **Step 2: Add the provider component**

Append to `context/CallContext.tsx`:

```tsx
interface ProviderProps {
  currentUserId: string
  children: React.ReactNode
}

export function CallContextProvider({ currentUserId, children }: ProviderProps) {
  const supabase    = useMemo(() => createClient(), [])
  const [callState, setCallState]             = useState<CallState>("idle")
  const [incomingCallerName, setIncomingCallerName] = useState<string | null>(null)
  const [activePartnerName, setActivePartnerName]   = useState<string | null>(null)
  const [isMuted, setIsMuted]                 = useState(false)
  const [callDuration, setCallDuration]       = useState(0)
  const [myName, setMyName]                   = useState("")

  // Refs so signal handler doesn't capture stale closures
  const callStateRef       = useRef<CallState>("idle")
  const partnerIdRef       = useRef<string | null>(null)
  const incomingOfferRef   = useRef<RTCSessionDescriptionInit | null>(null)
  const incomingCallerIdRef= useRef<string | null>(null)

  const pcRef              = useRef<RTCPeerConnection | null>(null)
  const localStreamRef     = useRef<MediaStream | null>(null)
  const remoteAudioRef     = useRef<HTMLAudioElement | null>(null)
  const timerRef           = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingICERef      = useRef<RTCIceCandidateInit[]>([])

  // Keep callStateRef in sync
  useEffect(() => { callStateRef.current = callState }, [callState])

  // Fetch caller's own name once
  useEffect(() => {
    if (!currentUserId) return
    supabase.from("profiles").select("full_name").eq("id", currentUserId).single()
      .then(({ data }) => { if (data) setMyName(data.full_name) })
  }, [currentUserId, supabase])

  // ─── Helpers ──────────────────────────────────────────────────────────────

  async function sendSignal(toUserId: string, msg: SignalMessage) {
    const ch = supabase.channel(`call-signal:${toUserId}`)
    await new Promise<void>((resolve) => {
      ch.subscribe((status) => { if (status === "SUBSCRIBED") resolve() })
    })
    await ch.send({ type: "broadcast", event: "signal", payload: msg })
    supabase.removeChannel(ch)
  }

  function cleanup() {
    if (timerRef.current)   { clearInterval(timerRef.current);   timerRef.current   = null }
    if (timeoutRef.current) { clearTimeout(timeoutRef.current);  timeoutRef.current = null }
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    localStreamRef.current = null
    pcRef.current?.close()
    pcRef.current = null
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null
    pendingICERef.current = []
    partnerIdRef.current  = null
    incomingOfferRef.current   = null
    incomingCallerIdRef.current = null
    setCallState("idle")
    setIncomingCallerName(null)
    setActivePartnerName(null)
    setIsMuted(false)
    setCallDuration(0)
  }

  function createPC(remoteId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection(ICE_CONFIG)

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        sendSignal(remoteId, { type: "call-ice", from: currentUserId, candidate: candidate.toJSON() })
      }
    }

    pc.ontrack = (e) => {
      if (remoteAudioRef.current && e.streams[0]) {
        remoteAudioRef.current.srcObject = e.streams[0]
        remoteAudioRef.current.play().catch(() => {})
      }
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
        setCallState("connected")
        setCallDuration(0)
        timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000)
      } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        cleanup()
      }
    }

    return pc
  }

  // ─── Signal handler ───────────────────────────────────────────────────────

  // Re-assigned every render so the subscription handler always has fresh refs
  const handleSignalRef = useRef<(msg: SignalMessage) => void>(() => {})

  handleSignalRef.current = (msg: SignalMessage) => {
    if (msg.type === "call-offer") {
      if (callStateRef.current !== "idle") {
        sendSignal(msg.from, { type: "call-reject", from: currentUserId })
        return
      }
      incomingCallerIdRef.current = msg.from
      incomingOfferRef.current    = msg.sdp
      partnerIdRef.current        = msg.from
      setIncomingCallerName(msg.fromName)
      setActivePartnerName(msg.fromName)
      setCallState("incoming")
      timeoutRef.current = setTimeout(() => {
        if (callStateRef.current === "incoming") cleanup()
      }, 30000)

    } else if (msg.type === "call-answer") {
      pcRef.current?.setRemoteDescription(msg.sdp).then(async () => {
        for (const c of pendingICERef.current) {
          await pcRef.current?.addIceCandidate(c)
        }
        pendingICERef.current = []
      })

    } else if (msg.type === "call-ice") {
      if (pcRef.current?.remoteDescription) {
        pcRef.current.addIceCandidate(msg.candidate)
      } else {
        pendingICERef.current.push(msg.candidate)
      }

    } else if (msg.type === "call-reject" || msg.type === "call-end") {
      cleanup()
    }
  }

  // Subscribe to own inbox channel
  useEffect(() => {
    if (!currentUserId) return
    const ch = supabase
      .channel(`call-signal:${currentUserId}`)
      .on("broadcast", { event: "signal" }, ({ payload }) => {
        handleSignalRef.current(payload as SignalMessage)
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [currentUserId, supabase])

  // ─── Public API ───────────────────────────────────────────────────────────

  const startCall = useCallback(async (toPartnerId: string, toPartnerName: string) => {
    if (callStateRef.current !== "idle") return
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch {
      return // microphone denied — silently return; UI stays idle
    }
    localStreamRef.current = stream
    partnerIdRef.current   = toPartnerId
    setActivePartnerName(toPartnerName)
    setCallState("calling")

    const pc = createPC(toPartnerId)
    pcRef.current = pc
    stream.getTracks().forEach(t => pc.addTrack(t, stream))

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    await sendSignal(toPartnerId, {
      type: "call-offer", from: currentUserId, fromName: myName, sdp: offer,
    })
    timeoutRef.current = setTimeout(() => cleanup(), 30000)
  }, [currentUserId, myName]) // eslint-disable-line react-hooks/exhaustive-deps

  const acceptCall = useCallback(async () => {
    if (callStateRef.current !== "incoming" || !incomingCallerIdRef.current || !incomingOfferRef.current) return
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch {
      cleanup()
      return
    }
    localStreamRef.current = stream

    const callerId = incomingCallerIdRef.current
    const offer    = incomingOfferRef.current

    const pc = createPC(callerId)
    pcRef.current = pc
    stream.getTracks().forEach(t => pc.addTrack(t, stream))

    await pc.setRemoteDescription(offer)
    for (const c of pendingICERef.current) await pc.addIceCandidate(c)
    pendingICERef.current = []

    const answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)
    await sendSignal(callerId, { type: "call-answer", from: currentUserId, sdp: answer })
  }, [currentUserId]) // eslint-disable-line react-hooks/exhaustive-deps

  const rejectCall = useCallback(() => {
    if (incomingCallerIdRef.current) {
      sendSignal(incomingCallerIdRef.current, { type: "call-reject", from: currentUserId })
    }
    cleanup()
  }, [currentUserId]) // eslint-disable-line react-hooks/exhaustive-deps

  const endCall = useCallback(() => {
    if (partnerIdRef.current) {
      sendSignal(partnerIdRef.current, { type: "call-end", from: currentUserId })
    }
    cleanup()
  }, [currentUserId]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleMute = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0]
    if (!track) return
    track.enabled = !track.enabled
    setIsMuted(!track.enabled)
  }, [])

  return (
    <CallContext.Provider value={{
      callState, incomingCallerName, activePartnerName,
      isMuted, callDuration,
      startCall, acceptCall, rejectCall, endCall, toggleMute,
    }}>
      {children}
      {/* Hidden element that receives the remote audio stream */}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
    </CallContext.Provider>
  )
}
```

- [ ] **Step 3: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add context/CallContext.tsx
git commit -m "feat: CallContext — WebRTC + Supabase signaling state"
```

---

## Task 2: CallUI — all call overlays

**Files:**
- Create: `components/features/chat/CallUI.tsx`

This single component renders one of three states based on `callState` from context:
- `"incoming"` → ringing overlay (accept / decline)
- `"calling"` → outgoing overlay ("Calling…" + cancel)
- `"connected"` → in-call bar (mute + end + timer)

- [ ] **Step 1: Create the file**

```tsx
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
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/features/chat/CallUI.tsx
git commit -m "feat: CallUI — incoming, outgoing, and in-call overlays"
```

---

## Task 3: CallButton component

**Files:**
- Create: `components/features/chat/CallButton.tsx`

- [ ] **Step 1: Create the file**

```tsx
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
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/features/chat/CallButton.tsx
git commit -m "feat: CallButton — phone icon for chat header"
```

---

## Task 4: Wire CallContextProvider and CallUI into dashboard layout

**Files:**
- Modify: `app/dashboard/layout.tsx`

Current file content:
```tsx
import { createClient } from "@/lib/supabase/server"
import DashboardSidebar from "@/components/layout/DashboardSidebar"
import DashboardContentWrapper from "@/components/layout/DashboardContentWrapper"
import MobileNav from "@/components/layout/MobileNav"
import PresenceHeartbeat from "@/components/features/dashboard/PresenceHeartbeat"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",").map((e) => e.trim()).filter(Boolean)

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = ADMIN_EMAILS.includes(user?.email ?? "")

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <DashboardSidebar isAdmin={isAdmin} />
      <DashboardContentWrapper>
        <PresenceHeartbeat />
        {children}
      </DashboardContentWrapper>
      <MobileNav isAdmin={isAdmin} />
    </div>
  )
}
```

- [ ] **Step 1: Update the layout to add provider and overlays**

Replace the entire file with:

```tsx
import { createClient } from "@/lib/supabase/server"
import DashboardSidebar from "@/components/layout/DashboardSidebar"
import DashboardContentWrapper from "@/components/layout/DashboardContentWrapper"
import MobileNav from "@/components/layout/MobileNav"
import PresenceHeartbeat from "@/components/features/dashboard/PresenceHeartbeat"
import { CallContextProvider } from "@/context/CallContext"
import CallUI from "@/components/features/chat/CallUI"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",").map((e) => e.trim()).filter(Boolean)

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = ADMIN_EMAILS.includes(user?.email ?? "")

  return (
    <CallContextProvider currentUserId={user?.id ?? ""}>
      <div className="flex min-h-screen bg-brand-bg">
        <DashboardSidebar isAdmin={isAdmin} />
        <DashboardContentWrapper>
          <PresenceHeartbeat />
          {children}
        </DashboardContentWrapper>
        <MobileNav isAdmin={isAdmin} />
        <CallUI />
      </div>
    </CallContextProvider>
  )
}
```

- [ ] **Step 2: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/layout.tsx
git commit -m "feat: wire CallContextProvider and CallUI into dashboard layout"
```

---

## Task 5: Add CallButton to MessageThread header

**Files:**
- Modify: `components/features/chat/MessageThread.tsx`

The chat header lives at lines 297–327. It currently ends with the partner name + status `<div>` and closes the header `<div>` at line 327.

- [ ] **Step 1: Add the import**

At the top of `MessageThread.tsx`, add `CallButton` to the imports (after the existing imports):

```tsx
import CallButton from "@/components/features/chat/CallButton"
```

- [ ] **Step 2: Add the button to the header**

Find this section in the header (the closing tag of the `<div>` that holds name + status, around line 326–327):

```tsx
        </div>
      </div>

      {/* Messages */}
```

Replace with:

```tsx
        </div>
        {/* Call button — pushed to the right edge of the header */}
        <div className="ml-auto shrink-0">
          <CallButton partnerId={partnerId} partnerName={partnerName} />
        </div>
      </div>

      {/* Messages */}
```

- [ ] **Step 3: Type-check**

```
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/features/chat/MessageThread.tsx
git commit -m "feat: add CallButton to chat thread header"
```

---

## Verification

1. Open a chat thread — a `Phone` icon appears in the top-right of the header.
2. Open the same chat thread as a different user in another browser tab or device.
3. Tap the Phone icon on User A → "Calling [Name]…" overlay appears; User B sees a ringing overlay with Accept/Decline.
4. User B taps Accept → both see the in-call bar at the bottom with a live timer.
5. Tap the mic icon → turns red (muted); tap again → back to white (unmuted).
6. Tap End Call → both call bars dismiss, both sides return to idle.
7. User B declines → User A's "Calling…" overlay dismisses.
8. Start a call, then wait 30 seconds without answering → auto-declines on both sides.
9. While connected, navigate to `/dashboard` — in-call bar remains visible (it's in the global layout).
10. `npx tsc --noEmit` — no errors.
