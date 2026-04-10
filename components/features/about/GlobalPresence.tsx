import { MapPin } from "lucide-react"

const COUNTRIES = [
  { name: "Ghana", city: "Accra (HQ)", flag: "🇬🇭", role: "Headquarters & Program Hub" },
  { name: "USA", city: "Various Cities", flag: "🇺🇸", role: "Mentor Network & Partnerships" },
  { name: "Serbia", city: "Belgrade", flag: "🇷🇸", role: "European Outreach & Partnerships" },
  { name: "Zambia", city: "Lusaka", flag: "🇿🇲", role: "Southern Africa Program Center" },
  { name: "Zimbabwe", city: "Harare", flag: "🇿🇼", role: "Southern Africa SDG Programs" },
  { name: "Liberia", city: "Monrovia", flag: "🇱🇷", role: "West Africa Expansion Hub" },
]

export default function GlobalPresence() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Global Reach</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-brand-navy">Operating Across 6 Countries</h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            From our headquarters in Accra, Ghana, EGA&apos;s impact stretches across Africa, Europe, and North America
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COUNTRIES.map((country) => (
            <div
              key={country.name}
              className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 hover:border-brand-gold/30 hover:shadow-md transition-all"
            >
              <span className="text-4xl">{country.flag}</span>
              <div>
                <h3 className="font-bold text-brand-navy text-lg">{country.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                  <MapPin size={12} />
                  <span>{country.city}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{country.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-brand-navy rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Expanding to 20+ Countries by 2030</h3>
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
            EGA&apos;s growth roadmap includes expanding to 20+ countries across Africa, Asia, Latin America, and beyond, ensuring that world-class youth mentorship is accessible everywhere young leaders exist.
          </p>
        </div>
      </div>
    </section>
  )
}
