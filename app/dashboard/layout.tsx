import { createClient } from "@/lib/supabase/server"
import DashboardSidebar from "@/components/layout/DashboardSidebar"
import PresenceHeartbeat from "@/components/features/dashboard/PresenceHeartbeat"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = ADMIN_EMAILS.includes(user?.email ?? "")

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <DashboardSidebar isAdmin={isAdmin} />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <PresenceHeartbeat />
        {children}
      </div>
    </div>
  )
}
