import { Users, Globe, Target, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  participantCount: number
  countryCount: number
  sdgCount: number
  appreciationCount: number
}

const TILES = [
  {
    key: "participantCount" as const,
    icon: Users,
    label: "Participants",
    iconClass: "text-brand-navy",
    bgClass: "bg-brand-navy/10",
  },
  {
    key: "countryCount" as const,
    icon: Globe,
    label: "Countries",
    iconClass: "text-blue-500",
    bgClass: "bg-blue-50",
  },
  {
    key: "sdgCount" as const,
    icon: Target,
    label: "SDGs Represented",
    iconClass: "text-brand-gold",
    bgClass: "bg-brand-gold/10",
  },
  {
    key: "appreciationCount" as const,
    icon: Heart,
    label: "Appreciations",
    iconClass: "text-red-400",
    bgClass: "bg-red-50",
  },
]

export default function CommunityStats({
  participantCount,
  countryCount,
  sdgCount,
  appreciationCount,
}: Props) {
  const values: Record<string, number> = {
    participantCount,
    countryCount,
    sdgCount,
    appreciationCount,
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
        {TILES.map(({ key, icon: Icon, label, iconClass, bgClass }) => (
          <div
            key={key}
            className="flex flex-col items-center justify-center gap-2 py-5 px-4 text-center"
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bgClass)}>
              <Icon size={20} className={iconClass} />
            </div>
            <span className="text-2xl font-extrabold text-brand-navy tabular-nums">
              {values[key]}
            </span>
            <span className="text-xs text-gray-400 font-medium leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
