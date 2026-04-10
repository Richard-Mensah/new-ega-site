import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { BookOpen, CheckCircle, Circle } from "lucide-react"

const YEAR1_MODULES = [
  { id: 1, title: "Leadership Foundations", week: "Weeks 1–4", topics: 4 },
  { id: 2, title: "SDG Literacy", week: "Weeks 5–8", topics: 4 },
  { id: 3, title: "Mentorship Framework", week: "Weeks 9–12", topics: 4 },
  { id: 4, title: "Portfolio & Project Start", week: "Weeks 13–20", topics: 4 },
  { id: 5, title: "Skills Development", week: "Weeks 21–26", topics: 4 },
]

const YEAR2_MODULES = [
  { id: 6, title: "Advanced Leadership", week: "Weeks 1–6", topics: 4 },
  { id: 7, title: "Project Execution", week: "Weeks 7–12", topics: 4 },
  { id: 8, title: "Global Network Activation", week: "Weeks 13–18", topics: 4 },
  { id: 9, title: "Career Pathway & Placement", week: "Weeks 19–24", topics: 4 },
  { id: 10, title: "Graduation & Legacy", week: "Weeks 25–26", topics: 4 },
]

export default async function LearningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: milestonesRaw } = await supabase
    .from("milestones")
    .select("type, score")
    .eq("participant_id", user.id)
    .order("recorded_at", { ascending: false })
    .limit(1)

  const milestones = milestonesRaw as { type: string; score: number }[] | null
  const overallScore = milestones?.[0]?.score ?? 0
  const completedModules = Math.floor(overallScore / 10)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Learning Path</h1>
        <p className="text-gray-500 text-sm mt-1">Your 2-year leadership curriculum progress</p>
      </div>

      {/* Progress bar */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-brand-navy">Overall Progress</span>
          <span className="text-2xl font-extrabold text-brand-gold">{overallScore}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold rounded-full transition-all"
            style={{ width: `${overallScore}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{completedModules} of 10 modules completed</p>
      </Card>

      {/* Year 1 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Badge label="Year 1" color="navy" size="md" />
          <h2 className="text-lg font-bold text-brand-navy">Foundations & Discovery</h2>
        </div>
        <div className="space-y-3">
          {YEAR1_MODULES.map((mod) => {
            const done = mod.id <= completedModules
            return (
              <div key={mod.id} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
                {done ? (
                  <CheckCircle size={20} className="text-green-500 shrink-0" />
                ) : (
                  <Circle size={20} className="text-gray-300 shrink-0" />
                )}
                <BookOpen size={16} className="text-brand-navy shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-brand-navy text-sm">{mod.title}</p>
                  <p className="text-xs text-gray-400">{mod.week} · {mod.topics} topics</p>
                </div>
                <Badge label={done ? "Completed" : "Pending"} color={done ? "green" : "gray"} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Year 2 */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Badge label="Year 2" color="gold" size="md" />
          <h2 className="text-lg font-bold text-brand-navy">Advanced Practice & Impact</h2>
        </div>
        <div className="space-y-3">
          {YEAR2_MODULES.map((mod) => {
            const done = mod.id <= completedModules
            return (
              <div key={mod.id} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
                {done ? (
                  <CheckCircle size={20} className="text-green-500 shrink-0" />
                ) : (
                  <Circle size={20} className="text-gray-300 shrink-0" />
                )}
                <BookOpen size={16} className="text-brand-gold shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-brand-navy text-sm">{mod.title}</p>
                  <p className="text-xs text-gray-400">{mod.week} · {mod.topics} topics</p>
                </div>
                <Badge label={done ? "Completed" : "Pending"} color={done ? "green" : "gray"} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
