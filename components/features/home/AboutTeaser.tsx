import Link from "next/link"
import { CheckCircle } from "lucide-react"

const HIGHLIGHTS = [
  "Operating across Ghana, USA, Serbia, Zambia, Zimbabwe & Liberia",
  "Structured 2-year leadership curriculum aligned with UN SDGs",
  "One-on-one mentorship with experienced global leaders",
  "Digital portfolio building for career advancement",
]

export default function AboutTeaser() {
  return (
    <section className="py-20 bg-brand-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="space-y-6">
            <div>
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">About EGA</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-brand-navy leading-tight">
                Our Mission is to Empower 10,000 Youth Leaders
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              EGA Mentorship International is a global youth development NGO dedicated to equipping the next generation of leaders with the skills, mindsets, and networks needed to drive sustainable change across all 17 UN Sustainable Development Goals.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Founded on the belief that every young person deserves access to world-class mentorship, EGA bridges the gap between potential and opportunity — empowering youth aged 18–30 to build meaningful careers and lasting community impact.
            </p>

            <ul className="space-y-3">
              {HIGHLIGHTS.map((h) => (
                <li key={h} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle size={20} className="text-brand-gold mt-0.5 shrink-0" />
                  <span className="text-sm">{h}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-brand-navy font-semibold hover:text-brand-gold transition-colors"
            >
              Learn More About EGA →
            </Link>
          </div>

          {/* Vision card */}
          <div className="bg-brand-navy rounded-2xl p-8 text-white space-y-6">
            <h3 className="text-xl font-bold text-brand-gold">Our Vision</h3>
            <p className="text-white/80 leading-relaxed">
              A world where every young person, regardless of background or geography, has access to transformational mentorship and the opportunity to become a leader who drives positive, sustainable change.
            </p>
            <div className="border-t border-white/20 pt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-extrabold text-brand-gold">2020</div>
                <div className="text-sm text-white/60 mt-1">Year Founded</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-brand-gold">6</div>
                <div className="text-sm text-white/60 mt-1">Countries</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-brand-gold">17</div>
                <div className="text-sm text-white/60 mt-1">SDGs Addressed</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-brand-gold">100%</div>
                <div className="text-sm text-white/60 mt-1">Committed to Youth</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
