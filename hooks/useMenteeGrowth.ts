"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { MenteeGrowthData } from "@/types"

type TimeRange = "1M" | "3M" | "6M"

const RANGE_WEEKS: Record<TimeRange, number> = {
  "1M": 4,
  "3M": 12,
  "6M": 24,
}

export function useMenteeGrowth(range: TimeRange) {
  const [data, setData] = useState<MenteeGrowthData[]>([])
  const [menteeNames, setMenteeNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchGrowth() {
      setLoading(true)

      const weeksBack = RANGE_WEEKS[range]
      const since = new Date()
      since.setDate(since.getDate() - weeksBack * 7)

      const { data: pairsRaw } = await supabase
        .from("mentorship_pairs")
        .select("participant_id, profiles!participant_id(full_name)")
        .eq("status", "active")
      type PairWithName = { participant_id: string; profiles: { full_name: string } | null }
      const pairs = pairsRaw as PairWithName[] | null

      if (!pairs) { setLoading(false); return }

      const names: Record<string, string> = {}
      for (const pair of pairs) {
        const profile = pair.profiles
        if (profile) names[pair.participant_id] = profile.full_name
      }
      setMenteeNames(names)

      const participantIds = pairs.map((p) => p.participant_id)

      const { data: milestonesRaw } = await supabase
        .from("milestones")
        .select("*")
        .in("participant_id", participantIds)
        .eq("type", "overall")
        .gte("recorded_at", since.toISOString())
        .order("recorded_at")
      type MilestoneRow = { participant_id: string; score: number; recorded_at: string }
      const milestones = milestonesRaw as MilestoneRow[] | null

      if (!milestones) { setLoading(false); return }

      const weekMap: Map<string, Record<string, number>> = new Map()

      for (const m of milestones) {
        const week = getWeekLabel(m.recorded_at)
        if (!weekMap.has(week)) weekMap.set(week, {})
        weekMap.get(week)![m.participant_id] = m.score
      }

      const chartData: MenteeGrowthData[] = Array.from(weekMap.entries()).map(
        ([week, scores]) => ({ week, scores })
      )

      setData(chartData)
      setLoading(false)
    }

    fetchGrowth()
  }, [range])

  return { data, menteeNames, loading }
}

function getWeekLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const week = Math.ceil(d.getDate() / 7)
  return `${d.toLocaleString("default", { month: "short" })} W${week}`
}
