import { MapPin, Phone, Mail, Clock } from "lucide-react"

const INFO = [
  { icon: MapPin, label: "Address", value: "East Legon, Accra, Ghana" },
  { icon: Phone, label: "Phone", value: "+233 000 000 000", href: "tel:+233000000000" },
  { icon: Mail, label: "Email", value: "info@egamentorship.org", href: "mailto:info@egamentorship.org" },
  { icon: Clock, label: "Office Hours", value: "Mon–Fri, 9AM–5PM GMT" },
]

const COUNTRIES = ["🇬🇭 Ghana (HQ)", "🇺🇸 USA", "🇷🇸 Serbia", "🇿🇲 Zambia", "🇿🇼 Zimbabwe", "🇱🇷 Liberia"]

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-brand-navy mb-4">Contact Details</h2>
        <div className="space-y-4">
          {INFO.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="p-2 bg-brand-navy/5 rounded-lg shrink-0">
                <Icon size={16} className="text-brand-navy" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                {href ? (
                  <a href={href} className="text-sm text-brand-navy font-semibold hover:text-brand-gold transition-colors">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm text-brand-navy font-semibold">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-navy rounded-2xl p-6 text-white">
        <h3 className="font-bold text-brand-gold mb-4">Operating Countries</h3>
        <div className="space-y-2">
          {COUNTRIES.map((c) => (
            <div key={c} className="text-sm text-white/80">{c}</div>
          ))}
        </div>
      </div>

      <div className="bg-brand-warm rounded-2xl p-6 border border-brand-gold/20">
        <h3 className="font-bold text-brand-navy mb-2">Quick Links</h3>
        <div className="space-y-1">
          {[
            { href: "/register", label: "Apply to EGA" },
            { href: "/programs", label: "View Programs" },
            { href: "/edu-consult", label: "Educational Consultancy" },
            { href: "/sdgs", label: "Our SDG Work" },
          ].map(({ href, label }) => (
            <a key={href} href={href} className="block text-sm text-brand-navy hover:text-brand-gold transition-colors">
              → {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
