import { Target, BookOpen, Users, Globe, Briefcase, Network, Heart, Star } from "lucide-react"

const PILLARS = [
  { icon: Users, title: "Mentorship", desc: "Personalized 1-on-1 guidance from global leaders" },
  { icon: BookOpen, title: "Leadership Development", desc: "Structured curriculum for transformational leadership" },
  { icon: Globe, title: "SDG Engagement", desc: "Hands-on action across all 17 UN Goals" },
  { icon: Briefcase, title: "Portfolio Building", desc: "Showcase skills and achievements globally" },
  { icon: Network, title: "Global Network", desc: "Connect with leaders across 6 countries" },
  { icon: Star, title: "Educational Consultancy", desc: "Academic guidance and scholarship access" },
  { icon: Target, title: "Career Placement", desc: "Pathways to meaningful, purpose-driven careers" },
  { icon: Heart, title: "Community Impact", desc: "Projects that transform local communities" },
]

export default function ImpactNumbers() {
  return (
    <section className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Our Impact</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-brand-navy">8 Pillars of Transformation</h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Every EGA participant benefits from our integrated approach to youth leadership development
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="inline-flex p-3 rounded-xl bg-brand-navy/5 mb-3">
                <Icon size={24} className="text-brand-navy" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm md:text-base mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
