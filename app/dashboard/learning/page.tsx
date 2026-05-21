import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, ChevronRight, CheckCircle2 } from "lucide-react"
import { CURRICULUM, PHASE_LABELS, PHASE_TITLES, TOTAL_TOPICS, type LearningModule } from "@/lib/constants/curriculum"

function moduleStatus(completed: number, total: number): "complete" | "in_progress" | "not_started" {
  if (completed === 0) return "not_started"
  if (completed >= total) return "complete"
  return "in_progress"
}

export default async function LearningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: completionsRaw } = await supabase
    .from("module_completions")
    .select("module_id, topic_id")
    .eq("participant_id", user.id)

  const completionMap = new Map<number, Set<number>>()
  for (const row of completionsRaw ?? []) {
    if (!completionMap.has(row.module_id)) completionMap.set(row.module_id, new Set())
    completionMap.get(row.module_id)!.add(row.topic_id)
  }

  const totalCompleted = (completionsRaw ?? []).length
  const overallPct = Math.round((totalCompleted / TOTAL_TOPICS) * 100)
  const completedModules = CURRICULUM.filter(
    (m) => (completionMap.get(m.id)?.size ?? 0) >= m.topics.length
  ).length

  const phase1 = CURRICULUM.filter((m) => m.phase === 1)
  const phase2 = CURRICULUM.filter((m) => m.phase === 2)

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Learning Path</h1>
        <p className="text-gray-500 text-sm mt-1">Your 2-month leadership curriculum</p>
      </div>

      {/* Overall progress card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="font-bold text-brand-navy text-lg">Overall Progress</p>
            <p className="text-gray-500 text-sm mt-0.5">
              {completedModules} of {CURRICULUM.length} modules · {totalCompleted} of {TOTAL_TOPICS} topics completed
            </p>
          </div>
          <span className="text-3xl font-extrabold text-brand-gold shrink-0">{overallPct}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-gold rounded-full transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>
        {overallPct === 100 && (
          <div className="mt-4 flex items-center gap-2 text-green-600 font-semibold text-sm">
            <CheckCircle2 size={16} />
            Curriculum complete — congratulations!
          </div>
        )}
      </div>

      <PhaseSection phase={1} modules={phase1} completionMap={completionMap} />
      <PhaseSection phase={2} modules={phase2} completionMap={completionMap} />
    </div>
  )
}

function PhaseSection({
  phase,
  modules,
  completionMap,
}: {
  phase: 1 | 2
  modules: LearningModule[]
  completionMap: Map<number, Set<number>>
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            phase === 1 ? "bg-brand-navy text-white" : "bg-brand-gold text-white"
          }`}
        >
          {PHASE_LABELS[phase]}
        </span>
        <h2 className="text-lg font-bold text-brand-navy">{PHASE_TITLES[phase]}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => {
          const completedCount = completionMap.get(mod.id)?.size ?? 0
          const total = mod.topics.length
          const status = moduleStatus(completedCount, total)
          const pct = Math.round((completedCount / total) * 100)

          return (
            <Link
              key={mod.id}
              href={`/dashboard/learning/${mod.id}`}
              className="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-brand-gold/40 hover:shadow-sm transition-all flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl font-extrabold text-brand-gold/30 tabular-nums shrink-0 leading-none">
                    {String(mod.id).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-brand-navy text-sm truncate">{mod.title}</p>
                    <p className="text-xs text-gray-400 truncate">{mod.subtitle}</p>
                  </div>
                </div>
                <StatusBadge status={status} />
              </div>

              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{mod.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={11} />
                    {completedCount} / {total} topics
                  </span>
                  <span>{mod.weekRange} · ~{mod.estimatedHours}h</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === "complete" ? "bg-green-500" : "bg-brand-gold"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                <span className="text-xs font-semibold text-brand-gold group-hover:text-amber-600 transition-colors">
                  {status === "not_started" ? "Start Module" : status === "complete" ? "Review Module" : "Continue →"}
                </span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-gold transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: "complete" | "in_progress" | "not_started" }) {
  if (status === "complete") {
    return (
      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
        Complete
      </span>
    )
  }
  if (status === "in_progress") {
    return (
      <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
        In Progress
      </span>
    )
  }
  return (
    <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-200">
      Not Started
    </span>
  )
}
