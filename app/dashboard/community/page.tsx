import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CommunityGrid from "@/components/features/community/CommunityGrid"
import CommunityStats from "@/components/features/community/CommunityStats"
import NewMembersSpotlight from "@/components/features/community/NewMembersSpotlight"
import Leaderboard from "@/components/features/community/Leaderboard"
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

  // Derived data for new features
  const newestMembers = participants.slice(0, 5)

  const uniqueCountries = new Set(
    participants.map((p) => p.country).filter((c): c is string => c !== null)
  ).size

  const uniqueSdgs = new Set(
    participants.flatMap((p) => p.sdg_focus ?? [])
  ).size

  const totalAppreciations = Object.values(likeCounts).reduce((sum, n) => sum + n, 0)

  const topParticipants = [...participants]
    .sort((a, b) => (likeCounts[b.id] ?? 0) - (likeCounts[a.id] ?? 0))
    .slice(0, 5)
    .filter((p) => (likeCounts[p.id] ?? 0) > 0)

  return (
    <div className="px-4 py-5 sm:p-6 space-y-4 sm:space-y-6 overflow-x-hidden w-full">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Community</h1>
        <p className="text-gray-500 text-sm mt-1">
          Connect and appreciate fellow EGA participants
        </p>
      </div>

      <CommunityStats
        participantCount={participants.length}
        countryCount={uniqueCountries}
        sdgCount={uniqueSdgs}
        appreciationCount={totalAppreciations}
      />

      {newestMembers.length > 0 && <NewMembersSpotlight members={newestMembers} />}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0">
          <CommunityGrid
            participants={participants}
            likeCounts={likeCounts}
            myLikes={myLikes}
            currentUserId={user.id}
          />
        </div>

        {topParticipants.length > 0 && (
          <aside className="w-full lg:w-64 shrink-0">
            <Leaderboard participants={topParticipants} likeCounts={likeCounts} />
          </aside>
        )}
      </div>
    </div>
  )
}
