export default function AboutHero() {
  return (
    <section className="bg-brand-navy text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Who We Are</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
          About EGA Mentorship International
        </h1>
        <p className="mt-6 text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          A global youth development organization committed to empowering the next generation of leaders through transformational mentorship, SDG-aligned education, and cross-cultural collaboration.
        </p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "2020", label: "Founded" },
            { value: "6", label: "Countries" },
            { value: "17", label: "SDGs" },
            { value: "10K+", label: "Leaders Goal" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-brand-gold">{s.value}</div>
              <div className="text-sm text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
