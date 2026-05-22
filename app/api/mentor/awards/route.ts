import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const VALID_CATEGORIES = ["leadership", "sdg_engagement", "communication", "projects", "overall"]

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { participantId, category, title, notes } = await request.json()
  if (!participantId || !category || !title?.trim()) {
    return NextResponse.json({ error: "Missing participantId, category, or title" }, { status: 400 })
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 })
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
    .from("mentor_awards")
    .insert({
      mentor_id: user.id,
      participant_id: participantId,
      category,
      title: title.trim(),
      notes: notes?.trim() || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ award: data })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { awardId } = await request.json()
  if (!awardId) return NextResponse.json({ error: "Missing awardId" }, { status: 400 })

  const { error } = await supabase
    .from("mentor_awards")
    .delete()
    .eq("id", awardId)
    .eq("mentor_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
