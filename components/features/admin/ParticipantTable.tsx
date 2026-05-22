"use client"

import { useState, useMemo } from "react"
import { Trash2, Search, AlertTriangle, Loader2, Pencil, UserPlus, UserCheck } from "lucide-react"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import EditProfileModal from "./EditProfileModal"
import AssignMentorModal, { type MentorOption } from "./AssignMentorModal"

type Participant = {
  id: string
  full_name: string
  email: string
  role: "participant" | "mentor"
  country: string | null
  organization: string | null
  bio: string | null
  linkedin_url: string | null
  created_at: string
  avatar_url: string | null
  last_seen_at: string | null
  isDuplicate: boolean
  mentorId: string | null
  mentorName: string | null
}

type Props = {
  participants: Participant[]
  mentors: MentorOption[]
}

function presenceDot(lastSeen: string | null) {
  if (!lastSeen) return null
  const diff = Date.now() - new Date(lastSeen).getTime()
  if (diff < 5 * 60 * 1000) return <span title="Online now" className="w-2 h-2 rounded-full bg-green-500 inline-block" />
  if (diff < 24 * 60 * 60 * 1000) return <span title="Active today" className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
  return null
}

function exportCSV(list: Participant[]) {
  const header = "Name,Email,Role,Country,Organisation,Mentor,Joined"
  const rows = list.map((p) =>
    [p.full_name, p.email, p.role, p.country ?? "", p.organization ?? "", p.mentorName ?? "", p.created_at]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  )
  const csv = [header, ...rows].join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const a = document.createElement("a")
  a.href = url
  a.download = `participants-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ParticipantTable({ participants: initial, mentors }: Props) {
  const [list, setList] = useState(initial)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<Participant | null>(null)
  const [assignTarget, setAssignTarget] = useState<Participant | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Participant | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return list.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.organization ?? "").toLowerCase().includes(q) ||
        (p.country ?? "").toLowerCase().includes(q)
    )
  }, [list, search])

  const duplicateCount = list.filter((p) => p.isDuplicate).length

  async function handleDelete(p: Participant) {
    setDeleting(p.id)
    setConfirmDelete(null)
    try {
      const res = await fetch("/api/admin/delete-participant", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: p.id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Delete failed")
      setList((prev) => prev.filter((x) => x.id !== p.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setDeleting(null)
    }
  }

  function handleSaved(updated: Partial<Participant>) {
    setList((prev) =>
      prev.map((p) => (p.id === editTarget?.id ? { ...p, ...updated } : p))
    )
  }

  function handleAssigned(mentorId: string, mentorName: string) {
    setList((prev) =>
      prev.map((p) =>
        p.id === assignTarget?.id ? { ...p, mentorId, mentorName } : p
      )
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 relative min-w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, email, organisation or country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          {duplicateCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm font-semibold">
              <AlertTriangle size={14} />
              {duplicateCount} duplicate{duplicateCount !== 1 ? "s" : ""} flagged
            </div>
          )}
          <button
            type="button"
            onClick={() => exportCSV(filtered)}
            className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Export CSV
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Participant</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Country</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Mentor</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Joined</th>
                  <th className="px-4 py-3 w-28 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      {search ? `No results for "${search}"` : "No participants found"}
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    className={p.isDuplicate ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-50"}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ProfileAvatar avatarUrl={p.avatar_url} fullName={p.full_name} size="sm" />
                          {presenceDot(p.last_seen_at) && (
                            <span className="absolute -bottom-0.5 -right-0.5">
                              {presenceDot(p.last_seen_at)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{p.full_name}</p>
                          {p.isDuplicate && (
                            <span className="text-xs text-amber-600 font-semibold">⚠ Duplicate name</span>
                          )}
                          {p.organization && !p.isDuplicate && (
                            <p className="text-xs text-gray-400">{p.organization}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-40">{p.email || "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{p.country ?? "—"}</td>
                    <td className="px-4 py-3">
                      {p.mentorName ? (
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full w-fit">
                          <UserCheck size={11} />
                          {p.mentorName}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditTarget(p)}
                          title="Edit profile"
                          className="p-2 rounded-lg text-gray-400 hover:text-brand-navy hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssignTarget(p)}
                          title="Assign mentor"
                          className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <UserPlus size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(p)}
                          disabled={deleting === p.id}
                          title={`Delete ${p.full_name}`}
                          className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {deleting === p.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {list.length} participants
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editTarget && (
        <EditProfileModal
          profile={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Assign mentor modal */}
      {assignTarget && (
        <AssignMentorModal
          participantName={assignTarget.full_name}
          participantId={assignTarget.id}
          currentMentorId={assignTarget.mentorId}
          mentors={mentors}
          onClose={() => setAssignTarget(null)}
          onAssigned={handleAssigned}
        />
      )}

      {/* Custom delete confirm modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmDelete(null) }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Delete participant?</h3>
            <p className="text-sm text-gray-500 mb-1">
              <span className="font-semibold text-gray-800">{confirmDelete.full_name}</span> ({confirmDelete.email})
            </p>
            <p className="text-sm text-red-600 mb-6">
              This permanently removes their account and all associated data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
