import Card from "@/components/ui/Card"
import { Users, TrendingUp, Calendar, Globe } from "lucide-react"

type Props = {
  totalMentees: number
  avgGrowth: number
  sessionsHeld: number
  avgSdgCoverage: number
}

export default function KpiCards({ totalMentees, avgGrowth, sessionsHeld, avgSdgCoverage }: Props) {
  const cards = [
    {
      icon: Users,
      label: "Total Mentees",
      value: String(totalMentees),
      sub: "Active participants",
      accent: "gold" as const,
    },
    {
      icon: TrendingUp,
      label: "Avg Growth",
      value: `${avgGrowth}%`,
      sub: "Skill improvement",
      accent: "green" as const,
    },
    {
      icon: Calendar,
      label: "Sessions Held",
      value: String(sessionsHeld),
      sub: "Completed sessions",
      accent: "blue" as const,
    },
    {
      icon: Globe,
      label: "Avg SDG Coverage",
      value: `${avgSdgCoverage}/17`,
      sub: "Goals engaged",
      accent: "navy" as const,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ icon: Icon, label, value, sub, accent }) => (
        <Card key={label} accent={accent}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            <Icon size={16} className="text-gray-400" />
          </div>
          <div className="text-2xl font-extrabold text-brand-navy">{value}</div>
          <div className="text-xs text-gray-400 mt-1">{sub}</div>
        </Card>
      ))}
    </div>
  )
}
