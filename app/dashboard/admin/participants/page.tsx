import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ParticipantTable from "@/components/features/admin/ParticipantTable"
import type { MentorOption } from "@/components/features/admin/AssignMentorModal"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export default async function ParticipantsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/dashboard")

  const admin = createAdminClient()

  const [
    { data: profiles },
    { data: authData },
    { data: pairs },
    { data: mentorProfiles },
    { data: pairCounts },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select("id,role,full_name,country,avatar_url,organization,bio,linkedin_url,last_seen_at,created_at")
      .eq("role", "participant")
      .order("full_name"),
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin
      .from("mentorship_pairs")
      .select("mentor_id,participant_id")
      .eq("status", "active"),
    admin
      .from("profiles")
      .select("id,full_name,avatar_url,organization,country")
      .eq("role", "mentor")
      .order("full_name"),
    admin
      .from("mentorship_pairs")
      .select("mentor_id")
      .eq("status", "active"),
  ])

  const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email ?? ""]))

  // Build mentor id → name map from fetched mentor profiles
  const mentorNameMap = new Map((mentorProfiles ?? []).map((m) => [m.id, m.full_name]))

  // Map participant_id → mentor info from active pairs
  const mentorByParticipant = new Map<string, { id: string; name: string }>()
  ;(pairs ?? []).forEach((pair) => {
    mentorByParticipant.set(pair.participant_id, {
      id: pair.mentor_id,
      name: mentorNameMap.get(pair.mentor_id) ?? "Unknown",
    })
  })

  // Mentor active participant count
  const activeMentorCount = new Map<string, number>()
  ;(pairCounts ?? []).forEach((p) => {
    const c = activeMentorCount.get(p.mentor_id) ?? 0
    activeMentorCount.set(p.mentor_id, c + 1)
  })

  // Duplicate detection by full_name
  const nameCounts = new Map<string, number>()
  ;(profiles ?? []).forEach((p) => {
    const key = p.full_name.toLowerCase().trim()
    nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1)
  })

  const participants = (profiles ?? []).map((p) => {
    const mentorInfo = mentorByParticipant.get(p.id)
    return {
      ...p,
      email: emailMap.get(p.id) ?? "",
      isDuplicate: (nameCounts.get(p.full_name.toLowerCase().trim()) ?? 0) > 1,
      mentorId: mentorInfo?.id ?? null,
      mentorName: mentorInfo?.name ?? null,
    }
  })

  const mentors: MentorOption[] = (mentorProfiles ?? []).map((m) => ({
    id: m.id,
    full_name: m.full_name,
    avatar_url: m.avatar_url,
    organization: m.organization,
    country: m.country,
    activeParticipants: activeMentorCount.get(m.id) ?? 0,
  }))

  const duplicateCount = participants.filter((p) => p.isDuplicate).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            {participants.length} participants
            {duplicateCount > 0 && (
              <span className="ml-2 text-amber-600 font-semibold">
                · {duplicateCount} duplicate group{duplicateCount !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      </div>
      <ParticipantTable participants={participants} mentors={mentors} />
    </div>
  )
}
