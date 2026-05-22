import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminStats from "@/components/features/admin/AdminStats"
import ProfileAvatar from "@/components/ui/ProfileAvatar"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export default async function AdminOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/dashboard")

  const needsSetup = !process.env.SUPABASE_SERVICE_ROLE_KEY

  if (needsSetup) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-xl">
        <h2 className="font-bold text-amber-800 mb-2">One-time setup required</h2>
        <p className="text-amber-700 text-sm mb-3">
          Add your Supabase service role key to{" "}
          <code className="bg-amber-100 px-1 rounded font-mono">.env.local</code> to enable participant management:
        </p>
        <pre className="bg-amber-100 text-amber-800 text-xs rounded-lg p-3 font-mono whitespace-pre-wrap">
          SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
        </pre>
        <p className="text-amber-600 text-xs mt-3">
          Find it in: <strong>Supabase Dashboard → Settings → API → service_role key</strong>
        </p>
      </div>
    )
  }

  const admin = createAdminClient()

  const [
    { data: profiles },
    { data: pairsData },
    { data: authData },
  ] = await Promise.all([
    admin.from("profiles").select("id,role,full_name,avatar_url,country,created_at").order("created_at", { ascending: false }),
    admin.from("mentorship_pairs").select("id,status").eq("status", "active"),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ])

  const allProfiles = profiles ?? []
  const totalUsers = allProfiles.length
  const participantCount = allProfiles.filter((p) => p.role === "participant").length
  const mentorCount = allProfiles.filter((p) => p.role === "mentor").length
  const activePairs = pairsData?.length ?? 0

  const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email ?? ""]))
  const recentSignups = allProfiles.slice(0, 10)

  return (
    <div className="space-y-8">
      <AdminStats
        totalUsers={totalUsers}
        participants={participantCount}
        mentors={mentorCount}
        activePairs={activePairs}
      />

      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Recent Signups</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600">User</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Country</th>
                <th className="px-4 py-3 font-semibold text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentSignups.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">No users yet</td>
                </tr>
              )}
              {recentSignups.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProfileAvatar avatarUrl={p.avatar_url} fullName={p.full_name} size="sm" />
                      <span className="font-medium text-gray-900">{p.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-48">
                    {emailMap.get(p.id) || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.role === "mentor"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {p.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.country ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
            Showing the {recentSignups.length} most recent registrations
          </div>
        </div>
      </div>
    </div>
  )
}
