export default function MissionVision() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-brand-navy rounded-2xl p-8 text-white">
            <div className="text-brand-gold text-sm font-semibold uppercase tracking-wider mb-3">Our Mission</div>
            <h2 className="text-2xl font-bold mb-4">Empowering Youth to Lead Sustainable Change</h2>
            <p className="text-white/80 leading-relaxed">
              EGA Mentorship International exists to equip youth leaders aged 18–30 with the knowledge, skills, and networks necessary to drive sustainable development across all 17 UN Sustainable Development Goals. We deliver this through world-class mentorship, structured leadership programs, and hands-on community projects.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              Our mission is grounded in the belief that access to quality mentorship should not be a privilege — it should be a right available to every young person, regardless of their geographic or socioeconomic background.
            </p>
          </div>

          <div className="bg-brand-warm rounded-2xl p-8 border border-brand-gold/20">
            <div className="text-brand-gold text-sm font-semibold uppercase tracking-wider mb-3">Our Vision</div>
            <h2 className="text-2xl font-bold text-brand-navy mb-4">A World Shaped by Empowered Youth Leaders</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a world where every young person has access to transformational mentorship, where youth leadership is recognized as a critical driver of sustainable development, and where a global network of EGA alumni are championing change in every country and sector.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              By 2030, EGA aims to have empowered 10,000 youth leaders across 20+ countries, each contributing meaningfully to the UN Sustainable Development Goals and building more equitable, prosperous communities.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-navy text-center mb-8">Our Story</h2>
          <div className="max-w-3xl mx-auto text-gray-600 space-y-4 leading-relaxed">
            <p>
              EGA Mentorship International was founded in 2020 with a simple but powerful conviction: that mentorship transforms lives. What began as a small initiative connecting youth in Ghana with experienced professionals quickly evolved into a cross-continental program spanning 6 countries across Africa, Europe, and North America.
            </p>
            <p>
              Our founders recognized that while talent is evenly distributed across the globe, opportunity is not. EGA was built to close that gap — bringing international-standard mentorship to youth who might otherwise never access it, and connecting them to a global community of leaders, innovators, and change-makers.
            </p>
            <p>
              Today, EGA operates structured mentorship programs, educational consultancy services, and SDG-aligned leadership training that meets participants wherever they are and prepares them for meaningful careers on the world stage.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
