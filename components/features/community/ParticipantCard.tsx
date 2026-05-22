"use client"

import Link from "next/link"
import ProfileAvatar from "@/components/ui/ProfileAvatar"
import LikeButton from "@/components/features/community/LikeButton"
import { SDG_LIST } from "@/lib/constants/sdgs"
import type { PublicProfile } from "@/types"

type Props = {
  participant: PublicProfile
  likeCount: number
  liked: boolean
}

export default function ParticipantCard({ participant, likeCount, liked }: Props) {
  const sdgDots = (participant.sdg_focus ?? []).slice(0, 4).map((num) =>
    SDG_LIST.find((s) => s.number === num) ?? null
  ).filter(Boolean) as (typeof SDG_LIST)[number][]

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col">

      {/* Card body — wrapped in Link for navigation */}
      <Link
        href={`/dashboard/community/${participant.id}`}
        className="flex flex-col flex-1 cursor-pointer"
      >
        {/* Top: name + org + country */}
        <div className="px-4 pt-4 pb-3">
          <p className="font-bold text-brand-navy leading-tight truncate text-base">
            {participant.full_name}
          </p>
          {participant.organization && (
            <p className="text-xs font-semibold text-brand-gold truncate mt-0.5">
              {participant.organization}
            </p>
          )}
          {participant.country && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{participant.country}</p>
          )}
        </div>

        {/* Avatar area — subtle gradient bg so photo pops */}
        <div className="flex flex-col items-center gap-2 py-4 bg-gradient-to-b from-brand-bg to-white">
          <ProfileAvatar
            avatarUrl={participant.avatar_url}
            fullName={participant.full_name}
            size="xl"
            className="border-2 border-white shadow-md"
          />

          {/* SDG colour dots below avatar */}
          {sdgDots.length > 0 && (
            <div className="flex gap-1.5">
              {sdgDots.map((sdg) => (
                <span
                  key={sdg.number}
                  title={`SDG ${sdg.number}: ${sdg.title}`}
                  className="w-3.5 h-3.5 rounded shrink-0"
                  style={{ backgroundColor: sdg.color }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bio */}
        {participant.bio && (
          <p className="text-xs text-gray-500 line-clamp-2 px-4 pt-1 pb-2">{participant.bio}</p>
        )}

        {/* Spacer so footer always sits at bottom */}
        <div className="flex-1" />

        {/* View Profile label */}
        <div className="px-4 pb-3 flex justify-end">
          <span className="text-xs font-semibold text-brand-navy/60 px-2.5 py-1 rounded-lg border border-transparent transition-all duration-200 group-hover:bg-brand-navy group-hover:text-white">
            View Profile →
          </span>
        </div>
      </Link>

      {/* Footer — LikeButton lives OUTSIDE the Link to prevent navigation */}
      <div
        className="px-4 pb-3 border-t border-gray-100 pt-2 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <LikeButton
          profileId={participant.id}
          initialCount={likeCount}
          initialLiked={liked}
        />
        <span className="text-xs text-gray-400">
          Joined{" "}
          {new Date(participant.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  )
}
