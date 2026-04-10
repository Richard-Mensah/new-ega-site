import type { Metadata } from "next"
import TeamHero from "@/components/features/team/TeamHero"
import TeamGrid from "@/components/features/team/TeamGrid"

export const metadata: Metadata = {
  title: "Our Team | EGA Mentorship International",
  description: "Meet the dedicated global leaders behind EGA Mentorship International — professionals from Ghana, USA, Serbia, Zambia, Zimbabwe, and Liberia driving youth empowerment.",
}

export default function TeamPage() {
  return (
    <>
      <TeamHero />
      <TeamGrid />
    </>
  )
}
