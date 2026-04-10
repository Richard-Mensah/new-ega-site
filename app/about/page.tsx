import type { Metadata } from "next"
import AboutHero from "@/components/features/about/AboutHero"
import MissionVision from "@/components/features/about/MissionVision"
import EightPillars from "@/components/features/about/EightPillars"
import GlobalPresence from "@/components/features/about/GlobalPresence"

export const metadata: Metadata = {
  title: "About EGA | EGA Mentorship International",
  description:
    "Learn about EGA Mentorship International's mission, vision, and 8 pillars of impact across 6 countries.",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <EightPillars />
      <GlobalPresence />
    </>
  )
}
