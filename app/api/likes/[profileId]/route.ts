import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

async function getCount(supabase: Awaited<ReturnType<typeof createClient>>, profileId: string) {
  const { count } = await supabase
    .from("profile_likes")
    .select("*", { count: "exact", head: true })
    .eq("liked_id", profileId)
  return count ?? 0
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (profileId === user.id) return NextResponse.json({ error: "Cannot like yourself" }, { status: 400 })

  await supabase.from("profile_likes").insert({ liker_id: user.id, liked_id: profileId })
  const count = await getCount(supabase, profileId)
  return NextResponse.json({ liked: true, count })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const { profileId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await supabase.from("profile_likes").delete().eq("liker_id", user.id).eq("liked_id", profileId)
  const count = await getCount(supabase, profileId)
  return NextResponse.json({ liked: false, count })
}
