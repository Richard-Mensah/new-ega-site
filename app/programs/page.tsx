import type { Metadata } from "next"
import ProgramsHero from "@/components/features/programs/ProgramsHero"
import CurriculumYear1 from "@/components/features/programs/CurriculumYear1"
import CurriculumYear2 from "@/components/features/programs/CurriculumYear2"
import ProgramsCta from "@/components/features/programs/ProgramsCta"

export const metadata: Metadata = {
  title: "Programs | EGA Mentorship International",
  description: "Explore EGA's 2-year leadership curriculum with SDG-aligned projects, mentorship, and portfolio development designed for international impact.",
}

export default function ProgramsPage() {
  return (
    <>
      <ProgramsHero />
      <CurriculumYear1 />
      <CurriculumYear2 />
      <ProgramsCta />
    </>
  )
}
