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
  callError: string | null
  startCall: (partnerId: string, partnerName: string) => Promise<void>
  acceptCall: () => Promise<void>
  rejectCall: () => void
  endCall: () => void
  toggleMute: () => void
  clearCallError: () => void
}

const CallContext = createContext<CallContextValue | null>(null)

export function useCallContext(): CallContextValue {
  const ctx = useContext(CallContext)
  if (!ctx) throw new Error("useCallContext must be inside CallContextProvider")
  return ctx
}

const iceServers: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }]
if (process.env.NEXT_PUBLIC_TURN_URLS) {
  iceServers.push({
    urls: process.env.NEXT_PUBLIC_TURN_URLS.split(","),
    username: process.env.NEXT_PUBLIC_TURN_USERNAME ?? "",
    credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL ?? "",
  })
}
const ICE_CONFIG: RTCConfiguration = { iceServers }

interface ProviderProps {
  currentUserId: string
  children: React.ReactNode
}

export function CallContextProvider({ currentUserId, children }: ProviderProps) {
  const supabase    = useMemo(() => createClient(), [])
  const [callState, setCallState]                   = useState<CallState>("idle")
  const [incomingCallerName, setIncomingCallerName] = useState<string | null>(null)
  const [activePartnerName, setActivePartnerName]   = useState<string | null>(null)
  const [isMuted, setIsMuted]                       = useState(false)
  const [callDuration, setCallDuration]             = useState(0)
  const [callError, setCallError]                   = useState<string | null>(null)
  const [myName, setMyName]                         = useState("")

  // Refs so signal handler never captures stale closures
  const callStateRef        = useRef<CallState>("idle")
  const partnerIdRef        = useRef<string | null>(null)
  const incomingOfferRef    = useRef<RTCSessionDescriptionInit | null>(null)
  const incomingCallerIdRef = useRef<string | null>(null)

  const pcRef               = useRef<RTCPeerConnection | null>(null)
  const localStreamRef      = useRef<MediaStream | null>(null)
  const remoteAudioRef      = useRef<HTMLAudioElement | null>(null)
  const timerRef            = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef          = useRef<ReturnType<typeof setTimeout> | null>(null)
  const disconnectTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingICERef       = useRef<RTCIceCandidateInit[]>([])
  const outChannelRef       = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const outChannelTargetRef = useRef<string | null>(null)
  const callDurationRef     = useRef(0)

  // Keep refs in sync with state
  useEffect(() => { callStateRef.current = callState }, [callState])
  useEffect(() => { callDurationRef.current = callDuration }, [callDuration])

  // Fetch caller's own display name once
  useEffect(() => {
    if (!currentUserId) return
    supabase.from("profiles").select("full_name").eq("id", currentUserId).single()
      .then(({ data }) => { if (data) setMyName(data.full_name) })
  }, [currentUserId, supabase])

  // ─── Helpers ──────────────────────────────────────────────────────────────

  async function sendSignal(toUserId: string, msg: SignalMessage) {
    if (!outChannelRef.current || outChannelTargetRef.current !== toUserId) {
      if (outChannelRef.current) supabase.removeChannel(outChannelRef.current)
      const ch = supabase.channel(`call-signal:${toUserId}`)
      await new Promise<void>((resolve, reject) => {
        const t = setTimeout(() => reject(new Error("signal timeout")), 5000)
        ch.subscribe((s) => { if (s === "SUBSCRIBED") { clearTimeout(t); resolve() } })
      }).catch(() => {})
      outChannelRef.current = ch
      outChannelTargetRef.current = toUserId
    }
    try {
      await outChannelRef.current!.send({ type: "broadcast", event: "signal", payload: msg })
    } catch {
      // silently swallow send errors — call will self-cleanup via state
    }
  }

  async function unlockRemoteAudio() {
    if (!remoteAudioRef.current) return
    try {
      remoteAudioRef.current.muted = true
      await remoteAudioRef.current.play()
      remoteAudioRef.current.pause()
      remoteAudioRef.current.muted = false
      remoteAudioRef.current.currentTime = 0
    } catch { /* silently ignore — already unlocked or not needed */ }
  }

  function fmtDuration(s: number) {
    return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`
  }

  function insertCallLog(toUserId: string, content: string) {
    if (!currentUserId || !toUserId) return
    void supabase.from("messages")
      .insert({ sender_id: currentUserId, recipient_id: toUserId, content })
  }

  function cleanup() {
    if (timerRef.current)           { clearInterval(timerRef.current);  timerRef.current   = null }
    if (timeoutRef.current)         { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    if (disconnectTimerRef.current) { clearTimeout(disconnectTimerRef.current); disconnectTimerRef.current = null }
    if (outChannelRef.current)      { supabase.removeChannel(outChannelRef.current); outChannelRef.current = null }
    outChannelTargetRef.current  = null
    localStreamRef.current?.getTracks().forEach(t => t.stop())
    localStreamRef.current = null
    pcRef.current?.close()
    pcRef.current = null
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null
    pendingICERef.current        = []
    partnerIdRef.current         = null
    incomingOfferRef.current     = null
    incomingCallerIdRef.current  = null
    setCallState("idle")
    setIncomingCallerName(null)
    setActivePartnerName(null)
    setIsMuted(false)
    setCallDuration(0)
    setCallError(null)
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
        // cancel any pending disconnect timer
        if (disconnectTimerRef.current) { clearTimeout(disconnectTimerRef.current); disconnectTimerRef.current = null }
        if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }
        setCallState("connected")
        setCallDuration(0)
        if (!timerRef.current) {
          timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000)
        }
      } else if (pc.connectionState === "failed") {
        cleanup()
      } else if (pc.connectionState === "disconnected") {
        disconnectTimerRef.current = setTimeout(() => cleanup(), 7000)
      }
    }

    return pc
  }

  // Signal handler — re-assigned every render so it always closes over fresh refs
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
        if (callStateRef.current === "incoming") {
          if (incomingCallerIdRef.current) {
            sendSignal(incomingCallerIdRef.current, { type: "call-reject", from: currentUserId })
          }
          cleanup()
        }
      }, 30000)

    } else if (msg.type === "call-answer") {
      if (!partnerIdRef.current || msg.from !== partnerIdRef.current) return
      pcRef.current?.setRemoteDescription(msg.sdp).then(async () => {
        for (const c of pendingICERef.current) {
          await pcRef.current?.addIceCandidate(c)
        }
        pendingICERef.current = []
      })

    } else if (msg.type === "call-ice") {
      if (partnerIdRef.current && msg.from !== partnerIdRef.current) return
      if (pcRef.current?.remoteDescription) {
        pcRef.current.addIceCandidate(msg.candidate)
      } else {
        pendingICERef.current.push(msg.candidate)
      }

    } else if (msg.type === "call-reject") {
      if (partnerIdRef.current) insertCallLog(partnerIdRef.current, "📞 Call declined")
      cleanup()
    } else if (msg.type === "call-end") {
      cleanup()
    }
  }

  // Subscribe to own inbox channel once
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

    // Show calling UI immediately — instant feedback before mic permission dialog
    partnerIdRef.current = toPartnerId
    setActivePartnerName(toPartnerName)
    setCallState("calling")
    void unlockRemoteAudio()  // pre-warm audio during user gesture, non-blocking

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch {
      setCallError("Microphone access was denied. Allow it in your browser settings.")
      cleanup()
      return
    }
    localStreamRef.current = stream

    const pc = createPC(toPartnerId)
    pcRef.current = pc
    stream.getTracks().forEach(t => pc.addTrack(t, stream))

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    await sendSignal(toPartnerId, {
      type: "call-offer", from: currentUserId, fromName: myName || "Someone", sdp: offer,
    })
    timeoutRef.current = setTimeout(() => {
      if (partnerIdRef.current) insertCallLog(partnerIdRef.current, "📞 Missed call")
      cleanup()
    }, 30000)
  }, [currentUserId, myName]) // eslint-disable-line react-hooks/exhaustive-deps

  const acceptCall = useCallback(async () => {
    if (callStateRef.current !== "incoming" || !incomingCallerIdRef.current || !incomingOfferRef.current) return
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }

    // Synchronously lock state so a second Accept tap is rejected before any await
    callStateRef.current = "connected"
    setCallState("connected")

    await unlockRemoteAudio()
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch {
      setCallError("Microphone access was denied. Allow it in your browser settings.")
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
      if (callStateRef.current === "connected") {
        insertCallLog(partnerIdRef.current, `📞 Call ended · ${fmtDuration(callDurationRef.current)}`)
      }
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
      isMuted, callDuration, callError,
      startCall, acceptCall, rejectCall, endCall, toggleMute,
      clearCallError: () => setCallError(null),
    }}>
      {children}
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />
    </CallContext.Provider>
  )
}
