"use client"

import { useState } from "react"
import Modal from "@/components/ui/Modal"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import { Check, Building2, MapPin } from "lucide-react"

export type PickableMentor = {
  id: string
  full_name: string
  avatar_url: string | null
  organization: string | null
  country: string | null
}

type Props = {
  onClose: () => void
  onSuccess: () => void
  mentors?: PickableMentor[]
}

const FOCUS_OPTIONS = [
  "SDG Engagement",
  "Leadership & Influence",
  "Project Development",
  "Communication & Impact",
]

export default function RequestMentorModal({ onClose, onSuccess, mentors = [] }: Props) {
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)
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
        body: JSON.stringify({
          message: message.trim(),
          focus_areas: focusAreas,
          target_mentor_id: selectedMentorId,
        }),
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
          Tell us what you&apos;re looking for and we&apos;ll match you with the right mentor.
        </p>

        {mentors.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Choose a Mentor <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-0.5">
              <label className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors border-gray-200 hover:border-brand-navy/30">
                <input
                  type="radio"
                  name="mentor"
                  checked={selectedMentorId === null}
                  onChange={() => setSelectedMentorId(null)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedMentorId === null ? "border-brand-navy bg-brand-navy" : "border-gray-300"}`}>
                  {selectedMentorId === null && <Check size={12} className="text-white" strokeWidth={3} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Any available mentor</p>
                  <p className="text-xs text-gray-400">Let our team find the best fit</p>
                </div>
              </label>

              {mentors.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${selectedMentorId === m.id ? "border-brand-navy bg-brand-navy/5" : "border-gray-200 hover:border-brand-navy/30"}`}
                >
                  <input
                    type="radio"
                    name="mentor"
                    checked={selectedMentorId === m.id}
                    onChange={() => setSelectedMentorId(m.id)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedMentorId === m.id ? "border-brand-navy bg-brand-navy" : "border-gray-300"}`}>
                    {selectedMentorId === m.id && <Check size={12} className="text-white" strokeWidth={3} />}
                  </div>
                  <ProfileAvatar avatarUrl={m.avatar_url} fullName={m.full_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-navy truncate">{m.full_name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {m.organization && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Building2 size={10} />{m.organization}
                        </span>
                      )}
                      {m.country && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={10} />{m.country}
                        </span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

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
            Focus Areas <span className="text-gray-400 font-normal">(select all that apply)</span>
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
          type="button"
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
