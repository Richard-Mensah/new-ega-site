"use client"

import { useState } from "react"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import Badge from "@/components/ui/Badge"
import MilestoneEditor from "@/components/features/mentor/MilestoneEditor"
import IssueAwardModal, { type Award } from "@/components/features/mentor/IssueAwardModal"
import Link from "next/link"
import { MapPin, Building2, ExternalLink, ChevronDown, ChevronUp, Award as AwardIcon, Globe, Folder, Calendar, X, MessageCircle } from "lucide-react"
import Card from "@/components/ui/Card"

const CATEGORY_META: Record<string, { label: string; color: string; textColor: string }> = {
  leadership: { label: "Leadership Excellence", color: "bg-amber-100 border-amber-300", textColor: "text-amber-700" },
  sdg_engagement: { label: "SDG Champion", color: "bg-green-100 border-green-300", textColor: "text-green-700" },
  communication: { label: "Communication & Impact", color: "bg-blue-100 border-blue-300", textColor: "text-blue-700" },
  projects: { label: "Project Innovation", color: "bg-purple-100 border-purple-300", textColor: "text-purple-700" },
  overall: { label: "Overall Growth", color: "bg-slate-100 border-slate-300", textColor: "text-slate-700" },
}

type Mentee = {
  id: string
  matched_at: string
  full_name: string
  country: string | null
  avatar_url: string | null
  bio: string | null
  organization: string | null
  linkedin_url: string | null
  sdg_count: number
  projects_count: number
  sessions_count: number
  days_in_program: number
  scores: Record<string, number>
  awards: Award[]
}

type Props = { mentees: Mentee[] }

export default function MenteeControlPanel({ mentees: initial }: Props) {
  const [mentees, setMentees] = useState<Mentee[]>(initial)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [awardModal, setAwardModal] = useState<string | null>(null)
  const [revoking, setRevoking] = useState<string | null>(null)

  if (mentees.length === 0) {
    return (
      <Card>
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">No mentees assigned yet</p>
        </div>
      </Card>
    )
  }

  function handleAwarded(menteeId: string, award: Award) {
    setMentees((prev) => prev.map((m) => m.id === menteeId ? { ...m, awards: [...m.awards, award] } : m))
  }

  async function handleRevoke(menteeId: string, awardId: string) {
    setRevoking(awardId)
    try {
      const res = await fetch("/api/mentor/awards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ awardId }),
      })
      if (res.ok) {
        setMentees((prev) => prev.map((m) =>
          m.id === menteeId ? { ...m, awards: m.awards.filter((a) => a.id !== awardId) } : m
        ))
      }
    } finally {
      setRevoking(null)
    }
  }

  const activeMentee = awardModal ? mentees.find((m) => m.id === awardModal) : null

  return (
    <>
      <div className="space-y-4">
        {mentees.map((mentee) => {
          const isOpen = expanded === mentee.id
          return (
            <div key={mentee.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header row */}
              <div className="flex items-center gap-4 p-5">
                <ProfileAvatar avatarUrl={mentee.avatar_url} fullName={mentee.full_name} size="lg" className="border-2 border-brand-gold/30" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-brand-navy">{mentee.full_name}</h3>
                    <Badge label="Active" color="green" />
                    {mentee.awards.length > 0 && (
                      <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        <AwardIcon size={10} />
                        {mentee.awards.length} award{mentee.awards.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {mentee.country && (
                      <span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={10} />{mentee.country}</span>
                    )}
                    {mentee.organization && (
                      <span className="flex items-center gap-1 text-xs text-gray-500"><Building2 size={10} />{mentee.organization}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/chat/${mentee.id}`}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-navy text-white text-xs font-semibold hover:bg-brand-navy/90 transition-colors"
                  >
                    <MessageCircle size={13} />
                    Message
                  </Link>
                  <Link
                    href={`/dashboard/community/${mentee.id}`}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-brand-navy text-xs font-semibold hover:bg-gray-200 transition-colors"
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => setAwardModal(mentee.id)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-gold text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
                  >
                    <AwardIcon size={13} />
                    Issue Award
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : mentee.id)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                  >
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div className="border-t border-gray-100 p-5 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: profile details */}
                    <div className="space-y-4">
                      {mentee.bio && <p className="text-sm text-gray-600 leading-relaxed">{mentee.bio}</p>}
                      {mentee.linkedin_url && (
                        <a href={mentee.linkedin_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[#0A66C2] font-medium hover:underline">
                          <ExternalLink size={14} />LinkedIn Profile
                        </a>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1"><Globe size={13} /></div>
                          <p className="text-xl font-bold text-brand-navy">{mentee.sdg_count}</p>
                          <p className="text-xs text-gray-500">SDGs engaged</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1"><Folder size={13} /></div>
                          <p className="text-xl font-bold text-brand-navy">{mentee.projects_count}</p>
                          <p className="text-xs text-gray-500">Active projects</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400 mb-1"><Calendar size={13} /></div>
                          <p className="text-xl font-bold text-brand-navy">{mentee.sessions_count}</p>
                          <p className="text-xs text-gray-500">Sessions done</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-brand-navy">{mentee.days_in_program}</p>
                          <p className="text-xs text-gray-500">Days in program</p>
                        </div>
                      </div>
                    </div>

                    {/* Right: milestone editor */}
                    <div>
                      <MilestoneEditor participantId={mentee.id} scores={mentee.scores} />
                    </div>
                  </div>

                  {/* Awards section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">EGA Awards Issued</p>
                      <button
                        type="button"
                        onClick={() => setAwardModal(mentee.id)}
                        className="flex items-center gap-1 text-xs text-brand-gold font-semibold hover:underline"
                      >
                        <AwardIcon size={11} />
                        Issue Award
                      </button>
                    </div>
                    {mentee.awards.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No awards issued yet</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {mentee.awards.map((award) => {
                          const meta = CATEGORY_META[award.category]
                          return (
                            <div key={award.id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium ${meta?.color} ${meta?.textColor}`}>
                              <AwardIcon size={11} />
                              <span>{award.title}</span>
                              <button
                                type="button"
                                onClick={() => handleRevoke(mentee.id, award.id)}
                                disabled={revoking === award.id}
                                aria-label="Revoke award"
                                className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
                              >
                                <X size={11} />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {activeMentee && (
        <IssueAwardModal
          participantId={activeMentee.id}
          participantName={activeMentee.full_name}
          onClose={() => setAwardModal(null)}
          onAwarded={(award) => { handleAwarded(activeMentee.id, award); setAwardModal(null) }}
        />
      )}
    </>
  )
}
