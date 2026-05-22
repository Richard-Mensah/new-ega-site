import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import { MapPin, Calendar, MessageCircle, ExternalLink, Building2, Award, Star, Globe, MessageSquare, Folder, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { Tables } from "@/types/database"
import MentorRequestSection from "@/components/features/mentor/MentorRequestSection"

const AWARD_META: Record<string, { label: string; Icon: React.ElementType; bg: string; border: string; text: string }> = {
  leadership: { label: "Leadership Excellence", Icon: Star, bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700" },
  sdg_engagement: { label: "SDG Champion", Icon: Globe, bg: "bg-green-50", border: "border-green-300", text: "text-green-700" },
  communication: { label: "Communication & Impact", Icon: MessageSquare, bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" },
  projects: { label: "Project Innovation", Icon: Folder, bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" },
  overall: { label: "Overall Growth", Icon: TrendingUp, bg: "bg-slate-50", border: "border-slate-300", text: "text-slate-700" },
}

export default async function MentorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: pairRaw }, { data: sessionsRaw }, { data: awardsRaw }, { data: requestRaw }, { data: mentorsRaw }] = await Promise.all([
    supabase
      .from("mentorship_pairs")
      .select("mentor_id, profiles!mentor_id(full_name, country, bio, avatar_url, organization, linkedin_url)")
      .eq("participant_id", user.id)
      .eq("status", "active")
      .single(),
    supabase
      .from("sessions")
      .select("*")
      .eq("participant_id", user.id)
      .order("scheduled_at", { ascending: false })
      .limit(20),
    supabase
      .from("mentor_awards")
      .select("*, mentor:profiles!mentor_id(full_name)")
      .eq("participant_id", user.id)
      .order("awarded_at", { ascending: false }),
    supabase
      .from("mentor_requests")
      .select("id, status, admin_note, created_at, focus_areas")
      .eq("participant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url, organization, country")
      .eq("role", "mentor"),
  ])

  type MentorProfile = { full_name: string; country: string | null; bio: string | null; avatar_url: string | null; organization: string | null; linkedin_url: string | null }
  const pair = pairRaw as { mentor_id: string; profiles: MentorProfile | null } | null
  const sessions = sessionsRaw as Tables<"sessions">[] | null
  type AwardWithMentor = { id: string; category: string; title: string; notes: string | null; awarded_at: string; mentor: { full_name: string } | null }
  const awards = (awardsRaw ?? []) as AwardWithMentor[]
  type MentorRequest = { id: string; status: string; admin_note: string | null; created_at: string; focus_areas: string[] | null }
  const latestRequest = requestRaw as MentorRequest | null
  type PickableMentor = { id: string; full_name: string; avatar_url: string | null; organization: string | null; country: string | null }
  const availableMentors = (mentorsRaw ?? []) as PickableMentor[]

  const mentor = pair?.profiles ?? null

  const requestStatus: "none" | "pending" | "declined" =
    latestRequest?.status === "pending" ? "pending"
    : latestRequest?.status === "declined" ? "declined"
    : "none"

  const now = new Date()
  const upcoming = (sessions ?? []).filter(
    (s) => s.status === "scheduled" && s.scheduled_at && new Date(s.scheduled_at) > now
  ).sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())

  const pastSessions = (sessions ?? []).filter(
    (s) => s.status !== "scheduled" || !s.scheduled_at || new Date(s.scheduled_at) <= now
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">My Mentor</h1>
        <p className="text-gray-500 text-sm mt-1">Your personal guide on the EGA journey</p>
      </div>

      {!mentor ? (
        <MentorRequestSection
          status={requestStatus}
          adminNote={latestRequest?.admin_note}
          submittedAt={latestRequest?.created_at}
          focusAreas={latestRequest?.focus_areas}
          mentors={availableMentors}
        />
      ) : (
        <Card accent="gold">
          <div className="flex items-start gap-6">
            <div className="border-4 border-brand-gold rounded-full shrink-0">
              <ProfileAvatar avatarUrl={mentor.avatar_url} fullName={mentor.full_name} size="xl" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-bold text-brand-navy">{mentor.full_name}</h2>
                <Badge label="Active Mentor" color="green" size="md" />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {mentor.country && (
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <MapPin size={13} /><span>{mentor.country}</span>
                  </div>
                )}
                {mentor.organization && (
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Building2 size={13} /><span>{mentor.organization}</span>
                  </div>
                )}
              </div>
              {mentor.bio && <p className="text-gray-600 text-sm leading-relaxed mt-3">{mentor.bio}</p>}
              {mentor.linkedin_url && (
                <a href={mentor.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-[#0A66C2] hover:underline">
                  <ExternalLink size={15} />View LinkedIn Profile
                </a>
              )}
              <Link
                href={`/dashboard/chat/${pair!.mentor_id}`}
                className="inline-flex items-center gap-1.5 mt-3 ml-4 px-4 py-2 bg-brand-navy text-white rounded-lg text-sm font-semibold hover:bg-brand-navy/90 transition-colors"
              >
                <MessageCircle size={15} />Message Mentor
              </Link>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
          <Award size={18} className="text-brand-gold" />
          My EGA Awards
        </h2>
        {awards.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-400">
              <Award size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Your mentor will recognise your achievements here</p>
              <p className="text-xs mt-1">Awards appear when your mentor issues them</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {awards.map((award) => {
              const meta = AWARD_META[award.category]
              const Icon = meta?.Icon ?? Award
              return (
                <div key={award.id} className={`rounded-2xl border-2 p-4 ${meta?.bg} ${meta?.border}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white border ${meta?.border}`}>
                      <Icon size={16} className={meta?.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm ${meta?.text}`}>{award.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{meta?.label}</p>
                      {award.notes && <p className="text-xs text-gray-600 mt-1 italic">{award.notes}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        Issued by {award.mentor?.full_name ?? "your mentor"} · {new Date(award.awarded_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-green-600" />
            Next Session
          </h2>
          <div className="space-y-3">
            {upcoming.map((s) => (
              <div key={s.id} className="flex items-center gap-4 bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="p-2 bg-green-100 rounded-lg shrink-0">
                  <Calendar size={16} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-800 text-sm">
                    {new Date(s.scheduled_at!).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  {s.notes && <p className="text-xs text-green-700 mt-0.5">{s.notes}</p>}
                </div>
                <Badge label="Upcoming" color="green" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Session History</h2>
        {pastSessions.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-400">
              <Calendar size={32} className="mx-auto mb-2" />
              <p className="text-sm">No sessions recorded yet</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {pastSessions.map((s) => (
              <div key={s.id} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
                <div className="p-2 bg-brand-navy/5 rounded-lg">
                  <Calendar size={16} className="text-brand-navy" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brand-navy text-sm">
                    {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Session"}
                  </p>
                  {s.notes && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.notes}</p>}
                </div>
                <Badge label={s.status} color={s.status === "completed" ? "green" : s.status === "cancelled" ? "red" : "blue"} />
              </div>
            ))}
          </div>
        )}
      </div>

      {mentor && (
        <div>
          <h2 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
            <MessageCircle size={18} className="text-brand-gold" />
            Feedback Log
          </h2>
          {(() => {
            const notedSessions = (sessions ?? [])
              .filter((s) => s.notes && s.notes.trim().length > 0 && s.status === "completed")
              .slice(0, 3)
            if (notedSessions.length === 0) {
              return (
                <Card>
                  <div className="text-center py-8 text-gray-400">
                    <MessageCircle size={28} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No feedback recorded yet</p>
                    <p className="text-xs mt-1">Notes from completed sessions will appear here</p>
                  </div>
                </Card>
              )
            }
            return (
              <div className="space-y-3">
                {notedSessions.map((s) => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-400 mb-1.5">
                      {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Session"}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{s.notes}</p>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
