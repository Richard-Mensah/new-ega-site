import Card from "@/components/ui/Card"
import { createClient } from "@/lib/supabase/server"
import { Calendar, Folder, Star } from "lucide-react"
import type { Tables } from "@/types/database"

type Props = { participantId: string }

export default async function ActivityFeed({ participantId }: Props) {
  const supabase = await createClient()

  const { data: sessionsRaw } = await supabase.from("sessions").select("*").eq("participant_id", participantId).order("created_at", { ascending: false }).limit(3)
  const sessions = sessionsRaw as Tables<"sessions">[] | null

  const { data: milestonesRaw } = await supabase.from("milestones").select("*").eq("participant_id", participantId).order("recorded_at", { ascending: false }).limit(2)
  const milestones = milestonesRaw as Tables<"milestones">[] | null

  type ActivityItem = {
    id: string
    icon: typeof Calendar
    label: string
    time: string
    color: string
  }

  const activities: ActivityItem[] = []

  sessions?.forEach((s) => {
    activities.push({
      id: s.id,
      icon: Calendar,
      label: `Session ${s.status}`,
      time: s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString() : "Scheduled",
      color: "text-blue-500",
    })
  })

  milestones?.forEach((m) => {
    activities.push({
      id: m.id,
      icon: Star,
      label: `Milestone: ${m.type} — ${m.score}/100`,
      time: new Date(m.recorded_at).toLocaleDateString(),
      color: "text-brand-gold",
    })
  })

  if (activities.length === 0) {
    activities.push({
      id: "start",
      icon: Folder,
      label: "Welcome to EGA! Start your first project",
      time: "Now",
      color: "text-green-500",
    })
  }

  return (
    <Card>
      <h3 className="font-bold text-brand-navy mb-4">Recent Activity</h3>
      <ul className="space-y-3">
        {activities.map(({ id, icon: Icon, label, time, color }) => (
          <li key={id} className="flex items-center gap-3">
            <div className={`${color} shrink-0`}><Icon size={16} /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">{label}</p>
              <p className="text-xs text-gray-400">{time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
