import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { sender_id } = await req.json()
  if (!sender_id) return NextResponse.json({ error: "sender_id required" }, { status: 400 })

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", user.id)
    .eq("sender_id", sender_id)
    .is("read_at", null)

  return NextResponse.json({ ok: true })
}
