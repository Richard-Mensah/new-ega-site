import Link from "next/link"
import { Users, Award, GraduationCap, Globe, Briefcase, Network } from "lucide-react"

const SERVICES = [
  {
    icon: Users,
    title: "Mentorship Program",
    description: "One-on-one and group mentorship sessions with experienced global leaders who guide participants through their personal and professional development journey.",
    href: "/services#mentorship",
    color: "text-brand-navy",
    bg: "bg-brand-navy/5",
  },
  {
    icon: Award,
    title: "Leadership Training",
    description: "Structured leadership curriculum covering decision-making, public speaking, team building, and strategic thinking aligned with international standards.",
    href: "/services#leadership",
    color: "text-brand-gold",
    bg: "bg-brand-gold/5",
  },
  {
    icon: GraduationCap,
    title: "Educational Consultancy",
    description: "Expert academic guidance for scholarship applications, university placement, study abroad opportunities, and career pathway planning.",
    href: "/edu-consult",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Globe,
    title: "SDG Programs",
    description: "Hands-on engagement with all 17 UN Sustainable Development Goals through projects, workshops, and community-level impact initiatives.",
    href: "/sdgs",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Briefcase,
    title: "Portfolio Development",
    description: "Build a professional digital portfolio showcasing projects, skills, certifications, and achievements that open doors to global opportunities.",
    href: "/services#portfolio",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Network,
    title: "Global Network",
    description: "Join a growing community of 10,000+ youth leaders across 6 countries, creating lasting connections that advance careers and multiply impact.",
    href: "/services#network",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
]

export default function ServicesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive programs designed to transform youth potential into global leadership impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <Link
                key={service.title}
                href={service.href}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-brand-gold/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${service.bg} mb-4`}>
                  <Icon size={24} className={service.color} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
