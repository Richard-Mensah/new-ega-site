import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { note } = await req.json().catch(() => ({ note: undefined }))

  const admin = createAdminClient()

  const { data: request } = await admin
    .from("mentor_requests")
    .select("id, target_mentor_id, status")
    .eq("id", id)
    .single()

  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 })
  if (request.target_mentor_id !== user.id) return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  if (request.status !== "pending") return NextResponse.json({ error: "Request is not pending" }, { status: 400 })

  await admin
    .from("mentor_requests")
    .update({ status: "declined", admin_note: note ?? null })
    .eq("id", id)

  return NextResponse.json({ ok: true })
}
