"use client"

import { useEffect } from "react"

export default function PresenceHeartbeat() {
  useEffect(() => {
    fetch("/api/presence", { method: "POST" })
    const id = setInterval(() => {
      fetch("/api/presence", { method: "POST" })
    }, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])
  return null
}
