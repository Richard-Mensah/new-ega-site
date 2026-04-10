const MODULES = [
  {
    week: "Weeks 1–6",
    title: "Advanced Leadership",
    topics: ["Strategic leadership & vision setting", "Change management", "Cross-cultural leadership", "Facilitation & training design"],
  },
  {
    week: "Weeks 7–12",
    title: "Project Execution",
    topics: ["Full project implementation", "Team coordination & delegation", "Real-time impact measurement", "Stakeholder reporting"],
  },
  {
    week: "Weeks 13–18",
    title: "Global Network Activation",
    topics: ["International partner introductions", "Cross-country collaboration projects", "Alumni network integration", "Global summit participation"],
  },
  {
    week: "Weeks 19–24",
    title: "Career Pathway & Placement",
    topics: ["Career strategy finalization", "Professional portfolio completion", "Employer & opportunity introductions", "Fellowship & scholarship applications"],
  },
  {
    week: "Weeks 25–26",
    title: "Graduation & Legacy",
    topics: ["Final portfolio review", "Project impact report", "Graduation ceremony & certification", "Alumni transition & mentoring others"],
  },
]

export default function CurriculumYear2() {
  return (
    <section id="year2" className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-brand-gold text-white text-sm font-bold px-4 py-2 rounded-full">Year 2</div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">Advanced Practice & Impact</h2>
        </div>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Year 2 accelerates participants into advanced practice — executing ambitious projects, activating global networks, and solidifying career pathways that will carry their leadership impact forward.
        </p>
        <div className="space-y-4">
          {MODULES.map(({ week, title, topics }) => (
            <div key={title} className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl border border-gray-100 bg-white hover:border-brand-gold/30 hover:shadow-sm transition-all">
              <div className="md:w-36 shrink-0">
                <span className="text-xs font-semibold text-white bg-brand-gold px-3 py-1 rounded-full">{week}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-navy text-lg mb-2">{title}</h3>
                <div className="grid grid-cols-2 gap-1">
                  {topics.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
