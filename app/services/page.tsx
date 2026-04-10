import type { Metadata } from "next"
import ServicesHero from "@/components/features/services/ServicesHero"
import ServiceCards from "@/components/features/services/ServiceCards"
import ServicesCtaSection from "@/components/features/services/ServicesCtaSection"

export const metadata: Metadata = {
  title: "Services | EGA Mentorship International",
  description: "Explore EGA's comprehensive youth leadership services: mentorship, leadership training, educational consultancy, SDG programs, portfolio development, and global network.",
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServiceCards />
      <ServicesCtaSection />
    </>
  )
}
