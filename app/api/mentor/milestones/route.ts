import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const MILESTONE_TYPES = ["leadership", "sdg_engagement", "communication", "projects", "overall"]

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { participantId, type, score } = await request.json()
  if (!participantId || !type || score === undefined) {
    return NextResponse.json({ error: "Missing participantId, type, or score" }, { status: 400 })
  }
  if (!MILESTONE_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid milestone type" }, { status: 400 })
  }
  const numericScore = Number(score)
  if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
    return NextResponse.json({ error: "Score must be 0–100" }, { status: 400 })
  }

  // Verify mentor has active pair with this participant
  const { data: pair } = await supabase
    .from("mentorship_pairs")
    .select("id")
    .eq("mentor_id", user.id)
    .eq("participant_id", participantId)
    .eq("status", "active")
    .single()

  if (!pair) {
    return NextResponse.json({ error: "Not authorised for this participant" }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("milestones")
    .insert({ participant_id: participantId, type, score: numericScore })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ milestone: data })
}
