import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SDG_LIST } from "@/lib/constants/sdgs"
import LikeButton from "@/components/features/community/LikeButton"
import type { Tables } from "@/types/database"

type Profile = Tables<"profiles">
type Like = Pick<Tables<"profile_likes">, "liker_id" | "liked_id">

export default async function CommunityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ data: participantsRaw }, { data: likesRaw }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "participant")
      .neq("id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("profile_likes").select("liker_id, liked_id"),
  ])

  const participants = (participantsRaw as Profile[]) ?? []
  const likes = (likesRaw as Like[]) ?? []

  const likeCountMap = new Map<string, number>()
  const myLikedSet = new Set<string>()
  for (const like of likes) {
    likeCountMap.set(like.liked_id, (likeCountMap.get(like.liked_id) ?? 0) + 1)
    if (like.liker_id === user.id) myLikedSet.add(like.liked_id)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Community</h1>
        <p className="text-gray-500 text-sm mt-1">
          {participants.length} participant{participants.length !== 1 ? "s" : ""} in the EGA community
        </p>
      </div>

      {participants.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">👥</div>
          <p className="font-medium text-gray-500">No other participants yet</p>
          <p className="text-sm mt-1">Be the first to invite others to join</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((p) => {
            const initials = p.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
            const sdgs = (p.sdg_focus ?? []).slice(0, 3)
            const extraSdgs = (p.sdg_focus ?? []).length - 3

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  {p.avatar_url ? (
                    <img
                      src={p.avatar_url}
                      alt={p.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {initials}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-navy truncate">{p.full_name}</p>
                    {p.country && (
                      <p className="text-xs text-gray-400 truncate">{p.country}</p>
                    )}
                  </div>
                </div>

                {p.bio && (
                  <p className="text-xs text-gray-500 line-clamp-2">{p.bio}</p>
                )}

                {sdgs.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sdgs.map((num: number) => {
                      const sdg = SDG_LIST.find((s) => s.number === num)
                      return sdg ? (
                        <span
                          key={num}
                          className="text-white text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{ backgroundColor: sdg.color }}
                        >
                          SDG {num}
                        </span>
                      ) : null
                    })}
                    {extraSdgs > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        +{extraSdgs} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-xs text-gray-400">
                    Joined {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                  <LikeButton
                    profileId={p.id}
                    initialCount={likeCountMap.get(p.id) ?? 0}
                    initialLiked={myLikedSet.has(p.id)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
