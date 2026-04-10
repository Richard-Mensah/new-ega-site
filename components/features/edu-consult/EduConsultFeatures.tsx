import { GraduationCap, Award, Globe, BookOpen, FileText, Users } from "lucide-react"

const FEATURES = [
  {
    icon: Award,
    title: "Scholarship Application Support",
    description: "Expert guidance through the entire scholarship application process — from identifying the right opportunities to crafting compelling personal statements that win funding from prestigious foundations, governments, and institutions worldwide.",
  },
  {
    icon: GraduationCap,
    title: "University Placement",
    description: "We guide participants through selecting the right university programs, understanding admission requirements, preparing applications, and securing placements at internationally-accredited institutions across Africa, Europe, and North America.",
  },
  {
    icon: Globe,
    title: "Study Abroad Programs",
    description: "Access curated study abroad opportunities that combine international academic experience with cultural immersion. EGA helps participants identify, apply for, and succeed in transformational international learning programs.",
  },
  {
    icon: BookOpen,
    title: "Academic Essay Coaching",
    description: "Personalized coaching to help participants write compelling personal statements, academic essays, and motivational letters that effectively communicate their unique strengths, experiences, and future ambitions.",
  },
  {
    icon: FileText,
    title: "Career Pathway Planning",
    description: "Strategic academic-to-career mapping that helps participants make informed decisions about which degrees, certifications, and academic experiences best position them for their desired career paths and impact goals.",
  },
  {
    icon: Users,
    title: "Interview Preparation",
    description: "Comprehensive preparation for scholarship interviews, university admission interviews, and competitive program selection processes — including mock interviews, feedback sessions, and confidence-building coaching.",
  },
]

export default function EduConsultFeatures() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">What We Offer</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Comprehensive educational guidance at every stage of your academic journey
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-brand-gold/30 hover:shadow-md transition-all">
              <div className="p-3 bg-green-50 rounded-xl inline-flex mb-4">
                <Icon size={24} className="text-green-700" />
              </div>
              <h3 className="font-bold text-brand-navy text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
