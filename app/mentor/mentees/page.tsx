import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import MenteeControlPanel from "@/components/features/mentor/MenteeControlPanel"

export default async function MenteesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profileRaw } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if ((profileRaw as { role: string } | null)?.role !== "mentor") redirect("/dashboard")

  const { data: pairsRaw } = await supabase
    .from("mentorship_pairs")
    .select("participant_id, matched_at, profiles!participant_id(id,full_name,country,avatar_url,bio,organization,linkedin_url,sdg_focus,created_at)")
    .eq("mentor_id", user.id)
    .eq("status", "active")

  type MenteeProfile = {
    id: string; full_name: string; country: string | null; avatar_url: string | null
    bio: string | null; organization: string | null; linkedin_url: string | null
    sdg_focus: number[]; created_at: string
  }
  type MenteePair = { participant_id: string; matched_at: string; profiles: MenteeProfile | null }
  const pairs = (pairsRaw as MenteePair[] | null) ?? []
  const participantIds = pairs.map((p) => p.participant_id)

  const [
    { data: milestonesRaw },
    { data: awardsRaw },
    { data: sessionsRaw },
    { data: projectsRaw },
    { data: sdgRaw },
  ] = await Promise.all([
    participantIds.length > 0
      ? supabase.from("milestones").select("*").in("participant_id", participantIds)
      : Promise.resolve({ data: [] }),
    participantIds.length > 0
      ? supabase.from("mentor_awards").select("*").eq("mentor_id", user.id).in("participant_id", participantIds)
      : Promise.resolve({ data: [] }),
    participantIds.length > 0
      ? supabase.from("sessions").select("id,participant_id,status").eq("mentor_id", user.id).in("participant_id", participantIds)
      : Promise.resolve({ data: [] }),
    participantIds.length > 0
      ? supabase.from("projects").select("id,participant_id").eq("status", "active").in("participant_id", participantIds)
      : Promise.resolve({ data: [] }),
    participantIds.length > 0
      ? supabase.from("sdg_progress").select("participant_id,sdg_number").in("participant_id", participantIds)
      : Promise.resolve({ data: [] }),
  ])

  type MilestoneRow = { id: string; participant_id: string; type: string; score: number; recorded_at: string }
  type AwardRow = { id: string; mentor_id: string; participant_id: string; category: string; title: string; notes: string | null; awarded_at: string }

  const milestones = (milestonesRaw ?? []) as MilestoneRow[]
  const awards = (awardsRaw ?? []) as AwardRow[]
  const sessions = (sessionsRaw ?? []) as { id: string; participant_id: string; status: string }[]
  const projects = (projectsRaw ?? []) as { id: string; participant_id: string }[]
  const sdgProgress = (sdgRaw ?? []) as { participant_id: string; sdg_number: number }[]

  const mentees = pairs.map((pair) => {
    const p = pair.profiles!
    const myMilestones = milestones.filter((m) => m.participant_id === pair.participant_id)
    const getScore = (type: string) => {
      const ms = myMilestones.filter((m) => m.type === type)
      return ms.length ? Math.round(ms.reduce((a, b) => a + b.score, 0) / ms.length) : 0
    }
    return {
      id: pair.participant_id,
      matched_at: pair.matched_at,
      full_name: p.full_name,
      country: p.country,
      avatar_url: p.avatar_url,
      bio: p.bio,
      organization: p.organization,
      linkedin_url: p.linkedin_url,
      sdg_count: [...new Set(sdgProgress.filter((s) => s.participant_id === pair.participant_id).map((s) => s.sdg_number))].length,
      projects_count: projects.filter((pr) => pr.participant_id === pair.participant_id).length,
      sessions_count: sessions.filter((s) => s.participant_id === pair.participant_id && s.status === "completed").length,
      days_in_program: Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      scores: {
        leadership: getScore("leadership"),
        sdg_engagement: getScore("sdg_engagement"),
        communication: getScore("communication"),
        projects: getScore("projects"),
        overall: getScore("overall"),
      },
      awards: awards.filter((a) => a.participant_id === pair.participant_id),
    }
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">My Mentees</h1>
        <p className="text-gray-500 text-sm mt-1">{mentees.length} active mentee{mentees.length !== 1 ? "s" : ""} — manage their growth and awards</p>
      </div>
      <MenteeControlPanel mentees={mentees} />
    </div>
  )
}
