import { createClient } from "@/lib/supabase/server"
import DashboardSidebar from "@/components/layout/DashboardSidebar"
import DashboardContentWrapper from "@/components/layout/DashboardContentWrapper"
import MobileNav from "@/components/layout/MobileNav"
import PresenceHeartbeat from "@/components/features/dashboard/PresenceHeartbeat"
import { CallContextProvider } from "@/context/CallContext"
import CallUI from "@/components/features/chat/CallUI"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = ADMIN_EMAILS.includes(user?.email ?? "")

  return (
    <CallContextProvider currentUserId={user?.id ?? ""}>
      <div className="flex h-dvh bg-brand-bg">
        <DashboardSidebar isAdmin={isAdmin} />
        <DashboardContentWrapper>
          <PresenceHeartbeat />
          {children}
        </DashboardContentWrapper>
        <MobileNav isAdmin={isAdmin} />
        <CallUI />
      </div>
    </CallContextProvider>
  )
}
