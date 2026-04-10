import type { Metadata } from "next"
import SdgHero from "@/components/features/sdgs/SdgHero"
import SdgGrid from "@/components/features/sdgs/SdgGrid"

export const metadata: Metadata = {
  title: "17 UN SDGs | EGA Mentorship International",
  description: "EGA Mentorship International engages with all 17 UN Sustainable Development Goals. Discover how our programs address each goal through mentorship, projects, and community action.",
}

export default function SdgsPage() {
  return (
    <>
      <SdgHero />
      <SdgGrid />
    </>
  )
}
