import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import WelcomeCard from "@/components/features/dashboard/WelcomeCard"
import MetricCards from "@/components/features/dashboard/MetricCards"
import SdgProgressBar from "@/components/features/dashboard/SdgProgressBar"
import ActivityFeed from "@/components/features/dashboard/ActivityFeed"
import MentorPanel from "@/components/features/dashboard/MentorPanel"
import type { Tables } from "@/types/database"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [
    { data: profileRaw },
    { data: sdgRaw },
    { data: projectsRaw },
    { data: sessionsRaw },
    { data: pairRaw },
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
  ])

  const profile = profileRaw as Tables<"profiles"> | null
  const sdgProgress = sdgRaw as Tables<"sdg_progress">[] | null
  const projects = projectsRaw as Tables<"projects">[] | null
  const sessions = sessionsRaw as Tables<"sessions">[] | null
  type MentorProfile = { full_name: string; country: string | null; avatar_url: string | null }
  const pair = pairRaw as { mentor_id: string; profiles: MentorProfile | null } | null

  const engagedSdgs = sdgProgress?.map((s) => s.sdg_number) ?? []
  const activeProjects = projects?.length ?? 0
  const completedSessions = sessions?.length ?? 0
  const daysInProgram = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="p-6 space-y-6">
      <WelcomeCard
        name={profile?.full_name ?? "Leader"}
        role={profile?.role ?? "participant"}
        daysInProgram={daysInProgram}
      />
      <MetricCards
        sdgCount={engagedSdgs.length}
        activeProjects={activeProjects}
        completedSessions={completedSessions}
      />
      <SdgProgressBar engagedSdgs={engagedSdgs} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed participantId={user.id} />
        <MentorPanel mentor={pair?.profiles ?? null} />
      </div>
    </div>
  )
}
