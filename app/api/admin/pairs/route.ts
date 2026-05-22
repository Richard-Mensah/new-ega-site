import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  if (!ADMIN_EMAILS.includes(user.email ?? "")) return null
  return user
}

// POST — create a new mentorship pair
export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { mentorId, participantId, notes } = await request.json()
  if (!mentorId || !participantId) {
    return NextResponse.json({ error: "Missing mentorId or participantId" }, { status: 400 })
  }

  try {
    const admin = createAdminClient()

    // Validate roles
    const [{ data: mentor }, { data: participant }] = await Promise.all([
      admin.from("profiles").select("id,role,full_name").eq("id", mentorId).single(),
      admin.from("profiles").select("id,role,full_name").eq("id", participantId).single(),
    ])
    if (!mentor || mentor.role !== "mentor") {
      return NextResponse.json({ error: "Profile is not a mentor" }, { status: 400 })
    }
    if (!participant || participant.role !== "participant") {
      return NextResponse.json({ error: "Profile is not a participant" }, { status: 400 })
    }

    const { data, error } = await admin
      .from("mentorship_pairs")
      .insert({ mentor_id: mentorId, participant_id: participantId, notes: notes ?? null })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ pair: data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// PATCH — update a pair's status or notes
export async function PATCH(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { pairId, status, notes } = await request.json()
  if (!pairId) return NextResponse.json({ error: "Missing pairId" }, { status: 400 })

  type PairUpdate = { status?: string; notes?: string | null }
  const updates: PairUpdate = {}
  if (status !== undefined) updates.status = status
  if (notes !== undefined) updates.notes = notes
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("mentorship_pairs")
      .update(updates)
      .eq("id", pairId)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ pair: data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// DELETE — remove a pair
export async function DELETE(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { pairId } = await request.json()
  if (!pairId) return NextResponse.json({ error: "Missing pairId" }, { status: 400 })

  try {
    const admin = createAdminClient()
    const { error } = await admin.from("mentorship_pairs").delete().eq("id", pairId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
