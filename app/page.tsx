import HeroSection from "@/components/features/home/HeroSection"
import StatsBar from "@/components/features/home/StatsBar"
import ServicesGrid from "@/components/features/home/ServicesGrid"
import AboutTeaser from "@/components/features/home/AboutTeaser"
import TeamTeaser from "@/components/features/home/TeamTeaser"
import ImpactNumbers from "@/components/features/home/ImpactNumbers"
import CtaBanner from "@/components/features/home/CtaBanner"
import SdgRainbowBar from "@/components/ui/SdgRainbowBar"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="px-4 py-3 bg-brand-navy">
        <SdgRainbowBar height="sm" />
      </div>
      <StatsBar />
      <ServicesGrid />
      <AboutTeaser />
      <ImpactNumbers />
      <TeamTeaser />
      <CtaBanner />
    </>
  )
}
