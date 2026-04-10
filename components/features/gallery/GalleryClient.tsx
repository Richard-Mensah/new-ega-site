"use client"

import { useState } from "react"
import type { GalleryPhoto } from "@/types"

type Category = "all" | "events" | "programs" | "sdg" | "team" | "conferences"

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "All Photos" },
  { value: "events", label: "Events" },
  { value: "programs", label: "Programs" },
  { value: "sdg", label: "SDG Projects" },
  { value: "team", label: "Team" },
  { value: "conferences", label: "Conferences" },
]

export default function GalleryClient({ photos }: { photos: GalleryPhoto[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("all")

  const filtered =
    activeCategory === "all" ? photos : photos.filter((p) => p.category === activeCategory)

  return (
    <section className="py-16 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === value
                  ? "bg-brand-navy text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-brand-navy"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-lg font-medium">Photos coming soon</p>
            <p className="text-sm mt-2">Check back after our next event</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((photo) => (
              <div key={photo.id} className="break-inside-avoid">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="bg-brand-navy/10 h-48 flex items-center justify-center">
                    <span className="text-brand-navy/30 text-sm font-medium">{photo.title ?? "EGA Photo"}</span>
                  </div>
                  {photo.title && (
                    <div className="p-3">
                      <p className="text-sm font-medium text-brand-navy">{photo.title}</p>
                      <span className="text-xs text-gray-400 capitalize">{photo.category}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
