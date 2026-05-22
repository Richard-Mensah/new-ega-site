"use client"

import { useState, useEffect, useMemo } from "react"
import { X, Search, Loader2, GraduationCap, CheckCircle2 } from "lucide-react"
import ProfileAvatar from "@/components/ui/ProfileAvatar"

export type MentorOption = {
  id: string
  full_name: string
  avatar_url: string | null
  organization: string | null
  country: string | null
  activeParticipants: number
}

type Props = {
  participantName: string
  participantId: string
  currentMentorId?: string | null
  mentors: MentorOption[]
  onClose: () => void
  onAssigned: (mentorId: string, mentorName: string) => void
}

export default function AssignMentorModal({
  participantName,
  participantId,
  currentMentorId,
  mentors,
  onClose,
  onAssigned,
}: Props) {
  const [search, setSearch] = useState("")
  const [assigning, setAssigning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return mentors.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        (m.organization ?? "").toLowerCase().includes(q) ||
        (m.country ?? "").toLowerCase().includes(q)
    )
  }, [mentors, search])

  async function handleAssign(mentor: MentorOption) {
    setAssigning(mentor.id)
    setError(null)
    try {
      const res = await fetch("/api/admin/pairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId: mentor.id, participantId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Assignment failed")
      onAssigned(mentor.id, mentor.full_name)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assignment failed")
    } finally {
      setAssigning(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Assign Mentor</h2>
            <p className="text-xs text-gray-500 mt-0.5">for {participantName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
        </div>

        {/* Mentor list */}
        <div className="px-4 py-3 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">No mentors found</p>
          )}
          {filtered.map((mentor) => {
            const isCurrent = mentor.id === currentMentorId
            const isAssigning = assigning === mentor.id
            return (
              <button
                key={mentor.id}
                onClick={() => !isCurrent && handleAssign(mentor)}
                disabled={!!assigning || isCurrent}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                  isCurrent
                    ? "bg-green-50 border border-green-200 cursor-default"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <ProfileAvatar avatarUrl={mentor.avatar_url} fullName={mentor.full_name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{mentor.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {mentor.organization ?? mentor.country ?? "—"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">
                    <GraduationCap size={12} className="inline mr-0.5" />
                    {mentor.activeParticipants}
                  </span>
                  {isCurrent ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : isAssigning ? (
                    <Loader2 size={16} className="animate-spin text-brand-navy" />
                  ) : (
                    <span className="text-xs font-semibold text-brand-navy bg-brand-navy/10 px-2 py-0.5 rounded-full">
                      Assign
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {error && (
          <div className="mx-4 mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400 bg-gray-50 rounded-b-2xl">
          {filtered.length} mentor{filtered.length !== 1 ? "s" : ""} available · number shows active participants
        </div>
      </div>
    </div>
  )
}
