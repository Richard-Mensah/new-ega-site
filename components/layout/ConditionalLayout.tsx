"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

type Props = { children: React.ReactNode }

export default function ConditionalLayout({ children }: Props) {
  const pathname = usePathname()
  const isDashboard =
    pathname.startsWith("/dashboard") || pathname.startsWith("/mentor")

  if (isDashboard) {
    return <div className="min-h-screen bg-brand-bg">{children}</div>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
