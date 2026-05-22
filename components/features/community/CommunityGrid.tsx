"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { SDG_LIST } from "@/lib/constants/sdgs"
import ParticipantCard from "@/components/features/community/ParticipantCard"
import type { PublicProfile } from "@/types"

type Props = {
  participants: PublicProfile[]
  likeCounts: Record<string, number>
  myLikes: string[]
  currentUserId: string
}

// Country code map for flag emojis (common countries in EGA program)
const COUNTRY_FLAGS: Record<string, string> = {
  Ghana: "🇬🇭",
  Zambia: "🇿🇲",
  Liberia: "🇱🇷",
  Nigeria: "🇳🇬",
  Kenya: "🇰🇪",
  Uganda: "🇺🇬",
  Tanzania: "🇹🇿",
  Rwanda: "🇷🇼",
  "South Africa": "🇿🇦",
  Ethiopia: "🇪🇹",
  Cameroon: "🇨🇲",
  Senegal: "🇸🇳",
  "Ivory Coast": "🇨🇮",
  "Côte d'Ivoire": "🇨🇮",
  Egypt: "🇪🇬",
  Morocco: "🇲🇦",
  "United Kingdom": "🇬🇧",
  UK: "🇬🇧",
  "United States": "🇺🇸",
  USA: "🇺🇸",
  Canada: "🇨🇦",
  Germany: "🇩🇪",
  France: "🇫🇷",
}

export default function CommunityGrid({
  participants,
  likeCounts,
  myLikes,
  currentUserId,
}: Props) {
  const [search, setSearch] = useState("")
  const [sdgFilter, setSdgFilter] = useState<number | null>(null)
  const [countryFilter, setCountryFilter] = useState<string | null>(null)

  // Derive unique SDGs present across all participants
  const availableSdgs = useMemo(() => {
    const sdgSet = new Set<number>()
    for (const p of participants) {
      for (const num of p.sdg_focus ?? []) {
        sdgSet.add(num)
      }
    }
    return SDG_LIST.filter((s) => sdgSet.has(s.number))
  }, [participants])

  // Derive unique non-null countries
  const availableCountries = useMemo(() => {
    const countrySet = new Set<string>()
    for (const p of participants) {
      if (p.country) countrySet.add(p.country)
    }
    return Array.from(countrySet).sort()
  }, [participants])

  // Apply all active filters
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return participants.filter((p) => {
      // Search filter
      if (q) {
        const inName = p.full_name?.toLowerCase().includes(q)
        const inOrg = p.organization?.toLowerCase().includes(q)
        const inCountry = p.country?.toLowerCase().includes(q)
        if (!inName && !inOrg && !inCountry) return false
      }
      // SDG filter
      if (sdgFilter !== null) {
        if (!(p.sdg_focus ?? []).includes(sdgFilter)) return false
      }
      // Country filter
      if (countryFilter !== null) {
        if (p.country !== countryFilter) return false
      }
      return true
    })
  }, [participants, search, sdgFilter, countryFilter])

  const myLikesSet = useMemo(() => new Set(myLikes), [myLikes])
  const hasFilters = search !== "" || sdgFilter !== null || countryFilter !== null

  function resetFilters() {
    setSearch("")
    setSdgFilter(null)
    setCountryFilter(null)
  }

  return (
    <div className="space-y-4">
      {/* Search box */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={16}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search participants..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy transition-colors"
        />
      </div>

      {/* Filter chips row */}
      {(availableSdgs.length > 0 || availableCountries.length > 0) && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {/* All chip */}
          <button
            onClick={resetFilters}
            className={`px-3 py-1 text-xs rounded-full font-semibold shrink-0 transition-colors ${
              !hasFilters
                ? "bg-brand-navy text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>

          {/* SDG filter chips */}
          {availableSdgs.map((sdg) => {
            const active = sdgFilter === sdg.number
            return (
              <button
                key={sdg.number}
                onClick={() => setSdgFilter(active ? null : sdg.number)}
                style={{ backgroundColor: sdg.color }}
                className={`px-3 py-1 text-xs rounded-full font-semibold text-white shrink-0 transition-all ${
                  active
                    ? "ring-2 ring-offset-1 ring-gray-800 opacity-100"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                SDG {sdg.number}
              </button>
            )
          })}

          {/* Divider between SDG and country chips */}
          {availableSdgs.length > 0 && availableCountries.length > 0 && (
            <span className="shrink-0 self-center text-gray-300 select-none">|</span>
          )}

          {/* Country filter chips */}
          {availableCountries.map((country) => {
            const active = countryFilter === country
            const flag = COUNTRY_FLAGS[country] ?? ""
            return (
              <button
                key={country}
                onClick={() => setCountryFilter(active ? null : country)}
                className={`px-3 py-1 text-xs rounded-full font-semibold shrink-0 transition-colors ${
                  active
                    ? "bg-brand-navy text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {flag ? `${flag} ${country}` : country}
              </button>
            )
          })}
        </div>
      )}

      {/* Result count */}
      <p className="text-xs text-gray-400 font-medium">
        {filtered.length} participant{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          {participants.length === 0 ? (
            <>
              <div className="text-5xl mb-4">👥</div>
              <p className="font-medium text-gray-500">No other participants yet</p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium text-gray-500">No participants match your search</p>
              <button
                onClick={resetFilters}
                className="mt-3 text-sm font-semibold text-brand-navy underline underline-offset-2 hover:text-brand-navy/70 transition-colors"
              >
                Reset filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ParticipantCard
              key={p.id}
              participant={p}
              likeCount={likeCounts[p.id] ?? 0}
              liked={myLikesSet.has(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
