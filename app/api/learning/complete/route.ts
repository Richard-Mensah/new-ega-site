import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { moduleId, topicId } = await request.json()
  if (!moduleId || !topicId) return NextResponse.json({ error: "Missing moduleId or topicId" }, { status: 400 })

  await supabase.from("module_completions").upsert(
    { participant_id: user.id, module_id: moduleId, topic_id: topicId },
    { onConflict: "participant_id,module_id,topic_id" }
  )

  return NextResponse.json({ completed: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { moduleId, topicId } = await request.json()
  if (!moduleId || !topicId) return NextResponse.json({ error: "Missing moduleId or topicId" }, { status: 400 })

  await supabase
    .from("module_completions")
    .delete()
    .eq("participant_id", user.id)
    .eq("module_id", moduleId)
    .eq("topic_id", topicId)

  return NextResponse.json({ completed: false })
}
