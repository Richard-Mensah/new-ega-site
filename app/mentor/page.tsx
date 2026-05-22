import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import { Users, Calendar, Award, BarChart2, MapPin, ChevronRight, Clock } from "lucide-react"
import Link from "next/link"
import type { Tables } from "@/types/database"

export default async function MentorOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const profile = profileRaw as Tables<"profiles"> | null
  if (profile?.role !== "mentor") redirect("/dashboard")

  const [
    { data: pairsRaw },
    { data: sessionsRaw },
    { count: awardsCount },
  ] = await Promise.all([
    supabase
      .from("mentorship_pairs")
      .select("participant_id, profiles!participant_id(full_name, country, avatar_url, organization)")
      .eq("mentor_id", user.id)
      .eq("status", "active"),
    supabase
      .from("sessions")
      .select("*, profiles!participant_id(full_name)")
      .eq("mentor_id", user.id)
      .order("scheduled_at", { ascending: false })
      .limit(5),
    supabase
      .from("mentor_awards")
      .select("*", { count: "exact", head: true })
      .eq("mentor_id", user.id),
  ])

  type MenteeProfile = { full_name: string; country: string | null; avatar_url: string | null; organization: string | null }
  type MenteePair = { participant_id: string; profiles: MenteeProfile | null }
  const pairs = pairsRaw as MenteePair[] | null

  type SessionWithProfile = Tables<"sessions"> & { profiles: { full_name: string } | null }
  const sessions = sessionsRaw as SessionWithProfile[] | null

  const totalMentees = pairs?.length ?? 0
  const completedSessions = sessions?.filter((s) => s.status === "completed").length ?? 0
  const upcomingSessions = sessions?.filter((s) => s.status === "scheduled") ?? []
  const recentActivity = sessions?.slice(0, 3) ?? []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="p-6 space-y-6">
      {/* Hero */}
      <div className="bg-brand-navy rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <ProfileAvatar avatarUrl={profile?.avatar_url ?? null} fullName={profile?.full_name ?? ""} size="xl" className="border-4 border-white/20" />
          <div className="flex-1">
            <p className="text-white/60 text-sm">{greeting}</p>
            <h1 className="text-2xl font-bold mt-0.5">{profile?.full_name}</h1>
            <p className="text-white/70 text-sm mt-1">Shaping the next generation of global leaders</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="text-white/80"><span className="font-bold text-white">{totalMentees}</span> mentee{totalMentees !== 1 ? "s" : ""}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80"><span className="font-bold text-white">{completedSessions}</span> sessions held</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80"><span className="font-bold text-white">{awardsCount ?? 0}</span> awards issued</span>
            </div>
          </div>
          <Link href="/mentor/analytics" className="hidden sm:flex items-center gap-2 bg-brand-gold text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors shrink-0">
            <BarChart2 size={16} />
            Analytics
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card accent="gold">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Active Mentees</span>
            <Users size={16} className="text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-navy">{totalMentees}</div>
          <div className="text-xs text-gray-400 mt-1">In your cohort</div>
        </Card>
        <Card accent="green">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Sessions Held</span>
            <Calendar size={16} className="text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-navy">{completedSessions}</div>
          <div className="text-xs text-gray-400 mt-1">Completed sessions</div>
        </Card>
        <Card accent="blue">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Awards Issued</span>
            <Award size={16} className="text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-navy">{awardsCount ?? 0}</div>
          <div className="text-xs text-gray-400 mt-1">EGA credentials given</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mentee cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-navy">My Mentees</h2>
            <Link href="/mentor/mentees" className="text-sm text-brand-gold font-semibold hover:underline flex items-center gap-1">
              Manage all <ChevronRight size={14} />
            </Link>
          </div>
          {!pairs || pairs.length === 0 ? (
            <Card>
              <div className="text-center py-10 text-gray-400">
                <Users size={32} className="mx-auto mb-2" />
                <p className="text-sm">No mentees assigned yet</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {pairs.map((pair) => {
                const p = pair.profiles
                return (
                  <div key={pair.participant_id} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 hover:border-brand-gold/40 transition-colors">
                    <ProfileAvatar avatarUrl={p?.avatar_url ?? null} fullName={p?.full_name ?? "?"} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-navy text-sm truncate">{p?.full_name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {p?.country && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={10} />{p.country}
                          </span>
                        )}
                        {p?.organization && (
                          <span className="text-xs text-gray-400 truncate">{p.organization}</span>
                        )}
                      </div>
                    </div>
                    <Badge label="Active" color="green" />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-navy">Recent Sessions</h2>
            <Link href="/mentor/sessions" className="text-sm text-brand-gold font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {upcomingSessions.length > 0 && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <Clock size={16} className="text-amber-600 shrink-0" />
              <p className="text-sm text-amber-700 font-medium">
                {upcomingSessions.length} upcoming session{upcomingSessions.length !== 1 ? "s" : ""} scheduled
              </p>
              <Link href="/mentor/sessions" className="ml-auto text-xs font-semibold text-amber-600 hover:underline">View</Link>
            </div>
          )}
          {recentActivity.length === 0 ? (
            <Card>
              <div className="text-center py-10 text-gray-400">
                <Calendar size={32} className="mx-auto mb-2" />
                <p className="text-sm">No sessions recorded yet</p>
                <Link href="/mentor/sessions" className="text-xs text-brand-gold font-semibold hover:underline mt-1 inline-block">Schedule one →</Link>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((s) => (
                <div key={s.id} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                  <div className="p-2 bg-brand-navy/5 rounded-xl shrink-0">
                    <Calendar size={14} className="text-brand-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-navy text-sm truncate">{s.profiles?.full_name ?? "Unknown"}</p>
                    <p className="text-xs text-gray-400">
                      {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Date TBD"}
                    </p>
                  </div>
                  <Badge label={s.status} color={s.status === "completed" ? "green" : s.status === "cancelled" ? "red" : "blue"} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
