"use client"

import { useRef, useState } from "react"
import { Heart } from "lucide-react"

type Props = {
  profileId: string
  initialCount: number
  initialLiked: boolean
}

export default function LikeButton({ profileId, initialCount, initialLiked }: Props) {
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
        liked
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400"
      }`}
    >
      <Heart size={14} fill={liked ? "currentColor" : "none"} />
      <span>{count}</span>
    </button>
  )
}
