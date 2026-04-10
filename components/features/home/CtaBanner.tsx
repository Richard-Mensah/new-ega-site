import Link from "next/link"

export default function CtaBanner() {
  return (
    <section className="py-20 bg-brand-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">
          Join Us Today
        </span>
        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-white leading-tight">
          Ready to Lead?
        </h2>
        <p className="mt-6 text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
          Take the first step toward becoming a global youth leader. Applications are open to youth aged 18–30 across all our partner countries.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="bg-brand-gold text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors"
          >
            Apply Now
          </Link>
          <Link
            href="/programs"
            className="border-2 border-white/40 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
          >
            View Programs
          </Link>
        </div>

        <p className="mt-8 text-white/50 text-sm">
          Free to apply · Open to ages 18–30 · Ghana · USA · Serbia · Zambia · Zimbabwe · Liberia
        </p>
      </div>
    </section>
  )
}
