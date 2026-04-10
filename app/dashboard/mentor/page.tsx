import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { MapPin, Calendar, MessageCircle } from "lucide-react"
import type { Tables } from "@/types/database"

export default async function MentorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: pairRaw } = await supabase
    .from("mentorship_pairs")
    .select("*, profiles!mentor_id(full_name, country, bio, avatar_url)")
    .eq("participant_id", user.id)
    .eq("status", "active")
    .single()
  type MentorProfile = { full_name: string; country: string | null; bio: string | null; avatar_url: string | null }
  const pair = pairRaw as { profiles: MentorProfile | null } | null

  const { data: sessionsRaw } = await supabase
    .from("sessions")
    .select("*")
    .eq("participant_id", user.id)
    .order("scheduled_at", { ascending: false })
    .limit(5)
  const sessions = sessionsRaw as Tables<"sessions">[] | null

  const mentor = pair?.profiles ?? null

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">My Mentor</h1>
        <p className="text-gray-500 text-sm mt-1">Your personal guide on the EGA journey</p>
      </div>

      {!mentor ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">👤</div>
            <p className="font-medium text-brand-navy">Mentor assignment in progress</p>
            <p className="text-sm text-gray-500 mt-2">
              Our team is carefully matching you with the right mentor. You&apos;ll be notified once matched.
            </p>
          </div>
        </Card>
      ) : (
        <Card accent="gold">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-brand-navy/10 border-4 border-brand-gold flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-brand-navy">
                {mentor.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-brand-navy">{mentor.full_name}</h2>
              {mentor.country && (
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                  <MapPin size={14} />
                  <span>{mentor.country}</span>
                </div>
              )}
              <Badge label="Active Mentor" color="green" size="md" />
              {mentor.bio && <p className="text-gray-600 text-sm leading-relaxed mt-3">{mentor.bio}</p>}
            </div>
          </div>
        </Card>
      )}

      {/* Session History */}
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-4">Session History</h2>
        {!sessions || sessions.length === 0 ? (
          <Card>
            <div className="text-center py-8 text-gray-400">
              <Calendar size={32} className="mx-auto mb-2" />
              <p className="text-sm">No sessions recorded yet</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
                <div className="p-2 bg-brand-navy/5 rounded-lg">
                  <Calendar size={16} className="text-brand-navy" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brand-navy text-sm">
                    {s.scheduled_at ? new Date(s.scheduled_at).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "Session"}
                  </p>
                  {s.notes && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{s.notes}</p>}
                </div>
                <Badge label={s.status} color={s.status === "completed" ? "green" : s.status === "cancelled" ? "red" : "blue"} />
              </div>
            ))}
          </div>
        )}
      </div>

      {mentor && (
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={18} className="text-brand-gold" />
            <h3 className="font-bold text-brand-navy">Feedback Log</h3>
          </div>
          <p className="text-sm text-gray-500">Session notes and mentor feedback will appear here after each session.</p>
        </Card>
      )}
    </div>
  )
}
