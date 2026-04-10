import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { MapPin, Folder, Calendar } from "lucide-react"

export default async function MenteesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: pairsRaw } = await supabase
    .from("mentorship_pairs")
    .select("participant_id, matched_at, profiles!participant_id(full_name, country, bio, created_at)")
    .eq("mentor_id", user.id)
    .eq("status", "active")
  type MenteePairFull = { participant_id: string; matched_at: string; profiles: { full_name: string; country: string | null; bio: string | null; created_at: string } | null }
  const pairs = pairsRaw as MenteePairFull[] | null

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">My Mentees</h1>
        <p className="text-gray-500 text-sm mt-1">{pairs?.length ?? 0} active mentees in your cohort</p>
      </div>

      {!pairs || pairs.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No mentees assigned yet</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {pairs.map((pair) => {
            const p = pair.profiles as { full_name: string; country: string | null; bio: string | null; created_at: string } | null
            const daysInProgram = p?.created_at
              ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
              : 0

            return (
              <Card key={pair.participant_id}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-brand-navy/10 border-2 border-brand-gold/30 flex items-center justify-center shrink-0">
                    <span className="font-bold text-brand-navy">
                      {p?.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-brand-navy">{p?.full_name}</h3>
                      <Badge label="Active" color="green" />
                    </div>
                    {p?.country && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin size={10} />
                        <span>{p.country}</span>
                      </div>
                    )}
                    {p?.bio && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{p.bio}</p>}
                    <div className="flex gap-4 mt-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>Day {daysInProgram} of program</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Folder size={12} />
                        <span>Matched {new Date(pair.matched_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
