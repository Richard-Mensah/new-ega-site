import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import KpiCards from "@/components/features/mentor-analytics/KpiCards"
import GrowthChart from "@/components/features/mentor-analytics/GrowthChart"
import MenteeCardGrid from "@/components/features/mentor-analytics/MenteeCardGrid"
import SdgRainbowBar from "@/components/ui/SdgRainbowBar"
import Card from "@/components/ui/Card"

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const profile = profileRaw as { role: string } | null
  if (profile?.role !== "mentor") redirect("/dashboard")

  // Fetch mentees
  const { data: pairsRaw } = await supabase
    .from("mentorship_pairs")
    .select("participant_id, profiles!participant_id(full_name, country)")
    .eq("mentor_id", user.id)
    .eq("status", "active")
  type MenteePair = { participant_id: string; profiles: { full_name: string; country: string | null } | null }
  const pairs = pairsRaw as MenteePair[] | null

  const participantIds = pairs?.map((p) => p.participant_id) ?? []

  // Fetch sessions count
  const { count: sessionsHeld } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("mentor_id", user.id)
    .eq("status", "completed")

  // Fetch milestones for growth calculation
  const { data: milestonesRaw } = await supabase
    .from("milestones")
    .select("*")
    .in("participant_id", participantIds)
  const milestones = milestonesRaw as { participant_id: string; score: number; type: string }[] | null

  // Fetch SDG progress for cohort
  const { data: sdgProgressRaw } = await supabase
    .from("sdg_progress")
    .select("*")
    .in("participant_id", participantIds)
  const sdgProgress = sdgProgressRaw as { sdg_number: number }[] | null

  // Calculate KPIs
  const totalMentees = participantIds.length

  const growthByMentee: Record<string, number[]> = {}
  for (const m of milestones ?? []) {
    if (!growthByMentee[m.participant_id]) growthByMentee[m.participant_id] = []
    growthByMentee[m.participant_id].push(m.score)
  }
  const avgScores = Object.values(growthByMentee).map(
    (scores) => scores.reduce((a, b) => a + b, 0) / scores.length
  )
  const avgGrowth = avgScores.length
    ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length)
    : 0

  const uniqueSdgs = [...new Set(sdgProgress?.map((s) => s.sdg_number) ?? [])]
  const avgSdgCoverage = totalMentees > 0
    ? Math.round((sdgProgress?.length ?? 0) / totalMentees)
    : 0

  // Build mentee cards data
  const menteeCards = (pairs ?? []).map((pair) => {
    const p = pair.profiles as { full_name: string; country: string | null } | null
    const myMilestones = milestones?.filter((m) => m.participant_id === pair.participant_id) ?? []
    const getScore = (type: string) => {
      const ms = myMilestones.filter((m) => m.type === type)
      return ms.length ? Math.round(ms.reduce((a, b) => a + b.score, 0) / ms.length) : 0
    }
    return {
      id: pair.participant_id,
      name: p?.full_name ?? "Unknown",
      country: p?.country ?? null,
      growthPct: getScore("overall"),
      leadership: getScore("leadership"),
      sdgEngagement: getScore("sdg_engagement"),
      communication: getScore("communication"),
      projects: getScore("projects"),
    }
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Mentee Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Track your cohort&apos;s growth and SDG engagement</p>
      </div>

      <KpiCards
        totalMentees={totalMentees}
        avgGrowth={avgGrowth}
        sessionsHeld={sessionsHeld ?? 0}
        avgSdgCoverage={avgSdgCoverage}
      />

      <GrowthChart />

      <Card>
        <h3 className="font-bold text-brand-navy mb-4">Cohort SDG Coverage</h3>
        <p className="text-sm text-gray-500 mb-3">
          {uniqueSdgs.length} of 17 SDGs engaged across your cohort
        </p>
        <SdgRainbowBar engagedSdgs={uniqueSdgs} height="md" showLabels />
      </Card>

      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Mentee Performance</h2>
        <MenteeCardGrid mentees={menteeCards} />
      </div>
    </div>
  )
}
