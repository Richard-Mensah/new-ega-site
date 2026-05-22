import ProfileAvatar from "@/components/ui/ProfileAvatar"
import AppreciateButton from "./AppreciateButton"
import type { PublicProfile } from "@/types"

interface Props {
  profile: PublicProfile
  likeCount: number
  initialLiked: boolean
}

function formatJoinDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
}

export default function ProfileHero({ profile, likeCount, initialLiked }: Props) {
  const joinDate = formatJoinDate(profile.created_at)

  return (
    <div className="relative bg-gradient-to-br from-brand-navy to-[#1a3280] rounded-2xl p-6 overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -left-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

      {/* Content row */}
      <div className="relative flex items-start justify-between gap-4">
        {/* Left: avatar + identity */}
        <div className="flex items-center gap-4">
          <ProfileAvatar
            avatarUrl={profile.avatar_url}
            fullName={profile.full_name}
            size="xl"
            className="rounded-2xl border-4 border-brand-gold/40 shrink-0"
          />

          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-white leading-tight">{profile.full_name}</h1>

            {profile.organization && (
              <p className="text-sm text-brand-gold font-semibold">{profile.organization}</p>
            )}

            <p className="text-xs text-white/60">
              {profile.country && `${profile.country} · `}Joined {joinDate}
            </p>
          </div>
        </div>

        {/* Right: appreciate button */}
        <div className="shrink-0">
          <AppreciateButton
            profileId={profile.id}
            initialCount={likeCount}
            initialLiked={initialLiked}
          />
        </div>
      </div>
    </div>
  )
}
