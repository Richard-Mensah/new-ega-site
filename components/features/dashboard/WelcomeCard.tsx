import Link from "next/link"
import { Calendar, AlertCircle } from "lucide-react"

type Props = {
  name: string
  role: string
  country: string | null
  avatarUrl: string | null
  daysInProgram: number
  profileCompletion: number
}

export default function WelcomeCard({
  name,
  role,
  country,
  avatarUrl,
  daysInProgram,
  profileCompletion,
}: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const location = [role.charAt(0).toUpperCase() + role.slice(1), country, "EGA Mentorship Program"]
    .filter(Boolean)
    .join(" · ")

  return (
    <div className="bg-brand-navy rounded-2xl p-6 text-white border-l-4 border-brand-gold space-y-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: avatar + name */}
        <div className="flex items-center gap-4 min-w-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-brand-gold shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-brand-gold/20 border-2 border-brand-gold flex items-center justify-center shrink-0">
              <span className="text-brand-gold text-xl font-bold">{initials}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white/60 text-xs">{greeting}</p>
            <h1 className="text-xl font-bold mt-0.5 truncate">{name} 👋</h1>
            <p className="text-white/60 text-xs mt-0.5 truncate">{location}</p>
          </div>
        </div>

        {/* Right: day counter */}
        <div className="text-right shrink-0 hidden sm:block">
          <div className="flex items-center gap-2 text-brand-gold justify-end">
            <Calendar size={15} />
            <span className="text-sm font-semibold">Day {daysInProgram}</span>
          </div>
          <p className="text-white/50 text-xs mt-1">of Program</p>
        </div>
      </div>

      {/* Profile completion nudge */}
      {profileCompletion < 100 && (
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 transition-colors group"
        >
          <AlertCircle size={14} className="text-brand-gold shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs text-white/70">
                Profile{" "}
                <span className="font-semibold text-white">{profileCompletion}% complete</span>
              </p>
              <span className="text-xs text-brand-gold group-hover:underline">
                Complete it →
              </span>
            </div>
            <div className="h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-brand-gold rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
