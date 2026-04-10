import Link from "next/link"
import { TEAM_MEMBERS } from "@/lib/constants/team"

export default function TeamTeaser() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Global Leaders</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-brand-navy">Meet Our Team</h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Experienced professionals across 6 countries dedicated to transforming youth leadership
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="text-center group">
              {/* Avatar placeholder */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-navy/10 border-4 border-white shadow-md mx-auto flex items-center justify-center mb-3 group-hover:border-brand-gold transition-colors">
                <span className="text-2xl font-bold text-brand-navy">
                  {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <p className="font-semibold text-brand-navy text-sm leading-tight">{member.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{member.country}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-navy/90 transition-colors"
          >
            Meet the Full Team →
          </Link>
        </div>
      </div>
    </section>
  )
}
