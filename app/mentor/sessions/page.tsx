import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Calendar, MessageCircle } from "lucide-react"
import type { Tables } from "@/types/database"

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: sessionsRaw } = await supabase
    .from("sessions")
    .select("*, profiles!participant_id(full_name)")
    .eq("mentor_id", user.id)
    .order("scheduled_at", { ascending: false })
    .limit(20)
  type SessionWithProfile = Tables<"sessions"> & { profiles: { full_name: string } | null }
  const sessions = sessionsRaw as SessionWithProfile[] | null

  const upcoming = sessions?.filter((s) => s.status === "scheduled") ?? []
  const past = sessions?.filter((s) => s.status !== "scheduled") ?? []

  function SessionRow({ s }: { s: SessionWithProfile }) {
    const participant = s.profiles
    return (
      <div className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
        <div className="p-2.5 bg-brand-navy/5 rounded-xl shrink-0">
          <Calendar size={16} className="text-brand-navy" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-brand-navy text-sm">{participant?.full_name ?? "Unknown"}</p>
          <p className="text-xs text-gray-400">
            {s.scheduled_at
              ? new Date(s.scheduled_at).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })
              : "Date TBD"}
          </p>
          {s.notes && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <MessageCircle size={10} />
              <span className="truncate">{s.notes}</span>
            </div>
          )}
        </div>
        <Badge
          label={s.status}
          color={s.status === "completed" ? "green" : s.status === "cancelled" ? "red" : "blue"}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Sessions</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and review your mentorship sessions</p>
      </div>

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-brand-navy mb-3">Upcoming Sessions</h2>
          <div className="space-y-3">
            {upcoming.map((s) => <SessionRow key={s.id} s={s} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-3">Session History</h2>
        {past.length === 0 ? (
          <Card>
            <div className="text-center py-10 text-gray-400">
              <Calendar size={32} className="mx-auto mb-2" />
              <p className="text-sm">No completed sessions yet</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {past.map((s) => <SessionRow key={s.id} s={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}
