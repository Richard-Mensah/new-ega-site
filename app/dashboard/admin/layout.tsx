import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminNav from "@/components/features/admin/AdminNav"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  if (!ADMIN_EMAILS.includes(user.email ?? "")) redirect("/dashboard")

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Admin Center</h1>
        <p className="text-gray-500 text-sm mt-1">Manage participants, mentors, and pairings</p>
      </div>
      <AdminNav />
      {children}
    </div>
  )
}
