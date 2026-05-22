"use client"

import { useState, useMemo } from "react"
import { Search, Trash2, Loader2, GitBranch, Plus } from "lucide-react"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import AssignMentorModal, { type MentorOption } from "./AssignMentorModal"

export type PairRow = {
  id: string
  mentor_id: string
  mentor_name: string
  mentor_avatar: string | null
  participant_id: string
  participant_name: string
  participant_avatar: string | null
  participant_email: string
  matched_at: string
  status: string
  notes: string | null
  sessionCount: number
}

type MentorRequestRow = {
  id: string
  participant_id: string
  participant_name: string
  participant_avatar: string | null
  participant_organization: string | null
  participant_country: string | null
  message: string
  focus_areas: string[]
  created_at: string
  target_mentor_name: string | null
}

type Props = {
  pairs: PairRow[]
  mentors: MentorOption[]
  allParticipants: Array<{ id: string; full_name: string; avatar_url: string | null; organization: string | null; country: string | null }>
  pendingRequests?: MentorRequestRow[]
}

const STATUS_OPTIONS = ["active", "paused", "completed"] as const

function statusBadge(status: string) {
  if (status === "active") return "bg-green-50 text-green-700 border-green-200"
  if (status === "paused") return "bg-yellow-50 text-yellow-700 border-yellow-200"
  return "bg-gray-100 text-gray-500 border-gray-200"
}

export default function PairingTable({ pairs: initial, mentors, allParticipants, pendingRequests = [] }: Props) {
  const [list, setList] = useState(initial)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [updating, setUpdating] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<PairRow | null>(null)
  const [showAddPairing, setShowAddPairing] = useState(false)
  const [addParticipantId, setAddParticipantId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return list.filter((p) => {
      const matchSearch =
        p.mentor_name.toLowerCase().includes(q) ||
        p.participant_name.toLowerCase().includes(q) ||
        p.participant_email.toLowerCase().includes(q)
      const matchStatus = statusFilter === "all" || p.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [list, search, statusFilter])

  async function handleStatusChange(pairId: string, newStatus: string) {
    setUpdating(pairId)
    try {
      const res = await fetch("/api/admin/pairs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pairId, status: newStatus }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Update failed")
      setList((prev) => prev.map((p) => (p.id === pairId ? { ...p, status: newStatus } : p)))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed")
    } finally {
      setUpdating(null)
    }
  }

  async function handleRemove(pair: PairRow) {
    setRemoving(pair.id)
    setConfirmRemove(null)
    try {
      const res = await fetch("/api/admin/pairs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pairId: pair.id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Remove failed")
      setList((prev) => prev.filter((p) => p.id !== pair.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Remove failed")
    } finally {
      setRemoving(null)
    }
  }

  // When a new pairing is created via the modal, add it optimistically
  function handleNewPairing(mentorId: string, mentorName: string) {
    if (!addParticipantId) return
    const participant = allParticipants.find((p) => p.id === addParticipantId)
    if (!participant) return
    const mentor = mentors.find((m) => m.id === mentorId)
    setList((prev) => [
      {
        id: `tmp-${Date.now()}`,
        mentor_id: mentorId,
        mentor_name: mentorName,
        mentor_avatar: mentor?.avatar_url ?? null,
        participant_id: addParticipantId,
        participant_name: participant.full_name,
        participant_avatar: participant.avatar_url,
        participant_email: "",
        matched_at: new Date().toISOString(),
        status: "active",
        notes: null,
        sessionCount: 0,
      },
      ...prev,
    ])
    setAddParticipantId(null)
    setShowAddPairing(false)
  }

  return (
    <>
      {pendingRequests.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-amber-800">Mentor Requests</h3>
            <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          </div>
          <div className="space-y-2">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-amber-100 p-3 flex items-start gap-3"
              >
                <ProfileAvatar
                  avatarUrl={req.participant_avatar}
                  fullName={req.participant_name}
                  size="sm"
                  className="shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{req.participant_name}</p>
                  {(req.participant_organization || req.participant_country) && (
                    <p className="text-xs text-gray-400 truncate">
                      {[req.participant_organization, req.participant_country].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {req.focus_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {req.focus_areas.map((fa) => (
                        <span
                          key={fa}
                          className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full"
                        >
                          {fa}
                        </span>
                      ))}
                    </div>
                  )}
                  {req.target_mentor_name && (
                    <p className="text-xs font-medium text-brand-navy mt-1">
                      Requested: {req.target_mentor_name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{req.message}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Submitted {new Date(req.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAddParticipantId(req.participant_id)}
                  className="shrink-0 px-3 py-1.5 text-xs font-semibold text-white bg-brand-navy rounded-lg hover:bg-brand-navy/90 transition-colors"
                >
                  Pair Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 relative min-w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentor or participant…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAddPairing(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-navy rounded-lg hover:bg-brand-navy/90 transition-colors"
          >
            <Plus size={15} />
            New Pairing
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Mentor</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">
                    <GitBranch size={13} className="inline mr-1" />
                    Participant
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Sessions</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Matched</th>
                  <th className="px-4 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      {search || statusFilter !== "all" ? "No pairings match your filters" : "No pairings yet"}
                    </td>
                  </tr>
                )}
                {filtered.map((pair) => (
                  <tr key={pair.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProfileAvatar avatarUrl={pair.mentor_avatar} fullName={pair.mentor_name} size="xs" />
                        <span className="font-medium text-gray-900 text-sm">{pair.mentor_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ProfileAvatar avatarUrl={pair.participant_avatar} fullName={pair.participant_name} size="xs" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{pair.participant_name}</p>
                          {pair.participant_email && (
                            <p className="text-xs text-gray-400 truncate max-w-36">{pair.participant_email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        {updating === pair.id ? (
                          <Loader2 size={14} className="animate-spin text-gray-400" />
                        ) : (
                          <select
                            value={pair.status}
                            onChange={(e) => handleStatusChange(pair.id, e.target.value)}
                            className={`text-xs font-semibold border rounded-full px-2.5 py-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-brand-gold cursor-pointer ${statusBadge(pair.status)}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {pair.sessionCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(pair.matched_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setConfirmRemove(pair)}
                        disabled={removing === pair.id}
                        title="Remove pairing"
                        className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {removing === pair.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
            {filtered.length} of {list.length} pairings
          </div>
        </div>
      </div>

      {/* Add new pairing: pick participant first */}
      {showAddPairing && !addParticipantId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddPairing(false) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="font-bold text-gray-900 mb-1">New Pairing</h2>
            <p className="text-sm text-gray-500 mb-4">Select the participant to pair:</p>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {allParticipants.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAddParticipantId(p.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 transition-colors"
                >
                  <ProfileAvatar avatarUrl={p.avatar_url} fullName={p.full_name} size="sm" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{p.full_name}</p>
                    {p.organization && <p className="text-xs text-gray-400">{p.organization}</p>}
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAddPairing(false)}
              className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Assign mentor for selected participant */}
      {addParticipantId && (
        <AssignMentorModal
          participantName={allParticipants.find((p) => p.id === addParticipantId)?.full_name ?? ""}
          participantId={addParticipantId}
          mentors={mentors}
          onClose={() => { setAddParticipantId(null); setShowAddPairing(false) }}
          onAssigned={handleNewPairing}
        />
      )}

      {/* Confirm remove modal */}
      {confirmRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmRemove(null) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <GitBranch size={20} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Remove pairing?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will remove the mentorship link between{" "}
              <span className="font-semibold text-gray-800">{confirmRemove.mentor_name}</span> and{" "}
              <span className="font-semibold text-gray-800">{confirmRemove.participant_name}</span>.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmRemove(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRemove(confirmRemove)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
