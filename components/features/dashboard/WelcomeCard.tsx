import Link from "next/link"
import { Calendar, AlertCircle } from "lucide-react"
import ProfileAvatar from "@/components/ui/ProfileAvatar"

type Props = {
  name: string
  role: string
  country: string | null
  organization: string | null
  avatarUrl: string | null
  daysInProgram: number
  profileCompletion: number
}

export default function WelcomeCard({
  name,
  role,
  country,
  organization,
  avatarUrl,
  daysInProgram,
  profileCompletion,
}: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const meta = [role.charAt(0).toUpperCase() + role.slice(1), country, "EGA Mentorship Program"]
    .filter(Boolean)
    .join(" · ")

  return (
    <div className="bg-brand-navy rounded-2xl p-6 text-white border-l-4 border-brand-gold space-y-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: avatar + name */}
        <div className="flex items-center gap-4 min-w-0">
          <ProfileAvatar
            avatarUrl={avatarUrl}
            fullName={name}
            size="lg"
            className="border-2 border-brand-gold"
          />
          <div className="min-w-0">
            <p className="text-white/60 text-xs">{greeting}</p>
            <h1 className="text-xl font-bold mt-0.5 truncate">{name} 👋</h1>
            {organization && (
              <p className="text-brand-gold text-xs font-semibold mt-0.5 truncate">{organization}</p>
            )}
            <p className="text-white/50 text-xs mt-0.5 truncate">{meta}</p>
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
