import MentorSidebar from "@/components/layout/MentorSidebar"

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <MentorSidebar />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}
