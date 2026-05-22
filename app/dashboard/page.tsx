import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import WelcomeCard from "@/components/features/dashboard/WelcomeCard"
import MetricCards from "@/components/features/dashboard/MetricCards"
import SdgProgressBar from "@/components/features/dashboard/SdgProgressBar"
import ActivityFeed from "@/components/features/dashboard/ActivityFeed"
import MentorPanel from "@/components/features/dashboard/MentorPanel"
import OnlineParticipants from "@/components/features/dashboard/OnlineParticipants"
import MenteeControlPanel from "@/components/features/mentor/MenteeControlPanel"
import IncomingRequestsPanel, { type IncomingRequest } from "@/components/features/mentor/IncomingRequestsPanel"
import type { Tables } from "@/types/database"
import { Users, Calendar, Clock } from "lucide-react"

function calcProfileCompletion(profile: Tables<"profiles">): number {
  return Math.round(
    [
      !!profile.avatar_url,
      !!profile.country,
      !!profile.bio,
      (profile.sdg_focus?.length ?? 0) > 0,
      !!profile.organization,
    ].filter(Boolean).length / 5 * 100
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString()

  const [
    { data: profileRaw },
    { data: sdgRaw },
    { data: projectsRaw },
    { data: sessionsRaw },
    { data: pairRaw },
    { data: onlineRaw },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("sdg_progress").select("*").eq("participant_id", user.id),
    supabase.from("projects").select("*").eq("participant_id", user.id).eq("status", "active"),
    supabase.from("sessions").select("*").eq("participant_id", user.id).eq("status", "completed"),
    supabase
      .from("mentorship_pairs")
      .select("mentor_id, profiles!mentor_id(full_name, country, avatar_url, organization)")
      .eq("participant_id", user.id)
      .eq("status", "active")
      .single(),
    supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("role", "participant")
      .gt("last_seen_at", cutoff)
      .neq("id", user.id)
      .limit(20),
  ])

  const profile = profileRaw as Tables<"profiles"> | null

  if (profile?.role === "mentor") {
    const [{ data: pairsRaw }, { data: mentorSessionsRaw }, { data: incomingRaw }] = await Promise.all([
      supabase
        .from("mentorship_pairs")
        .select("participant_id, matched_at, profiles!participant_id(id, full_name, country, avatar_url, organization, bio, linkedin_url, created_at)")
        .eq("mentor_id", user.id)
        .eq("status", "active"),
      supabase
        .from("sessions")
        .select("id, participant_id, status, scheduled_at, notes")
        .eq("mentor_id", user.id),
      supabase
        .from("mentor_requests")
        .select("id, participant_id, message, focus_areas, created_at, profiles!participant_id(full_name, avatar_url, organization, country)")
        .eq("target_mentor_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: true }),
    ])

    type MenteeProfile = {
      id: string
      full_name: string
      country: string | null
      avatar_url: string | null
      organization: string | null
      bio: string | null
      linkedin_url: string | null
      created_at: string
    }

    type PairWithProfile = {
      participant_id: string
      matched_at: string
      profiles: MenteeProfile | null
    }

    const pairs = (pairsRaw ?? []) as PairWithProfile[]
    const menteeIds = pairs.map((p) => p.participant_id)

    const [{ data: milestonesRaw }, { data: mentorAwardsRaw }, { data: sdgProgressRaw }, { data: menteeProjectsRaw }] =
      menteeIds.length > 0
        ? await Promise.all([
            supabase.from("milestones").select("participant_id, type, score").in("participant_id", menteeIds),
            supabase.from("mentor_awards").select("id, participant_id, category, title, notes, awarded_at").eq("mentor_id", user.id).in("participant_id", menteeIds),
            supabase.from("sdg_progress").select("participant_id").in("participant_id", menteeIds),
            supabase.from("projects").select("participant_id, status").eq("status", "active").in("participant_id", menteeIds),
          ])
        : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }]

    type Award = { id: string; category: string; title: string; notes: string | null; awarded_at: string }

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

    const sdgCountMap: Record<string, number> = {}
    ;(sdgProgressRaw ?? []).forEach((s: { participant_id: string }) => {
      sdgCountMap[s.participant_id] = (sdgCountMap[s.participant_id] ?? 0) + 1
    })

    const projectCountMap: Record<string, number> = {}
    ;(menteeProjectsRaw ?? []).forEach((p: { participant_id: string; status: string }) => {
      projectCountMap[p.participant_id] = (projectCountMap[p.participant_id] ?? 0) + 1
    })

    const sessionCountMap: Record<string, number> = {}
    ;(mentorSessionsRaw ?? []).forEach((s: { participant_id: string; status: string }) => {
      if (s.status === "completed") {
        sessionCountMap[s.participant_id] = (sessionCountMap[s.participant_id] ?? 0) + 1
      }
    })

    const scoresMap: Record<string, Record<string, number>> = {}
    ;(milestonesRaw ?? []).forEach((m: { participant_id: string; type: string; score: number }) => {
      if (!scoresMap[m.participant_id]) scoresMap[m.participant_id] = {}
      scoresMap[m.participant_id][m.type] = m.score
    })

    const awardsMap: Record<string, Award[]> = {}
    ;(mentorAwardsRaw ?? []).forEach((a: Award & { participant_id: string }) => {
      if (!awardsMap[a.participant_id]) awardsMap[a.participant_id] = []
      awardsMap[a.participant_id].push({ id: a.id, category: a.category, title: a.title, notes: a.notes, awarded_at: a.awarded_at })
    })

    const mentees: Mentee[] = pairs
      .filter((p) => p.profiles !== null)
      .map((p) => {
        const mp = p.profiles!
        return {
          id: mp.id,
          matched_at: p.matched_at,
          full_name: mp.full_name,
          country: mp.country,
          avatar_url: mp.avatar_url,
          bio: mp.bio,
          organization: mp.organization,
          linkedin_url: mp.linkedin_url,
          sdg_count: sdgCountMap[mp.id] ?? 0,
          projects_count: projectCountMap[mp.id] ?? 0,
          sessions_count: sessionCountMap[mp.id] ?? 0,
          days_in_program: Math.floor((Date.now() - new Date(mp.created_at).getTime()) / (1000 * 60 * 60 * 24)),
          scores: scoresMap[mp.id] ?? {},
          awards: awardsMap[mp.id] ?? [],
        }
      })

    type RawIncoming = { id: string; participant_id: string; message: string; focus_areas: string[]; created_at: string; profiles: { full_name: string; avatar_url: string | null; organization: string | null; country: string | null } | null }
    const incomingRequests: IncomingRequest[] = ((incomingRaw ?? []) as RawIncoming[]).map((r) => ({
      id: r.id,
      participant_id: r.participant_id,
      message: r.message,
      focus_areas: r.focus_areas ?? [],
      created_at: r.created_at,
      participant: r.profiles,
    }))

    const activeMentees = mentees.length
    const sessionsHeld = (mentorSessionsRaw ?? []).filter((s: { status: string }) => s.status === "completed").length
    const daysAsMentor = profile.created_at
      ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    return (
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">
            Welcome back, {profile.full_name?.split(" ")[0] ?? "Mentor"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your mentees are counting on you</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: "Active Mentees", value: activeMentees, bg: "bg-brand-navy/10", iconClass: "text-brand-navy" },
            { icon: Calendar, label: "Sessions Held", value: sessionsHeld, bg: "bg-green-50", iconClass: "text-green-600" },
            { icon: Clock, label: "Days as Mentor", value: daysAsMentor, bg: "bg-brand-gold/10", iconClass: "text-brand-gold" },
          ].map(({ icon: Icon, label, value, bg, iconClass }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2 text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon size={20} className={iconClass} />
              </div>
              <span className="text-2xl font-extrabold text-brand-navy tabular-nums">{value}</span>
              <span className="text-xs text-gray-400 font-medium leading-tight">{label}</span>
            </div>
          ))}
        </div>

        <IncomingRequestsPanel requests={incomingRequests} />

        <div>
          <h2 className="text-lg font-bold text-brand-navy">My Mentees</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage progress, issue awards, and schedule sessions</p>
        </div>

        <MenteeControlPanel mentees={mentees} />
      </div>
    )
  }

  const sdgProgress = sdgRaw as Tables<"sdg_progress">[] | null
  const projects = projectsRaw as Tables<"projects">[] | null
  const sessions = sessionsRaw as Tables<"sessions">[] | null
  type MentorProfile = { full_name: string; country: string | null; avatar_url: string | null; organization: string | null }
  const pair = pairRaw as { mentor_id: string; profiles: MentorProfile | null } | null
  const onlineUsers = (onlineRaw ?? []) as { id: string; full_name: string; avatar_url: string | null }[]

  const engagedSdgs = sdgProgress?.map((s) => s.sdg_number) ?? []
  const activeProjects = projects?.length ?? 0
  const completedSessions = sessions?.length ?? 0
  const daysInProgram = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0
  const profileCompletion = profile ? calcProfileCompletion(profile) : 0

  return (
    <div className="p-6 space-y-6">
      <WelcomeCard
        name={profile?.full_name ?? "Leader"}
        role={profile?.role ?? "participant"}
        country={profile?.country ?? null}
        organization={profile?.organization ?? null}
        avatarUrl={profile?.avatar_url ?? null}
        daysInProgram={daysInProgram}
        profileCompletion={profileCompletion}
      />
      <MetricCards
        sdgCount={engagedSdgs.length}
        activeProjects={activeProjects}
        completedSessions={completedSessions}
      />
      <SdgProgressBar engagedSdgs={engagedSdgs} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed participantId={user.id} />
        <div className="space-y-6">
          <MentorPanel mentor={pair?.profiles ?? null} />
          <OnlineParticipants users={onlineUsers} />
        </div>
      </div>
    </div>
  )
}
