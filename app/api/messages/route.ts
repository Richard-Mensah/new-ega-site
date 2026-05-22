import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { recipient_id, content } = await req.json()

  if (!recipient_id || !content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "recipient_id and content are required" }, { status: 400 })
  }

  if (recipient_id === user.id) {
    return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: user.id, recipient_id, content: content.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
