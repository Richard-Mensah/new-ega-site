import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { recipient_id, content, attachment_url, attachment_type, attachment_name } = await req.json()

  if (!recipient_id || (!content?.trim() && !attachment_url)) {
    return NextResponse.json({ error: "recipient_id and content or attachment required" }, { status: 400 })
  }

  if (recipient_id === user.id) {
    return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("messages") as any)
    .insert({
      sender_id: user.id,
      recipient_id,
      content: content?.trim() ?? "",
      attachment_url: attachment_url ?? null,
      attachment_type: attachment_type ?? null,
      attachment_name: attachment_name ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
