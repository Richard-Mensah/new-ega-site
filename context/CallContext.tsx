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

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
}

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

  // Keep callStateRef in sync with callState
  useEffect(() => { callStateRef.current = callState }, [callState])

  // Fetch caller's own display name once
  useEffect(() => {
    if (!currentUserId) return
    supabase.from("profiles").select("full_name").eq("id", currentUserId).single()
      .then(({ data }) => { if (data) setMyName(data.full_name) })
  }, [currentUserId, supabase])

  // ─── Helpers ──────────────────────────────────────────────────────────────

  async function sendSignal(toUserId: string, msg: SignalMessage) {
    const ch = supabase.channel(`call-signal:${toUserId}`)
    const subscribed = new Promise<void>((resolve) => {
      ch.subscribe((status) => { if (status === "SUBSCRIBED") resolve() })
    })
    let timeoutHandle: ReturnType<typeof setTimeout>
    const timeout = new Promise<void>((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error("signal timeout")), 5000)
    })
    try {
      await Promise.race([subscribed, timeout])
      clearTimeout(timeoutHandle!)
      await ch.send({ type: "broadcast", event: "signal", payload: msg })
    } catch {
      // silently swallow timeout/send errors — call will self-cleanup via state
    } finally {
      supabase.removeChannel(ch)
    }
  }

  function cleanup() {
    if (timerRef.current)           { clearInterval(timerRef.current);  timerRef.current   = null }
    if (timeoutRef.current)         { clearTimeout(timeoutRef.current); timeoutRef.current = null }
    if (disconnectTimerRef.current) { clearTimeout(disconnectTimerRef.current); disconnectTimerRef.current = null }
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
      if (!partnerIdRef.current || msg.from !== partnerIdRef.current) return
      if (pcRef.current?.remoteDescription) {
        pcRef.current.addIceCandidate(msg.candidate)
      } else {
        pendingICERef.current.push(msg.candidate)
      }

    } else if (msg.type === "call-reject" || msg.type === "call-end") {
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
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch {
      setCallError("Microphone access was denied. Allow it in your browser settings.")
      return
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
      type: "call-offer", from: currentUserId, fromName: myName || "Someone", sdp: offer,
    })
    timeoutRef.current = setTimeout(() => cleanup(), 30000)
  }, [currentUserId, myName]) // eslint-disable-line react-hooks/exhaustive-deps

  const acceptCall = useCallback(async () => {
    if (callStateRef.current !== "incoming" || !incomingCallerIdRef.current || !incomingOfferRef.current) return
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null }

    // Synchronously lock state so a second Accept tap is rejected before any await
    callStateRef.current = "connected"
    setCallState("connected")

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
