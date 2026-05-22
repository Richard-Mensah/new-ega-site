import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { id } = body
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const { data: existing } = await supabase
    .from("portfolio_items")
    .select("participant_id")
    .eq("id", id)
    .single()

  if (!existing || existing.participant_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updates: {
    type?: string
    title?: string
    description?: string | null
    tags?: string[]
    content_url?: string | null
    published?: boolean
  } = {}
  if (body.type !== undefined) updates.type = body.type
  if (body.title !== undefined) updates.title = body.title
  if (body.description !== undefined) updates.description = body.description
  if (body.tags !== undefined) updates.tags = body.tags
  if (body.content_url !== undefined) updates.content_url = body.content_url
  if (body.published !== undefined) updates.published = body.published

  const { data, error } = await supabase
    .from("portfolio_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", id)
    .eq("participant_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
