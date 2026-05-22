"use client"

import { useState, useMemo } from "react"
import { Search, Pencil, ChevronDown, ChevronUp, UserCheck } from "lucide-react"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import EditProfileModal from "./EditProfileModal"

type AssignedParticipant = {
  id: string
  full_name: string
  avatar_url: string | null
  country: string | null
}

type Mentor = {
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
  activeParticipants: AssignedParticipant[]
}

type Props = { mentors: Mentor[] }

function presenceDot(lastSeen: string | null) {
  if (!lastSeen) return null
  const diff = Date.now() - new Date(lastSeen).getTime()
  if (diff < 5 * 60 * 1000) return <span title="Online now" className="w-2 h-2 rounded-full bg-green-500 inline-block" />
  if (diff < 24 * 60 * 60 * 1000) return <span title="Active today" className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
  return null
}

export default function MentorTable({ mentors: initial }: Props) {
  const [list, setList] = useState(initial)
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [editTarget, setEditTarget] = useState<Mentor | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return list.filter(
      (m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.organization ?? "").toLowerCase().includes(q) ||
        (m.country ?? "").toLowerCase().includes(q)
    )
  }, [list, search])

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSaved(updated: Partial<Mentor>) {
    setList((prev) =>
      prev.map((m) => (m.id === editTarget?.id ? { ...m, ...updated } : m))
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative min-w-60">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-600">Mentor</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Country</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Participants</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Joined</th>
                  <th className="px-4 py-3 w-20 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      {search ? `No results for "${search}"` : "No mentors found"}
                    </td>
                  </tr>
                )}
                {filtered.map((m) => {
                  const isExpanded = expanded.has(m.id)
                  return (
                    <>
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <ProfileAvatar avatarUrl={m.avatar_url} fullName={m.full_name} size="sm" />
                              {presenceDot(m.last_seen_at) && (
                                <span className="absolute -bottom-0.5 -right-0.5">
                                  {presenceDot(m.last_seen_at)}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{m.full_name}</p>
                              {m.organization && (
                                <p className="text-xs text-gray-400">{m.organization}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 truncate max-w-40">{m.email || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{m.country ?? "—"}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => m.activeParticipants.length > 0 && toggleExpand(m.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              m.activeParticipants.length > 0
                                ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 cursor-pointer"
                                : "bg-gray-100 text-gray-400 cursor-default"
                            }`}
                          >
                            <UserCheck size={11} />
                            {m.activeParticipants.length} assigned
                            {m.activeParticipants.length > 0 && (
                              isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                          {new Date(m.created_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setEditTarget(m)}
                            title="Edit mentor"
                            className="p-2 rounded-lg text-gray-400 hover:text-brand-navy hover:bg-blue-50 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                        </td>
                      </tr>

                      {/* Expanded participants list */}
                      {isExpanded && m.activeParticipants.length > 0 && (
                        <tr key={`${m.id}-expanded`} className="bg-green-50/50">
                          <td colSpan={6} className="px-4 py-3">
                            <div className="flex flex-wrap gap-2 pl-12">
                              {m.activeParticipants.map((p) => (
                                <div
                                  key={p.id}
                                  className="flex items-center gap-2 bg-white border border-green-200 rounded-full px-3 py-1.5"
                                >
                                  <ProfileAvatar avatarUrl={p.avatar_url} fullName={p.full_name} size="xs" />
                                  <span className="text-xs font-medium text-gray-700">{p.full_name}</span>
                                  {p.country && (
                                    <span className="text-xs text-gray-400">{p.country}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {list.length} mentors
          </div>
        </div>
      </div>

      {editTarget && (
        <EditProfileModal
          profile={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
