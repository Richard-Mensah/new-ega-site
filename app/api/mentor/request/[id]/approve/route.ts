import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const admin = createAdminClient()

  const { data: request } = await admin
    .from("mentor_requests")
    .select("id, participant_id, target_mentor_id, status")
    .eq("id", id)
    .single()

  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 })
  if (request.target_mentor_id !== user.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  if (request.status !== "pending") return NextResponse.json({ error: "Request is not pending" }, { status: 400 })

  const { data: existingPair } = await admin
    .from("mentorship_pairs")
    .select("id")
    .eq("participant_id", request.participant_id)
    .eq("status", "active")
    .maybeSingle()

  if (existingPair) return NextResponse.json({ error: "Participant already has an active mentor" }, { status: 400 })

  const { error: pairError } = await admin
    .from("mentorship_pairs")
    .insert({ mentor_id: user.id, participant_id: request.participant_id, status: "active" })

  if (pairError) return NextResponse.json({ error: pairError.message }, { status: 500 })

  await admin.from("mentor_requests").update({ status: "approved" }).eq("id", id)

  return NextResponse.json({ ok: true })
}
