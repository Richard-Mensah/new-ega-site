import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import MentorTable from "@/components/features/admin/MentorTable"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export default async function MentorsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/dashboard")

  const admin = createAdminClient()

  const [
    { data: mentorProfiles },
    { data: authData },
    { data: pairs },
    { data: participantProfiles },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select("id,role,full_name,country,avatar_url,organization,bio,linkedin_url,last_seen_at,created_at")
      .eq("role", "mentor")
      .order("full_name"),
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin
      .from("mentorship_pairs")
      .select("mentor_id,participant_id")
      .eq("status", "active"),
    admin
      .from("profiles")
      .select("id,full_name,avatar_url,country")
      .eq("role", "participant"),
  ])

  const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email ?? ""]))
  const participantMap = new Map((participantProfiles ?? []).map((p) => [p.id, p]))

  // Group active participants per mentor
  const participantsByMentor = new Map<string, Array<{ id: string; full_name: string; avatar_url: string | null; country: string | null }>>()
  ;(pairs ?? []).forEach((pair) => {
    const existing = participantsByMentor.get(pair.mentor_id) ?? []
    const pInfo = participantMap.get(pair.participant_id)
    if (pInfo) {
      existing.push({ id: pInfo.id, full_name: pInfo.full_name, avatar_url: pInfo.avatar_url, country: pInfo.country })
    }
    participantsByMentor.set(pair.mentor_id, existing)
  })

  const mentors = (mentorProfiles ?? []).map((m) => ({
    ...m,
    email: emailMap.get(m.id) ?? "",
    isDuplicate: false,
    activeParticipants: participantsByMentor.get(m.id) ?? [],
  }))

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">{mentors.length} mentors registered</p>
      <MentorTable mentors={mentors} />
    </div>
  )
}
