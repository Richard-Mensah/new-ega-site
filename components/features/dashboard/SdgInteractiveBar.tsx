"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle2, ChevronDown } from "lucide-react"
import { SDG_LIST } from "@/lib/constants/sdgs"

interface Props {
  engagedSdgs: number[]
}

export default function SdgInteractiveBar({ engagedSdgs }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Trigger entrance animation after mount
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const selected = SDG_LIST.find((s) => s.number === selectedId) ?? null
  const isEngaged = (n: number) => engagedSdgs.includes(n)

  function toggle(n: number) {
    setSelectedId((prev) => (prev === n ? null : n))
  }

  return (
    <div>
      {/* Bar */}
      <div className="flex h-10 rounded-lg overflow-hidden gap-px bg-gray-100">
        {SDG_LIST.map((sdg, i) => {
          const engaged = isEngaged(sdg.number)
          const isHovered = hoveredId === sdg.number
          const isSelected = selectedId === sdg.number

          return (
            <button
              key={sdg.number}
              type="button"
              onClick={() => toggle(sdg.number)}
              onMouseEnter={() => setHoveredId(sdg.number)}
              onMouseLeave={() => setHoveredId(null)}
              title={`SDG ${sdg.number}: ${sdg.title}`}
              className="relative flex-1 h-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              style={{
                backgroundColor: sdg.color,
                opacity: mounted ? (engaged ? 1 : 0.25) : 0,
                transform: isHovered || isSelected ? "scaleY(1.08)" : "scaleY(1)",
                transitionDelay: mounted ? `${i * 30}ms` : "0ms",
                outline: isSelected ? `2px solid ${sdg.color}` : undefined,
                outlineOffset: isSelected ? "2px" : undefined,
              }}
              aria-label={`SDG ${sdg.number}: ${sdg.title}${engaged ? " (engaged)" : ""}`}
            >
              {engaged && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white drop-shadow" />
                </span>
              )}
              {isSelected && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                  <ChevronDown size={12} style={{ color: sdg.color }} />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Hover tooltip */}
      {hoveredId && !selectedId && (
        <p className="mt-2 text-xs text-gray-500 text-center">
          <span className="font-semibold">SDG {hoveredId}:</span>{" "}
          {SDG_LIST.find((s) => s.number === hoveredId)?.title}
          {isEngaged(hoveredId) && (
            <span className="ml-1.5 text-brand-gold font-semibold">· Engaged ✓</span>
          )}
        </p>
      )}

      {/* Expanded detail panel */}
      {selected && (
        <div
          className="mt-4 rounded-xl border-l-4 p-4 space-y-3 transition-all"
          style={{ borderColor: selected.color, backgroundColor: `${selected.color}10` }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-wide"
                style={{ color: selected.color }}
              >
                SDG {selected.number}
              </p>
              <p className="font-bold text-brand-navy text-sm mt-0.5">{selected.title}</p>
            </div>
            {isEngaged(selected.number) && (
              <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <CheckCircle2 size={11} />
                Engaged
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {selected.description.slice(0, 160)}
            {selected.description.length > 160 ? "…" : ""}
          </p>

          <p className="text-xs text-gray-500 italic leading-relaxed">{selected.egaApproach}</p>

          {!isEngaged(selected.number) && (
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: selected.color }}
            >
              Start a project on this goal →
            </Link>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-brand-gold inline-block" />
          Engaged
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-200 inline-block" />
          Not yet started
        </div>
        <span className="ml-auto text-gray-400">Click any goal to explore</span>
      </div>
    </div>
  )
}
