import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import ParticipantTable from "@/components/features/admin/ParticipantTable"
import type { Tables } from "@/types/database"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/dashboard")

  const needsSetup = !process.env.SUPABASE_SERVICE_ROLE_KEY

  type ParticipantRow = Tables<"profiles"> & { email: string; isDuplicate: boolean }
  let participants: ParticipantRow[] = []

  if (!needsSetup) {
    const admin = createAdminClient()
    const [{ data: profiles }, { data: authData }] = await Promise.all([
      admin.from("profiles").select("*").order("full_name"),
      admin.auth.admin.listUsers({ perPage: 1000 }),
    ])

    const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email ?? ""]))

    const nameCounts = new Map<string, number>()
    ;(profiles ?? []).forEach((p) => {
      const key = p.full_name.toLowerCase().trim()
      nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1)
    })

    participants = (profiles ?? []).map((p) => ({
      ...p,
      email: emailMap.get(p.id) ?? "",
      isDuplicate: (nameCounts.get(p.full_name.toLowerCase().trim()) ?? 0) > 1,
    }))
  }

  const duplicateCount = participants.filter((p) => p.isDuplicate).length

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Participant Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {participants.length} registered users
          {duplicateCount > 0 && (
            <span className="ml-2 text-amber-600 font-semibold">· {duplicateCount} in duplicate groups</span>
          )}
        </p>
      </div>

      {needsSetup ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-xl">
          <h2 className="font-bold text-amber-800 mb-2">One-time setup required</h2>
          <p className="text-amber-700 text-sm mb-3">
            Add your Supabase service role key to <code className="bg-amber-100 px-1 rounded font-mono">.env.local</code> to enable participant management:
          </p>
          <pre className="bg-amber-100 text-amber-800 text-xs rounded-lg p-3 font-mono whitespace-pre-wrap">
            SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
          </pre>
          <p className="text-amber-600 text-xs mt-3">
            Find it in: <strong>Supabase Dashboard → Settings → API → service_role key</strong>
          </p>
        </div>
      ) : (
        <ParticipantTable participants={participants} />
      )}
    </div>
  )
}
