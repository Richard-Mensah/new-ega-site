import { Users, GraduationCap, GitBranch, UserCheck } from "lucide-react"

type Props = {
  totalUsers: number
  participants: number
  mentors: number
  activePairs: number
}

const cards = [
  {
    key: "totalUsers" as const,
    label: "Total Users",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    key: "participants" as const,
    label: "Participants",
    icon: UserCheck,
    color: "bg-green-50 text-green-600",
    border: "border-green-100",
  },
  {
    key: "mentors" as const,
    label: "Mentors",
    icon: GraduationCap,
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
  },
  {
    key: "activePairs" as const,
    label: "Active Pairs",
    icon: GitBranch,
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
  },
]

export default function AdminStats(props: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, border }) => (
        <div
          key={key}
          className={`bg-white rounded-2xl border ${border} p-5 flex items-center gap-4 shadow-sm`}
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{props[key]}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
