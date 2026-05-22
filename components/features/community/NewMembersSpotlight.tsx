import Link from "next/link"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import type { PublicProfile } from "@/types"

type Props = {
  members: PublicProfile[]
}

export default function NewMembersSpotlight({ members }: Props) {
  if (members.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-brand-navy">Just Joined</h2>
        <span className="text-xs text-gray-400">{members.length} newest members</span>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {members.map((m) => (
          <Link
            key={m.id}
            href={`/dashboard/community/${m.id}`}
            className="w-36 shrink-0 flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-3 hover:border-brand-gold hover:shadow-md transition-all"
          >
            {/* Avatar + NEW badge */}
            <div className="relative">
              <ProfileAvatar
                avatarUrl={m.avatar_url}
                fullName={m.full_name}
                size="md"
                className="border-2 border-white shadow-sm"
              />
              <span className="absolute -top-1 -right-1 text-[9px] font-extrabold bg-brand-gold text-white px-1.5 py-0.5 rounded-full leading-none tracking-wide">
                NEW
              </span>
            </div>

            {/* Identity */}
            <div className="w-full text-center">
              <p className="text-xs font-bold text-brand-navy leading-tight truncate">
                {m.full_name}
              </p>
              {m.organization && (
                <p className="text-[10px] text-brand-gold font-semibold truncate mt-0.5">
                  {m.organization}
                </p>
              )}
              {m.country && (
                <p className="text-[10px] text-gray-400 truncate mt-0.5">{m.country}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
