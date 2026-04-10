import { MapPin, TrendingUp } from "lucide-react"

type MenteeCard = {
  id: string
  name: string
  country: string | null
  growthPct: number
  leadership: number
  sdgEngagement: number
  projects: number
}

type Props = { mentees: MenteeCard[] }

function SkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function MenteeCardGrid({ mentees }: Props) {
  if (mentees.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No mentee data available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mentees.map((mentee) => (
        <div key={mentee.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-brand-navy/10 border-2 border-brand-gold/30 flex items-center justify-center shrink-0">
              <span className="font-bold text-brand-navy text-sm">
                {mentee.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-brand-navy truncate">{mentee.name}</p>
              {mentee.country && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={10} />
                  <span>{mentee.country}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              <TrendingUp size={10} />
              <span>+{mentee.growthPct}%</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <SkillBar label="Leadership" value={mentee.leadership} color="#C9A84C" />
            <SkillBar label="SDG Engagement" value={mentee.sdgEngagement} color="#0D1B4B" />
            <SkillBar label="Projects" value={mentee.projects} color="#16A34A" />
          </div>
        </div>
      ))}
    </div>
  )
}
