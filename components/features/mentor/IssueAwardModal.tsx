"use client"

import { useState, useEffect } from "react"
import { X, Award, Star, Globe, MessageSquare, Folder, TrendingUp } from "lucide-react"

export type Award = {
  id: string
  category: string
  title: string
  notes: string | null
  awarded_at: string
}

const CATEGORIES = [
  { key: "leadership", label: "Leadership Excellence", icon: Star, color: "text-amber-500", bg: "bg-amber-50 border-amber-200", activeBg: "bg-amber-500" },
  { key: "sdg_engagement", label: "SDG Champion", icon: Globe, color: "text-green-600", bg: "bg-green-50 border-green-200", activeBg: "bg-green-600" },
  { key: "communication", label: "Communication & Impact", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", activeBg: "bg-blue-600" },
  { key: "projects", label: "Project Innovation", icon: Folder, color: "text-purple-600", bg: "bg-purple-50 border-purple-200", activeBg: "bg-purple-600" },
  { key: "overall", label: "Overall Growth", icon: TrendingUp, color: "text-brand-navy", bg: "bg-slate-50 border-slate-200", activeBg: "bg-brand-navy" },
] as const

type Props = {
  participantId: string
  participantName: string
  onClose: () => void
  onAwarded: (award: Award) => void
}

export default function IssueAwardModal({ participantId, participantName, onClose, onAwarded }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const cat = CATEGORIES.find((c) => c.key === selected)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !title.trim()) return
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/mentor/awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, category: selected, title: title.trim(), notes: notes.trim() || null }),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || "Failed to issue award"); setSaving(false); return }
      onAwarded(json.award)
      onClose()
    } catch {
      setError("Network error")
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center">
              <Award size={18} className="text-brand-gold" />
            </div>
            <div>
              <h2 className="font-bold text-brand-navy">Issue EGA Award</h2>
              <p className="text-xs text-gray-500">{participantName}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category picker */}
          <div>
            <p className="text-sm font-semibold text-brand-navy mb-3">Select Category</p>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon
                const isActive = selected === c.key
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => { setSelected(c.key); setTitle(c.label) }}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${isActive ? `${c.activeBg} border-transparent text-white` : `${c.bg} border-transparent hover:border-current`}`}
                  >
                    <Icon size={18} className={isActive ? "text-white" : c.color} />
                    <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>{c.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          {selected && (
            <div>
              <label className="block text-sm font-semibold text-brand-navy mb-1">Award Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. ${cat?.label}`}
                maxLength={80}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                required
              />
            </div>
          )}

          {/* Notes */}
          {selected && (
            <div>
              <label className="block text-sm font-semibold text-brand-navy mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Why you're issuing this award..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selected || !title.trim() || saving}
              className="flex-1 py-2.5 rounded-xl bg-brand-gold text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Issuing…" : "Issue Award"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
