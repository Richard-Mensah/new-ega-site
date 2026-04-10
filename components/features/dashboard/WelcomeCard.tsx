import { Calendar } from "lucide-react"

type Props = {
  name: string
  role: string
  daysInProgram: number
}

export default function WelcomeCard({ name, role, daysInProgram }: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="bg-brand-navy rounded-2xl p-6 text-white border-l-4 border-brand-gold flex items-center justify-between">
      <div>
        <p className="text-white/60 text-sm">{greeting}</p>
        <h1 className="text-2xl font-bold mt-0.5">{name} 👋</h1>
        <p className="text-white/70 text-sm mt-1 capitalize">{role} · EGA Mentorship Program</p>
      </div>
      <div className="text-right hidden sm:block">
        <div className="flex items-center gap-2 text-brand-gold">
          <Calendar size={16} />
          <span className="text-sm font-medium">Day {daysInProgram} of Program</span>
        </div>
        <p className="text-white/50 text-xs mt-1">Keep up the great work!</p>
      </div>
    </div>
  )
}
