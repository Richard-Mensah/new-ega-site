"use client"

import { useState } from "react"
import Modal from "@/components/ui/Modal"

type Props = {
  onClose: () => void
  onSuccess: () => void
}

const FOCUS_OPTIONS = [
  "SDG Engagement",
  "Leadership & Influence",
  "Project Development",
  "Communication & Impact",
]

export default function RequestMentorModal({ onClose, onSuccess }: Props) {
  const [message, setMessage] = useState("")
  const [focusAreas, setFocusAreas] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleFocusArea(opt: string) {
    setFocusAreas(prev =>
      prev.includes(opt) ? prev.filter(a => a !== opt) : [...prev, opt]
    )
  }

  async function handleSubmit() {
    if (message.trim().length < 20) {
      setError("Please write at least 20 characters about your goals")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/mentor/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), focus_areas: focusAreas }),
      })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error ?? "Something went wrong")
      } else {
        onSuccess()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Request Mentor Support">
      <div className="space-y-5">
        <p className="text-sm text-gray-600">
          Tell us what you're looking for and we'll match you with the right mentor.
        </p>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-800">
            What are your main goals for this mentorship? <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="e.g. I want to deepen my SDG engagement and develop leadership skills..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            Focus Areas (select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {FOCUS_OPTIONS.map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={focusAreas.includes(opt)}
                  onChange={() => toggleFocusArea(opt)}
                  className="rounded border-gray-300 text-brand-navy focus:ring-brand-navy"
                />
                <span className="text-sm text-gray-700">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-brand-navy text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-brand-navy/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Sending…" : "Send Request"}
        </button>
      </div>
    </Modal>
  )
}
