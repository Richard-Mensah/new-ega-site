import Link from "next/link"
import { Users, Award, GraduationCap, Globe, Briefcase, Network } from "lucide-react"

const SERVICES = [
  {
    id: "mentorship",
    icon: Users,
    title: "Mentorship Program",
    tagline: "One-on-one guidance from global leaders",
    description: "EGA's flagship mentorship program pairs each participant with an experienced mentor who provides personalized guidance, accountability, and career support throughout the program. Sessions are held regularly via virtual and in-person meetings.",
    features: ["Personalized mentor matching", "Regular 1-on-1 sessions", "Career strategy planning", "Accountability frameworks", "Session notes & feedback tracking", "Progress milestone reviews"],
    color: "border-t-brand-navy",
    iconBg: "bg-brand-navy/10",
    iconColor: "text-brand-navy",
  },
  {
    id: "leadership",
    icon: Award,
    title: "Leadership Training",
    tagline: "Structured curriculum for transformational leaders",
    description: "Our leadership curriculum is grounded in both classical and contemporary leadership theory, covering decision-making, communication, emotional intelligence, strategic planning, and team dynamics — all tailored for the next generation of global leaders.",
    features: ["2-year structured curriculum", "Public speaking & facilitation", "Strategic decision-making", "Emotional intelligence", "Team leadership", "Change management"],
    color: "border-t-brand-gold",
    iconBg: "bg-brand-gold/10",
    iconColor: "text-amber-700",
  },
  {
    id: "edu-consult",
    icon: GraduationCap,
    title: "Educational Consultancy",
    tagline: "Academic pathways to international opportunities",
    description: "EGA's Educational Consultancy service helps participants navigate scholarship applications, university placement, study abroad opportunities, and academic career planning — opening doors to world-class institutions across the globe.",
    features: ["Scholarship application support", "University placement guidance", "Study abroad planning", "Academic essay coaching", "Interview preparation", "Career pathway mapping"],
    color: "border-t-green-500",
    iconBg: "bg-green-50",
    iconColor: "text-green-700",
    cta: { label: "Explore Edu-Consult", href: "/edu-consult" },
  },
  {
    id: "sdg",
    icon: Globe,
    title: "SDG Programs",
    tagline: "Drive change across all 17 UN Goals",
    description: "Our SDG Programs ensure every participant engages meaningfully with the UN Sustainable Development Goals. Through workshops, community projects, and research initiatives, participants become credible SDG champions driving real change.",
    features: ["All 17 SDG coverage", "Community action projects", "SDG research & advocacy", "Progress tracking", "Cross-SDG project design", "SDG portfolio documentation"],
    color: "border-t-blue-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    cta: { label: "Explore SDGs", href: "/sdgs" },
  },
  {
    id: "portfolio",
    icon: Briefcase,
    title: "Portfolio Development",
    tagline: "Showcase your impact to the world",
    description: "EGA's portfolio development service helps participants build a comprehensive professional presence — from digital portfolios and published articles to project documentation and certification records that employers and institutions recognize globally.",
    features: ["Digital portfolio builder", "Article & content publishing", "Project documentation", "Skills certification", "Professional bio crafting", "LinkedIn profile optimization"],
    color: "border-t-purple-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
  },
  {
    id: "network",
    icon: Network,
    title: "Global Network",
    tagline: "Connect with leaders across 6 countries",
    description: "The EGA global network connects participants with fellow leaders, alumni, mentors, partner organizations, and employers across Africa, Europe, and North America — creating lifelong relationships that amplify impact and advance careers.",
    features: ["Alumni network access", "Cross-country collaboration", "Partner organization connections", "Employer introductions", "Annual global summits", "Online community platform"],
    color: "border-t-orange-500",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-700",
  },
]

export default function ServiceCards() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {SERVICES.map(({ id, icon: Icon, title, tagline, description, features, color, iconBg, iconColor, cta }) => (
            <div key={id} id={id} className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-t-4 ${color}`}>
              <div className="p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${iconBg}`}>
                    <Icon size={28} className={iconColor} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-brand-navy">{title}</h2>
                    <p className="text-brand-gold font-medium">{tagline}</p>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                {cta && (
                  <div className="mt-6">
                    <Link href={cta.href} className="inline-flex items-center gap-2 text-brand-navy font-semibold hover:text-brand-gold transition-colors">
                      {cta.label} →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
