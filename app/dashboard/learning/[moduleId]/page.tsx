import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import {
  ChevronLeft,
  Clock,
  Target,
  CheckCircle2,
  Video,
  FileText,
  GraduationCap,
  BookOpen,
  ExternalLink,
} from "lucide-react"
import { CURRICULUM, PHASE_LABELS, type ResourceType } from "@/lib/constants/curriculum"
import CompletionToggle from "@/components/features/learning/CompletionToggle"

const RESOURCE_ICONS: Record<ResourceType, typeof Video> = {
  video: Video,
  article: FileText,
  course: GraduationCap,
  guide: BookOpen,
}

const RESOURCE_COLORS: Record<ResourceType, string> = {
  video: "bg-red-50 text-red-600",
  article: "bg-blue-50 text-blue-600",
  course: "bg-purple-50 text-purple-600",
  guide: "bg-green-50 text-green-600",
}

const RESOURCE_LABELS: Record<ResourceType, string> = {
  video: "Video",
  article: "Article",
  course: "Course",
  guide: "Guide",
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string }>
}) {
  const { moduleId } = await params
  const mod = CURRICULUM.find((m) => m.id === Number(moduleId))
  if (!mod) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: completionsRaw } = await supabase
    .from("module_completions")
    .select("topic_id, completed_at")
    .eq("participant_id", user.id)
    .eq("module_id", mod.id)

  const completedTopics = new Map<number, string>()
  for (const row of completionsRaw ?? []) {
    completedTopics.set(row.topic_id, row.completed_at)
  }

  const completedCount = completedTopics.size
  const totalTopics = mod.topics.length
  const pct = Math.round((completedCount / totalTopics) * 100)

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link
          href="/dashboard/learning"
          className="flex items-center gap-1 hover:text-brand-navy transition-colors"
        >
          <ChevronLeft size={14} />
          Learning Path
        </Link>
        <span>/</span>
        <span className="text-brand-navy font-medium">{mod.title}</span>
      </div>

      {/* Module header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="text-5xl font-extrabold text-brand-gold/20 leading-none tabular-nums shrink-0">
              {String(mod.id).padStart(2, "0")}
            </span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wide text-brand-gold">
                  {PHASE_LABELS[mod.phase]}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">{mod.weekRange}</span>
              </div>
              <h1 className="text-xl font-extrabold text-brand-navy">{mod.title}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{mod.subtitle}</p>
            </div>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs justify-end">
              <Clock size={12} />
              <span>~{mod.estimatedHours} hours</span>
            </div>
            <p className="text-xl font-extrabold text-brand-gold mt-1">{pct}%</p>
            <p className="text-xs text-gray-400">{completedCount}/{totalTopics} done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-500" : "bg-brand-gold"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{completedCount} of {totalTopics} topics completed</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-5">
          {mod.description}
        </p>

        {/* Learning objectives */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target size={14} className="text-brand-gold" />
            <p className="text-sm font-bold text-brand-navy">Learning Objectives</p>
          </div>
          <ul className="space-y-2">
            {mod.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <CheckCircle2 size={14} className="text-brand-gold shrink-0 mt-0.5" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-5">
        <h2 className="text-base font-bold text-brand-navy">Topics in This Module</h2>
        {mod.topics.map((topic, idx) => {
          const isDone = completedTopics.has(topic.id)
          const doneAt = completedTopics.get(topic.id)

          return (
            <div
              key={topic.id}
              className={`bg-white rounded-2xl border p-6 space-y-5 transition-all ${
                isDone ? "border-green-200" : "border-gray-100"
              }`}
            >
              {/* Topic header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-gray-300 tabular-nums mt-0.5 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-bold text-brand-navy">{topic.title}</h3>
                    {isDone && doneAt && (
                      <p className="text-xs text-green-600 mt-0.5">
                        Completed {new Date(doneAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
                {isDone && <CheckCircle2 size={18} className="text-green-500 shrink-0" />}
              </div>

              {/* Overview */}
              <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-brand-gold/30 pl-4">
                {topic.overview}
              </p>

              {/* Resources */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Resources</p>
                <div className="space-y-2">
                  {topic.resources.map((res, rIdx) => {
                    const Icon = RESOURCE_ICONS[res.type]
                    const colorClass = RESOURCE_COLORS[res.type]
                    return (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-brand-gold/30 hover:bg-gray-50/50 transition-all group"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brand-navy truncate group-hover:text-brand-gold transition-colors">
                            {res.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {RESOURCE_LABELS[res.type]} · {res.source} · {res.duration}
                          </p>
                        </div>
                        <ExternalLink size={13} className="text-gray-300 group-hover:text-brand-gold transition-colors shrink-0" />
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Completion toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <p className="text-xs text-gray-400">
                  {isDone ? "You have completed this topic." : "Read the resources above, then mark this topic complete."}
                </p>
                <CompletionToggle
                  moduleId={mod.id}
                  topicId={topic.id}
                  initialDone={isDone}
                  completedAt={doneAt}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          href="/dashboard/learning"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-navy transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Learning Path
        </Link>
        {pct === 100 && mod.id < CURRICULUM.length && (
          <Link
            href={`/dashboard/learning/${mod.id + 1}`}
            className="flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-amber-600 transition-colors"
          >
            Next Module
            <ChevronLeft size={14} className="rotate-180" />
          </Link>
        )}
      </div>
    </div>
  )
}
