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
  const sdgDots = (participant.sdg_focus ?? []).slice(0, 3).map((num) =>
    SDG_LIST.find((s) => s.number === num) ?? null
  ).filter(Boolean) as (typeof SDG_LIST)[number][]

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-visible shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col">
      {/* Navy gradient banner */}
      <div className="relative h-[52px] rounded-t-2xl bg-gradient-to-r from-brand-navy to-[#1a2e6e] overflow-visible shrink-0">
        {/* SDG colour dots — bottom-left of banner, overlapping the bottom edge */}
        {sdgDots.length > 0 && (
          <div className="absolute bottom-[-8px] left-3 flex gap-1.5 z-10">
            {sdgDots.map((sdg) => (
              <span
                key={sdg.number}
                title={`SDG ${sdg.number}: ${sdg.title}`}
                className="inline-block w-4 h-4 shrink-0"
                style={{
                  backgroundColor: sdg.color,
                  borderRadius: "4px",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card body — wrapped in Link for navigation */}
      <Link
        href={`/dashboard/community/${participant.id}`}
        className="flex flex-col flex-1 px-4 pb-0 pt-0 cursor-pointer"
      >
        {/* Avatar overlapping banner by ~20px (negative margin-top) */}
        <div className="-mt-5 mb-2">
          <ProfileAvatar
            avatarUrl={participant.avatar_url}
            fullName={participant.full_name}
            size="lg"
            className="border-2 border-white ring-2 ring-brand-gold/30"
          />
        </div>

        {/* Identity */}
        <p className="font-bold text-brand-navy leading-tight truncate">
          {participant.full_name}
        </p>
        {participant.organization && (
          <p className="text-xs font-semibold text-brand-gold truncate mt-0.5">
            {participant.organization}
          </p>
        )}
        {participant.country && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {participant.country}
          </p>
        )}

        {/* Bio */}
        {participant.bio && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-2 flex-1">
            {participant.bio}
          </p>
        )}

        {/* Spacer so footer always sits at bottom */}
        <div className="flex-1" />

        {/* View Profile label — changes style on card hover */}
        <div className="mt-3 mb-3 flex justify-end">
          <span className="text-xs font-semibold text-brand-navy/60 px-2.5 py-1 rounded-lg border border-transparent transition-all duration-200 group-hover:bg-brand-navy group-hover:text-white">
            View Profile →
          </span>
        </div>
      </Link>

      {/* Footer — LikeButton lives OUTSIDE the Link to prevent navigation */}
      <div
        className="px-4 pb-3 border-t border-gray-50 pt-2 flex items-center justify-between"
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
