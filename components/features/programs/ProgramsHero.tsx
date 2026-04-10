export default function ProgramsHero() {
  return (
    <section className="bg-brand-navy text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">2-Year Journey</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold">EGA Leadership Program</h1>
        <p className="mt-6 text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          A structured, internationally-designed curriculum that transforms youth aged 18–30 into confident, SDG-literate leaders ready to drive sustainable change in their communities and beyond.
        </p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "2 Years", label: "Program Duration" },
            { value: "12+", label: "Modules" },
            { value: "17", label: "SDGs Covered" },
            { value: "1:1", label: "Mentorship" },
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
