import { MapPin } from "lucide-react"
import { TEAM_MEMBERS } from "@/lib/constants/team"

export default function TeamGrid() {
  return (
    <section className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
            >
              {/* Avatar */}
              <div className="bg-brand-navy h-32 flex items-end justify-center pb-0 relative">
                <div className="w-24 h-24 rounded-full bg-brand-gold/20 border-4 border-white flex items-center justify-center absolute -bottom-12 shadow-lg">
                  <span className="text-3xl font-extrabold text-brand-navy">
                    {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
              </div>

              <div className="pt-14 pb-6 px-6 text-center">
                <h3 className="text-xl font-bold text-brand-navy">{member.name}</h3>
                <p className="text-brand-gold font-medium text-sm mt-0.5">{member.role}</p>
                <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
                  <MapPin size={12} />
                  <span>{member.country}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mt-4">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Join team CTA */}
        <div className="mt-16 bg-brand-navy rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold text-brand-gold mb-4">Join Our Growing Team</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-6">
            EGA is always looking for passionate professionals who want to invest in the next generation of global leaders. If you have expertise in leadership development, education, or youth empowerment, we&apos;d love to hear from you.
          </p>
          <a href="/contact" className="inline-block bg-brand-gold text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}
