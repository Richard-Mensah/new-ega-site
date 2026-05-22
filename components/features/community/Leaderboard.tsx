import Link from "next/link"
import { Heart } from "lucide-react"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import type { PublicProfile } from "@/types"

type Props = {
  participants: PublicProfile[]
  likeCounts: Record<string, number>
}

const MEDALS = ["🥇", "🥈", "🥉"]

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return <span className="text-lg leading-none shrink-0">{MEDALS[rank - 1]}</span>
  }
  return (
    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
      {rank}
    </span>
  )
}

export default function Leaderboard({ participants, likeCounts }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Heart size={15} className="text-red-400 shrink-0" fill="currentColor" />
        <h2 className="text-sm font-bold text-brand-navy">Most Appreciated</h2>
      </div>

      {/* Ranked list */}
      <ol className="space-y-1">
        {participants.map((p, i) => {
          const count = likeCounts[p.id] ?? 0
          return (
            <li key={p.id}>
              <Link
                href={`/dashboard/community/${p.id}`}
                className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-brand-bg transition-colors group"
              >
                <RankBadge rank={i + 1} />

                <ProfileAvatar
                  avatarUrl={p.avatar_url}
                  fullName={p.full_name}
                  size="sm"
                  className="border border-gray-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-brand-navy leading-tight truncate">
                    {p.full_name}
                  </p>
                  {p.organization && (
                    <p className="text-[10px] text-gray-400 truncate">{p.organization}</p>
                  )}
                </div>

                <span className="shrink-0 flex items-center gap-0.5 text-[10px] font-semibold text-red-400 bg-red-50 px-1.5 py-0.5 rounded-full">
                  <Heart size={9} fill="currentColor" />
                  {count}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
