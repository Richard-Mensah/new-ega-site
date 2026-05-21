import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import WelcomeCard from "@/components/features/dashboard/WelcomeCard"
import MetricCards from "@/components/features/dashboard/MetricCards"
import SdgProgressBar from "@/components/features/dashboard/SdgProgressBar"
import ActivityFeed from "@/components/features/dashboard/ActivityFeed"
import MentorPanel from "@/components/features/dashboard/MentorPanel"
import OnlineParticipants from "@/components/features/dashboard/OnlineParticipants"
import type { Tables } from "@/types/database"

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
      .select("mentor_id, profiles!mentor_id(full_name, country, avatar_url)")
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
  const sdgProgress = sdgRaw as Tables<"sdg_progress">[] | null
  const projects = projectsRaw as Tables<"projects">[] | null
  const sessions = sessionsRaw as Tables<"sessions">[] | null
  type MentorProfile = { full_name: string; country: string | null; avatar_url: string | null }
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
