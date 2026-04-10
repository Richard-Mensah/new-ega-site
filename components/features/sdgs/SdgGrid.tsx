import Link from "next/link"
import { SDG_LIST } from "@/lib/constants/sdgs"

export default function SdgGrid() {
  return (
    <section className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-navy">EGA & the Global Goals</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Click any goal to learn how EGA addresses it through mentorship, community projects, and youth leadership development
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {SDG_LIST.map((sdg) => (
            <Link
              key={sdg.number}
              href={`/sdgs/${sdg.slug}`}
              className="group rounded-2xl overflow-hidden border-2 border-transparent hover:border-current transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              style={{ borderColor: "transparent" }}
            >
              {/* Color header */}
              <div
                className="h-3"
                style={{ backgroundColor: sdg.color }}
              />
              <div className="bg-white p-4 h-full">
                <div
                  className="text-4xl font-extrabold mb-1"
                  style={{ color: sdg.color }}
                >
                  {sdg.number}
                </div>
                <h3 className="font-bold text-brand-navy text-sm leading-tight mb-2">
                  {sdg.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {sdg.description.split(".")[0]}.
                </p>
                <span
                  className="inline-block mt-3 text-xs font-semibold group-hover:underline"
                  style={{ color: sdg.color }}
                >
                  EGA&apos;s Approach →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
