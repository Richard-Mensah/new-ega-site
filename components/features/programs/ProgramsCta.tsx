import Link from "next/link"

export default function ProgramsCta() {
  return (
    <section className="py-20 bg-brand-navy text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Begin Your 2-Year Leadership Journey</h2>
        <p className="mt-6 text-white/80 text-lg max-w-2xl mx-auto">
          Applications are open to youth aged 18–30 across all 6 EGA partner countries. Places are limited — apply today to secure your spot in the next cohort.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="bg-brand-gold text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-amber-600 transition-colors">
            Apply Now
          </Link>
          <Link href="/contact" className="border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-white/10 transition-colors">
            Ask a Question
          </Link>
        </div>
      </div>
    </section>
  )
}
