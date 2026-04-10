export default function EduConsultHero() {
  return (
    <section className="bg-brand-navy text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">New Service</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
            Educational Consultancy
          </h1>
          <p className="mt-6 text-xl text-white/80 leading-relaxed">
            Your gateway to world-class academic opportunities. EGA&apos;s Educational Consultancy service provides expert guidance to help you access international scholarships, prestigious universities, and transformational study abroad programs.
          </p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "150+", label: "Placements" },
              { value: "50+", label: "Partner Universities" },
              { value: "30+", label: "Scholarships" },
              { value: "98%", label: "Success Rate" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-brand-gold">{s.value}</div>
                <div className="text-sm text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
