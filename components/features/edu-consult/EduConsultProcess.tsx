const STEPS = [
  {
    step: "01",
    title: "Initial Assessment",
    description: "We begin with a comprehensive assessment of your academic background, career goals, financial situation, and preferences to map out the most suitable pathways for your unique situation.",
  },
  {
    step: "02",
    title: "Opportunity Matching",
    description: "Based on your assessment, our consultants identify scholarships, universities, and programs that align with your profile — presenting you with a curated shortlist of high-potential opportunities.",
  },
  {
    step: "03",
    title: "Application Development",
    description: "We work alongside you to develop compelling applications — coaching you through personal statements, academic essays, reference letter requests, and document preparation for each opportunity.",
  },
  {
    step: "04",
    title: "Submission & Follow-up",
    description: "We ensure your applications are submitted correctly and on time, then support you through interview preparation, offer negotiations, and enrollment decisions to maximize your success.",
  },
]

export default function EduConsultProcess() {
  return (
    <section className="py-20 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy">Our 4-Step Process</h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            A proven, structured approach that maximizes your chances of securing your dream academic opportunity
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ step, title, description }, index) => (
            <div key={step} className="relative">
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-brand-gold/30 z-0" />
              )}
              <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-5xl font-extrabold text-brand-gold/20 mb-3">{step}</div>
                <h3 className="font-bold text-brand-navy text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
