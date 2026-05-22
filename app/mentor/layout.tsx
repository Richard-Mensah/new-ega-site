import MentorSidebar from "@/components/layout/MentorSidebar"
import MentorMobileNav from "@/components/layout/MentorMobileNav"

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <MentorSidebar />
      <div className="md:ml-14 pb-20 md:pb-0 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
      <MentorMobileNav />
    </div>
  )
}
