import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { message, focus_areas } = await req.json()

  if (!message || typeof message !== "string" || message.trim().length < 20) {
    return NextResponse.json({ error: "Message must be at least 20 characters" }, { status: 400 })
  }

  const { data: activePair } = await supabase
    .from("mentorship_pairs")
    .select("id")
    .eq("participant_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  if (activePair) {
    return NextResponse.json({ error: "You already have an active mentor" }, { status: 400 })
  }

  const { data: pendingRequest } = await supabase
    .from("mentor_requests")
    .select("id")
    .eq("participant_id", user.id)
    .eq("status", "pending")
    .maybeSingle()

  if (pendingRequest) {
    return NextResponse.json({ error: "You already have a pending request" }, { status: 400 })
  }

  const { error } = await supabase
    .from("mentor_requests")
    .insert({ participant_id: user.id, message: message.trim(), focus_areas })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true }, { status: 200 })
}
