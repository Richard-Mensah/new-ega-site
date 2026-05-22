import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PairingTable, { type PairRow } from "@/components/features/admin/PairingTable"
import type { MentorOption } from "@/components/features/admin/AssignMentorModal"

export type MentorRequestRow = {
  id: string
  participant_id: string
  participant_name: string
  participant_avatar: string | null
  participant_organization: string | null
  participant_country: string | null
  message: string
  focus_areas: string[]
  created_at: string
}

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export default async function PairingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/dashboard")

  const admin = createAdminClient()

  const [
    { data: pairs },
    { data: allProfiles },
    { data: authData },
    { data: sessions },
    { data: pairCounts },
    { data: requestsRaw },
  ] = await Promise.all([
    admin
      .from("mentorship_pairs")
      .select("id,mentor_id,participant_id,matched_at,status,notes")
      .order("matched_at", { ascending: false }),
    admin.from("profiles").select("id,role,full_name,avatar_url,organization,country"),
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from("sessions").select("mentor_id,participant_id"),
    admin.from("mentorship_pairs").select("mentor_id").eq("status", "active"),
    admin
      .from("mentor_requests")
      .select("id, participant_id, message, focus_areas, status, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
  ])

  const profileMap = new Map((allProfiles ?? []).map((p) => [p.id, p]))
  const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email ?? ""]))

  // Session count per mentor+participant pair
  const sessionCountMap = new Map<string, number>()
  ;(sessions ?? []).forEach((s) => {
    const key = `${s.mentor_id}:${s.participant_id}`
    sessionCountMap.set(key, (sessionCountMap.get(key) ?? 0) + 1)
  })

  const pairRows: PairRow[] = (pairs ?? []).map((pair) => {
    const mentor = profileMap.get(pair.mentor_id)
    const participant = profileMap.get(pair.participant_id)
    return {
      id: pair.id,
      mentor_id: pair.mentor_id,
      mentor_name: mentor?.full_name ?? "Unknown",
      mentor_avatar: mentor?.avatar_url ?? null,
      participant_id: pair.participant_id,
      participant_name: participant?.full_name ?? "Unknown",
      participant_avatar: participant?.avatar_url ?? null,
      participant_email: emailMap.get(pair.participant_id) ?? "",
      matched_at: pair.matched_at,
      status: pair.status,
      notes: pair.notes,
      sessionCount: sessionCountMap.get(`${pair.mentor_id}:${pair.participant_id}`) ?? 0,
    }
  })

  const activeMentorCount = new Map<string, number>()
  ;(pairCounts ?? []).forEach((p) => {
    activeMentorCount.set(p.mentor_id, (activeMentorCount.get(p.mentor_id) ?? 0) + 1)
  })

  const mentors: MentorOption[] = (allProfiles ?? [])
    .filter((p) => p.role === "mentor")
    .map((m) => ({
      id: m.id,
      full_name: m.full_name,
      avatar_url: m.avatar_url,
      organization: m.organization,
      country: m.country,
      activeParticipants: activeMentorCount.get(m.id) ?? 0,
    }))

  const allParticipants = (allProfiles ?? [])
    .filter((p) => p.role === "participant")
    .map((p) => ({
      id: p.id,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      organization: p.organization,
      country: p.country,
    }))

  const activePairs = pairRows.filter((p) => p.status === "active").length

  const pendingRequests: MentorRequestRow[] = (requestsRaw ?? []).map((r) => {
    const p = profileMap.get(r.participant_id)
    return {
      id: r.id,
      participant_id: r.participant_id,
      participant_name: p?.full_name ?? "Unknown",
      participant_avatar: p?.avatar_url ?? null,
      participant_organization: p?.organization ?? null,
      participant_country: p?.country ?? null,
      message: r.message,
      focus_areas: r.focus_areas ?? [],
      created_at: r.created_at,
    }
  })

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        {pairRows.length} total pairings · {activePairs} active
        {pendingRequests.length > 0 && (
          <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-medium">
            · {pendingRequests.length} mentor request{pendingRequests.length !== 1 ? "s" : ""} pending
          </span>
        )}
      </p>
      <PairingTable pairs={pairRows} mentors={mentors} allParticipants={allParticipants} pendingRequests={pendingRequests} />
    </div>
  )
}
