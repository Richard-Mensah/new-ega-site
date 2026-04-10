import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { Users, Calendar, BarChart2, MapPin } from "lucide-react"
import Link from "next/link"
import type { Tables } from "@/types/database"

export default async function MentorOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const profile = profileRaw as { full_name: string; role: string } | null

  if (profile?.role !== "mentor") redirect("/dashboard")

  const { data: pairsRaw } = await supabase
    .from("mentorship_pairs")
    .select("participant_id, profiles!participant_id(full_name, country)")
    .eq("mentor_id", user.id)
    .eq("status", "active")
  type MenteePair = { participant_id: string; profiles: { full_name: string; country: string | null } | null }
  const pairs = pairsRaw as MenteePair[] | null

  const { data: sessionsRaw } = await supabase.from("sessions").select("*").eq("mentor_id", user.id).order("scheduled_at", { ascending: false }).limit(5)
  const sessions = sessionsRaw as Tables<"sessions">[] | null

  const totalMentees = pairs?.length ?? 0
  const completedSessions = sessions?.filter((s) => s.status === "completed").length ?? 0
  const upcomingSessions = sessions?.filter((s) => s.status === "scheduled").length ?? 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-brand-navy rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <p className="text-white/60 text-sm">Mentor Dashboard</p>
          <h1 className="text-2xl font-bold mt-0.5">{profile?.full_name} 👋</h1>
          <p className="text-white/70 text-sm mt-1">Shaping the next generation of global leaders</p>
        </div>
        <Link href="/mentor/analytics" className="hidden sm:flex items-center gap-2 bg-brand-gold text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors">
          <BarChart2 size={16} />
          View Analytics
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card accent="gold">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Total Mentees</span>
            <Users size={16} className="text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-navy">{totalMentees}</div>
          <div className="text-xs text-gray-400 mt-1">Active participants</div>
        </Card>
        <Card accent="green">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Sessions Held</span>
            <Calendar size={16} className="text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-navy">{completedSessions}</div>
          <div className="text-xs text-gray-400 mt-1">Completed sessions</div>
        </Card>
        <Card accent="blue">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Upcoming</span>
            <Calendar size={16} className="text-gray-400" />
          </div>
          <div className="text-3xl font-extrabold text-brand-navy">{upcomingSessions}</div>
          <div className="text-xs text-gray-400 mt-1">Scheduled sessions</div>
        </Card>
      </div>

      {/* Mentee list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-navy">My Mentees</h2>
          <Link href="/mentor/mentees" className="text-sm text-brand-gold font-semibold hover:underline">
            View all →
          </Link>
        </div>
        {!pairs || pairs.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-400">
              <Users size={32} className="mx-auto mb-2" />
              <p className="text-sm">No mentees assigned yet</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pairs.map((pair) => {
              const p = pair.profiles as { full_name: string; country: string | null } | null
              return (
                <Card key={pair.participant_id}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-navy/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-brand-navy text-sm">
                        {p?.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-brand-navy">{p?.full_name}</p>
                      {p?.country && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={10} />
                          <span>{p.country}</span>
                        </div>
                      )}
                    </div>
                    <Badge label="Active" color="green" />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
