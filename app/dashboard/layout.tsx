import DashboardSidebar from "@/components/layout/DashboardSidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <DashboardSidebar />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
