"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"

const CATEGORIES = [
  { key: "leadership", label: "Leadership", color: "bg-amber-500" },
  { key: "sdg_engagement", label: "SDG Engagement", color: "bg-green-500" },
  { key: "communication", label: "Communication", color: "bg-blue-500" },
  { key: "projects", label: "Projects", color: "bg-purple-500" },
  { key: "overall", label: "Overall Growth", color: "bg-brand-navy" },
] as const

type Props = {
  participantId: string
  scores: Record<string, number>
}

export default function MilestoneEditor({ participantId, scores: initialScores }: Props) {
  const [scores, setScores] = useState<Record<string, number>>(initialScores)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSave(type: string) {
    const score = scores[type] ?? 0
    if (score < 0 || score > 100) {
      setErrors((e) => ({ ...e, [type]: "Must be 0–100" }))
      return
    }
    setSaving(type)
    setErrors((e) => ({ ...e, [type]: "" }))
    try {
      const res = await fetch("/api/mentor/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId, type, score }),
      })
      if (!res.ok) {
        const json = await res.json()
        setErrors((e) => ({ ...e, [type]: json.error || "Failed" }))
      } else {
        setSaved(type)
        setTimeout(() => setSaved(null), 2000)
      }
    } catch {
      setErrors((e) => ({ ...e, [type]: "Network error" }))
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Growth Scores</p>
      {CATEGORIES.map((cat) => {
        const val = scores[cat.key] ?? 0
        return (
          <div key={cat.key}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-600 w-32 shrink-0">{cat.label}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color} rounded-full transition-all`} style={{ width: `${val}%` }} />
              </div>
              <input
                type="number"
                min={0}
                max={100}
                value={val}
                onChange={(e) => setScores((s) => ({ ...s, [cat.key]: Number(e.target.value) }))}
                className="w-14 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
              <button
                type="button"
                onClick={() => handleSave(cat.key)}
                disabled={saving === cat.key}
                className="text-xs px-2 py-1 rounded-lg bg-brand-navy text-white hover:bg-brand-navy/80 transition-colors disabled:opacity-50 shrink-0"
              >
                {saving === cat.key ? "…" : saved === cat.key ? <CheckCircle size={12} className="text-green-400" /> : "Save"}
              </button>
            </div>
            {errors[cat.key] && <p className="text-xs text-red-500 ml-32">{errors[cat.key]}</p>}
          </div>
        )
      })}
    </div>
  )
}
