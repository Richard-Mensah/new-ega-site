import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="bg-brand-navy text-white py-20 md:py-28 overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white,transparent_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold text-sm font-semibold px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
              Operating across 6 Countries
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Building the Next Generation of{" "}
              <span className="text-brand-gold">World Changemakers</span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Equipping youth leaders aged 18–30 with skills, networks, and confidence to drive
              SDG impact worldwide through world-class mentorship and leadership development.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/register"
                className="bg-brand-gold text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-amber-600 transition-colors text-center"
              >
                Join the Program
              </Link>
              <Link
                href="/about"
                className="border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Logo visual */}
          <div className="shrink-0 relative">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-brand-gold/10 border-2 border-brand-gold/30 flex items-center justify-center shadow-2xl">
              <Image
                src="/images/ega-logo.png"
                alt="EGA Mentorship International"
                width={220}
                height={220}
                className="rounded-full object-cover"
                priority
              />
            </div>
            {/* Decorative rings */}
            <div className="absolute -inset-4 rounded-full border border-brand-gold/20 animate-pulse" />
            <div className="absolute -inset-8 rounded-full border border-brand-gold/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
