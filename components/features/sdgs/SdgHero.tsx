import SdgRainbowBar from "@/components/ui/SdgRainbowBar"

export default function SdgHero() {
  return (
    <section className="bg-brand-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Global Goals</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold">
          17 UN Sustainable Development Goals
        </h1>
        <p className="mt-6 text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          EGA Mentorship International is committed to all 17 United Nations Sustainable Development Goals. Every participant engages with multiple SDGs through their projects, mentorship, and community action.
        </p>
        <div className="mt-10 max-w-4xl mx-auto">
          <SdgRainbowBar height="lg" showLabels />
        </div>
      </div>
    </section>
  )
}
