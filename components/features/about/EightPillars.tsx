import { Users, BookOpen, Globe, Briefcase, Network, GraduationCap, Target, Heart } from "lucide-react"

const PILLARS = [
  {
    icon: Users,
    number: "01",
    title: "Mentorship",
    description: "One-on-one guidance pairing participants with experienced professionals who provide personalized support, accountability, and strategic career advice throughout the program.",
  },
  {
    icon: BookOpen,
    number: "02",
    title: "Leadership Development",
    description: "A structured 2-year curriculum covering decision-making, public speaking, strategic thinking, conflict resolution, and transformational leadership theory.",
  },
  {
    icon: Globe,
    number: "03",
    title: "SDG Engagement",
    description: "Deep engagement with all 17 UN Sustainable Development Goals through workshops, community projects, research, and advocacy, ensuring participants become SDG champions.",
  },
  {
    icon: Briefcase,
    number: "04",
    title: "Portfolio Building",
    description: "Participants build a professional digital portfolio showcasing projects, publications, skills, and certifications that demonstrate their impact to employers and institutions worldwide.",
  },
  {
    icon: Network,
    number: "05",
    title: "Global Network",
    description: "Access to a growing community of youth leaders, alumni, mentors, and partner organizations spanning 6+ countries, creating lifelong connections and collaboration opportunities.",
  },
  {
    icon: GraduationCap,
    number: "06",
    title: "Educational Consultancy",
    description: "Expert guidance on scholarship applications, university placement, study abroad programs, and academic pathway planning for participants seeking international educational opportunities.",
  },
  {
    icon: Target,
    number: "07",
    title: "Career Placement",
    description: "Structured career development support connecting graduates with meaningful employment, fellowships, and entrepreneurship opportunities aligned with their skills and passions.",
  },
  {
    icon: Heart,
    number: "08",
    title: "Community Impact",
    description: "Every participant designs and executes at least one community-level project, creating tangible, measurable change in their local environment as part of their EGA journey.",
  },
]

export default function EightPillars() {
  return (
    <section className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Our Framework</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-brand-navy">8 Pillars of Impact</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            EGA&apos;s integrated approach ensures holistic development across every dimension of leadership
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map(({ icon: Icon, number, title, description }) => (
            <div key={title} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-extrabold text-gray-100">{number}</span>
                <div className="p-2 bg-brand-navy/5 rounded-lg">
                  <Icon size={20} className="text-brand-navy" />
                </div>
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
