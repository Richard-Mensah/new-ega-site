"use client"

import { useRef, useState } from "react"
import { Heart } from "lucide-react"

type Props = {
  profileId: string
  initialCount: number
  initialLiked: boolean
}

export default function AppreciateButton({ profileId, initialCount, initialLiked }: Props) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const inflightRef = useRef(false)

  async function toggle() {
    if (inflightRef.current) return
    inflightRef.current = true

    const nextLiked = !liked
    const nextCount = nextLiked ? count + 1 : Math.max(0, count - 1)
    setLiked(nextLiked)
    setCount(nextCount)

    try {
      const res = await fetch(`/api/likes/${profileId}`, { method: nextLiked ? "POST" : "DELETE" })
      if (res.ok) {
        const json = await res.json()
        setCount(json.count)
      } else {
        setLiked(liked)
        setCount(count)
      }
    } catch {
      setLiked(liked)
      setCount(count)
    } finally {
      inflightRef.current = false
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={liked ? "Remove appreciation" : "Appreciate this profile"}
      className={`group flex flex-col items-center justify-center gap-1 px-6 py-4 rounded-2xl border-2 transition-all duration-200 ${
        liked
          ? "bg-brand-gold border-brand-gold text-white"
          : "bg-transparent border-brand-gold text-brand-gold hover:bg-brand-gold/10"
      }`}
    >
      <Heart
        size={28}
        fill={liked ? "currentColor" : "none"}
        className="transition-transform duration-200 group-hover:scale-110"
      />
      <span className="text-xl font-bold leading-none">{count}</span>
      <span className="text-xs font-medium uppercase tracking-wide leading-none">Appreciations</span>
    </button>
  )
}
