import type { Metadata } from "next"
import EduConsultHero from "@/components/features/edu-consult/EduConsultHero"
import EduConsultFeatures from "@/components/features/edu-consult/EduConsultFeatures"
import EduConsultProcess from "@/components/features/edu-consult/EduConsultProcess"
import EduConsultCtaSection from "@/components/features/edu-consult/EduConsultCtaSection"

export const metadata: Metadata = {
  title: "Educational Consultancy | EGA Mentorship International",
  description: "EGA's Educational Consultancy service provides scholarship guidance, university placement, and study abroad support for youth leaders seeking international academic opportunities.",
}

export default function EduConsultPage() {
  return (
    <>
      <EduConsultHero />
      <EduConsultFeatures />
      <EduConsultProcess />
      <EduConsultCtaSection />
    </>
  )
}
