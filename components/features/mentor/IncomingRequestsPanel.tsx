"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import { MapPin, Building2, CheckCircle, XCircle, Clock } from "lucide-react"

export type IncomingRequest = {
  id: string
  participant_id: string
  message: string
  focus_areas: string[]
  created_at: string
  participant: {
    full_name: string
    avatar_url: string | null
    organization: string | null
    country: string | null
  } | null
}

type Props = {
  requests: IncomingRequest[]
}

export default function IncomingRequestsPanel({ requests }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (requests.length === 0) return null

  async function handleApprove(id: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/mentor/request/${id}/approve`, { method: "POST" })
      if (res.ok) router.refresh()
    } finally {
      setLoading(null)
    }
  }

  async function handleDecline(id: string) {
    setLoading(id)
    try {
      const res = await fetch(`/api/mentor/request/${id}/decline`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "Thank you for your interest. Please reach out again in the future." }),
      })
      if (res.ok) router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 bg-amber-50 border-b border-amber-200">
        <Clock size={18} className="text-amber-600 shrink-0" />
        <div>
          <h2 className="font-bold text-amber-800">Mentorship Requests</h2>
          <p className="text-xs text-amber-600 mt-0.5">
            {requests.length} participant{requests.length !== 1 ? "s" : ""} {requests.length === 1 ? "has" : "have"} specifically requested you as their mentor
          </p>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {requests.map((req) => {
          const p = req.participant
          const isExpanded = expanded === req.id
          const isLoading = loading === req.id

          return (
            <div key={req.id} className="p-5">
              <div className="flex items-start gap-4">
                <ProfileAvatar avatarUrl={p?.avatar_url ?? null} fullName={p?.full_name ?? "?"} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-navy">{p?.full_name ?? "Unknown"}</p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {p?.organization && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Building2 size={11} />{p.organization}
                      </span>
                    )}
                    {p?.country && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={11} />{p.country}
                      </span>
                    )}
                  </div>

                  {req.focus_areas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {req.focus_areas.map((fa) => (
                        <span key={fa} className="text-xs bg-brand-navy/5 text-brand-navy px-2 py-0.5 rounded-full">
                          {fa}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : req.id)}
                    className="mt-2 text-xs text-brand-gold font-medium hover:underline"
                  >
                    {isExpanded ? "Hide message" : "Read their message"}
                  </button>

                  {isExpanded && (
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                      {req.message}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Requested {new Date(req.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleApprove(req.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={15} />Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecline(req.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={15} />Decline
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
