import Link from "next/link"

export default function ServicesCtaSection() {
  return (
    <section className="py-20 bg-brand-warm">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">Ready to Access World-Class Services?</h2>
        <p className="mt-4 text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          All EGA services are available to enrolled participants. Register today to unlock mentorship, leadership training, and a global network that will transform your leadership journey.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-brand-navy text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-brand-navy/90 transition-colors">
            Apply to EGA
          </Link>
          <Link href="/contact" className="border-2 border-brand-navy text-brand-navy px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-brand-navy hover:text-white transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
