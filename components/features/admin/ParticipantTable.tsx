"use client"

import { useState } from "react"
import { Trash2, Search, AlertTriangle, Loader2 } from "lucide-react"
import ProfileAvatar from "@/components/ui/ProfileAvatar"

type Participant = {
  id: string
  full_name: string
  email: string
  role: "participant" | "mentor"
  country: string | null
  organization: string | null
  created_at: string
  avatar_url: string | null
  isDuplicate: boolean
}

export default function ParticipantTable({ participants: initial }: { participants: Participant[] }) {
  const [list, setList] = useState(initial)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = list.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      (p.organization ?? "").toLowerCase().includes(q) ||
      (p.country ?? "").toLowerCase().includes(q)
    )
  })

  const duplicateCount = list.filter((p) => p.isDuplicate).length

  async function handleDelete(p: Participant) {
    const confirmed = window.confirm(
      `Delete "${p.full_name}" (${p.email})?\n\nThis will permanently remove their account and all data. This cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(p.id)
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
      alert(err instanceof Error ? err.message : "Delete failed. Try again.")
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-60">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email or organisation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>
        {duplicateCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm font-semibold">
            <AlertTriangle size={14} />
            {duplicateCount} duplicate name{duplicateCount !== 1 ? "s" : ""} flagged
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">Participant</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Country</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Joined</th>
                <th className="px-4 py-3 w-12" />
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
                      <ProfileAvatar avatarUrl={p.avatar_url} fullName={p.full_name} size="sm" />
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
                  <td className="px-4 py-3 text-gray-600 truncate max-w-48">{p.email || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.role === "mentor"
                          ? "bg-brand-navy/10 text-brand-navy"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.country ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(p)}
                      disabled={deleting === p.id}
                      title={`Delete ${p.full_name}`}
                      className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {deleting === p.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          Showing {filtered.length} of {list.length} registered users
        </div>
      </div>
    </div>
  )
}
