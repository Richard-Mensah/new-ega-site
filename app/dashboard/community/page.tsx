import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CommunityGrid from "@/components/features/community/CommunityGrid"
import type { PublicProfile } from "@/types"

export default async function CommunityPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: participantsRaw }, { data: likesRaw }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, full_name, country, organization, bio, avatar_url, sdg_focus, linkedin_url, created_at"
      )
      .eq("role", "participant")
      .neq("id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("profile_likes").select("liker_id, liked_id"),
  ])

  const participants = (participantsRaw ?? []) as PublicProfile[]
  const likes = likesRaw ?? []

  // Build like counts per profile
  const likeCounts: Record<string, number> = {}
  const myLikes: string[] = []

  for (const like of likes) {
    likeCounts[like.liked_id] = (likeCounts[like.liked_id] ?? 0) + 1
    if (like.liker_id === user.id) {
      myLikes.push(like.liked_id)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Community</h1>
        <p className="text-gray-500 text-sm mt-1">
          Connect and appreciate fellow EGA participants
        </p>
      </div>
      <CommunityGrid
        participants={participants}
        likeCounts={likeCounts}
        myLikes={myLikes}
        currentUserId={user.id}
      />
    </div>
  )
}
