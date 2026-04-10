import { Globe, Folder, Video } from "lucide-react"
import Card from "@/components/ui/Card"

type Props = {
  sdgCount: number
  activeProjects: number
  completedSessions: number
}

export default function MetricCards({ sdgCount, activeProjects, completedSessions }: Props) {
  const metrics = [
    {
      icon: Globe,
      label: "SDG Progress",
      value: `${sdgCount} / 17`,
      sub: "Goals engaged",
      accent: "gold" as const,
    },
    {
      icon: Folder,
      label: "Active Projects",
      value: String(activeProjects),
      sub: "In progress",
      accent: "navy" as const,
    },
    {
      icon: Video,
      label: "Sessions Completed",
      value: String(completedSessions),
      sub: "With your mentor",
      accent: "green" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map(({ icon: Icon, label, value, sub, accent }) => (
        <Card key={label} accent={accent}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <Icon size={18} className="text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-navy">{value}</div>
          <div className="text-xs text-gray-400 mt-1">{sub}</div>
        </Card>
      ))}
    </div>
  )
}
