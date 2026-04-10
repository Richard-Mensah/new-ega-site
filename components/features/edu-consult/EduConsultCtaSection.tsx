import Link from "next/link"

export default function EduConsultCtaSection() {
  return (
    <section className="py-20 bg-brand-navy text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Start Your Academic Journey Today</h2>
        <p className="mt-6 text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
          Whether you&apos;re aiming for a full scholarship, an international degree, or a prestigious exchange program — EGA&apos;s Educational Consultancy service is here to guide you every step of the way.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-brand-gold text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-amber-600 transition-colors">
            Apply to EGA
          </Link>
          <Link href="/contact" className="border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">
            Book a Consultation
          </Link>
        </div>
      </div>
    </section>
  )
}
