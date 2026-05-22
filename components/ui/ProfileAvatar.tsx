"use client"

import { useState } from "react"

interface Props {
  avatarUrl: string | null
  fullName: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const SIZES = {
  sm:  { outer: "w-8 h-8",  text: "text-xs" },
  md:  { outer: "w-12 h-12", text: "text-sm" },
  lg:  { outer: "w-14 h-14", text: "text-base" },
  xl:  { outer: "w-20 h-20", text: "text-xl" },
}

export default function ProfileAvatar({ avatarUrl, fullName, size = "md", className = "" }: Props) {
  const [failed, setFailed] = useState(false)

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const { outer, text } = SIZES[size]

  if (avatarUrl && !failed) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        onError={() => setFailed(true)}
        className={`${outer} rounded-full object-cover shrink-0 ${className}`}
      />
    )
  }

  return (
    <div className={`${outer} rounded-full bg-brand-navy flex items-center justify-center shrink-0 ${className}`}>
      <span className={`text-white font-bold ${text}`}>{initials}</span>
    </div>
  )
}
