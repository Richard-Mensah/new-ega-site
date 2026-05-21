"use client"

import { useState, useRef } from "react"
import { CheckCircle2, Circle } from "lucide-react"

interface Props {
  moduleId: number
  topicId: number
  initialDone: boolean
  completedAt?: string | null
}

export default function CompletionToggle({ moduleId, topicId, initialDone, completedAt }: Props) {
  const [done, setDone] = useState(initialDone)
  const [loading, setLoading] = useState(false)
  const inFlight = useRef(false)

  async function toggle() {
    if (inFlight.current) return
    inFlight.current = true
    const next = !done
    setDone(next)
    setLoading(true)

    try {
      const res = await fetch("/api/learning/complete", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, topicId }),
      })
      if (!res.ok) setDone(!next)
    } catch {
      setDone(!next)
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 ${
        done
          ? "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100"
          : "bg-gray-50 text-gray-500 border-2 border-gray-200 hover:border-brand-gold hover:text-brand-navy"
      }`}
    >
      {done ? (
        <CheckCircle2 size={16} className="text-green-600" />
      ) : (
        <Circle size={16} />
      )}
      {done ? "Completed" : "Mark as Complete"}
    </button>
  )
}
