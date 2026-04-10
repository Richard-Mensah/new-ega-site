const MODULES = [
  {
    week: "Weeks 1–4",
    title: "Leadership Foundations",
    topics: ["Introduction to leadership theory", "Self-assessment & personal values", "Communication & public speaking basics", "Setting leadership goals"],
  },
  {
    week: "Weeks 5–8",
    title: "SDG Literacy",
    topics: ["Introduction to all 17 UN SDGs", "SDG mapping to local contexts", "Identifying your SDG focus areas", "Community needs assessment"],
  },
  {
    week: "Weeks 9–12",
    title: "Mentorship Framework",
    topics: ["Introduction to your mentor", "Setting mentorship goals & expectations", "First project ideation sessions", "Accountability systems"],
  },
  {
    week: "Weeks 13–20",
    title: "Portfolio & Project Start",
    topics: ["Portfolio design principles", "Choosing your Year 1 project", "Project planning & SDG alignment", "Community stakeholder engagement"],
  },
  {
    week: "Weeks 21–26",
    title: "Skills Development",
    topics: ["Emotional intelligence & team leadership", "Data analysis & impact measurement", "Networking & relationship building", "Mid-year review & portfolio submission"],
  },
]

export default function CurriculumYear1() {
  return (
    <section id="year1" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-brand-navy text-white text-sm font-bold px-4 py-2 rounded-full">Year 1</div>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy">Foundations & Discovery</h2>
        </div>
        <p className="text-gray-600 mb-10 max-w-2xl">
          Year 1 builds the leadership foundation — introducing participants to EGA&apos;s framework, establishing mentor relationships, and beginning the journey of SDG engagement and personal project development.
        </p>
        <div className="space-y-4">
          {MODULES.map(({ week, title, topics }) => (
            <div key={title} className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl border border-gray-100 hover:border-brand-gold/30 hover:shadow-sm transition-all">
              <div className="md:w-36 shrink-0">
                <span className="text-xs font-semibold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full">{week}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-brand-navy text-lg mb-2">{title}</h3>
                <div className="grid grid-cols-2 gap-1">
                  {topics.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-navy shrink-0" />
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
