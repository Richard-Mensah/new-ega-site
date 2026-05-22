import { SDG_LIST } from "@/lib/constants/sdgs"

// ─── Types ────────────────────────────────────────────────────────────────────

interface PortfolioItem {
  id: string
  type: "article" | "project" | "certificate" | "video"
  title: string
  description: string | null
  tags: string[]
  content_url: string | null
}

interface SdgProgressItem {
  sdg_number: number
  level: string
}

interface ProjectItem {
  id: string
  title: string
  sdg_number: number | null
  stage: number
  status: string
}

interface AwardItem {
  id: string
  category: "leadership" | "sdg_engagement" | "communication" | "projects" | "overall"
  title: string
  notes: string | null
  awarded_at: string
}

interface Props {
  bio: string | null
  sdgFocus: number[]
  portfolio: PortfolioItem[]
  sdgProgress: SdgProgressItem[]
  projects: ProjectItem[]
  awards: AwardItem[]
  linkedinUrl: string | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<PortfolioItem["type"], string> = {
  article: "bg-blue-500",
  project: "bg-brand-navy",
  certificate: "bg-brand-gold",
  video: "bg-green-500",
}

const AWARD_COLORS: Record<AwardItem["category"], { bg: string; border: string; text: string }> = {
  leadership:     { bg: "bg-amber-50",  border: "border-amber-200",  text: "text-amber-800"  },
  sdg_engagement: { bg: "bg-green-50",  border: "border-green-200",  text: "text-green-800"  },
  communication:  { bg: "bg-blue-50",   border: "border-blue-200",   text: "text-blue-800"   },
  projects:       { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800" },
  overall:        { bg: "bg-rose-50",   border: "border-rose-200",   text: "text-rose-800"   },
}

const LEVEL_PERCENT: Record<string, number> = {
  aware: 25,
  learning: 50,
  acting: 75,
  leading: 100,
}

const CATEGORY_LABELS: Record<AwardItem["category"], string> = {
  leadership:     "Leadership",
  sdg_engagement: "SDG Engagement",
  communication:  "Communication",
  projects:       "Projects",
  overall:        "Overall",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sdgByNumber(n: number) {
  return SDG_LIST.find((s) => s.number === n)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">{children}</div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold text-gray-900 mb-4">{children}</h2>
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProfileSections({
  bio,
  sdgFocus,
  portfolio,
  sdgProgress,
  projects,
  awards,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* ── Section 1: About ── */}
      {bio && bio.trim().length > 0 && (
        <SectionCard>
          <SectionHeading>About</SectionHeading>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{bio}</p>
        </SectionCard>
      )}

      {/* ── Section 2: SDG Focus Areas ── */}
      {sdgFocus.length > 0 && (
        <SectionCard>
          <SectionHeading>🌍 SDG Focus Areas</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {sdgFocus.map((num) => {
              const sdg = sdgByNumber(num)
              if (!sdg) return null
              return (
                <span
                  key={num}
                  className="px-3 py-1.5 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: sdg.color }}
                >
                  SDG {sdg.number} · {sdg.title}
                </span>
              )
            })}
          </div>
        </SectionCard>
      )}

      {/* ── Section 3: Portfolio (always render) ── */}
      <SectionCard>
        <SectionHeading>💼 Portfolio</SectionHeading>
        {portfolio.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No published items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {portfolio.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-gray-100">
                {/* Coloured header band */}
                <div className={`${TYPE_COLORS[item.type]} px-4 py-2 flex items-center justify-between`}>
                  <span className="text-xs font-semibold text-white uppercase tracking-wide">
                    {item.type}
                  </span>
                </div>

                <div className="px-4 py-3 flex flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{item.title}</p>

                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.content_url && (
                    <a
                      href={item.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-brand-navy hover:underline self-start"
                    >
                      View ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* ── Section 4: SDG Progress ── */}
      {sdgProgress.length > 0 && (
        <SectionCard>
          <SectionHeading>📊 SDG Engagement</SectionHeading>
          <div className="flex flex-col gap-3">
            {sdgProgress.map((item) => {
              const sdg = sdgByNumber(item.sdg_number)
              const pct = LEVEL_PERCENT[item.level] ?? 0
              return (
                <div key={item.sdg_number} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: sdg?.color ?? "#ccc" }}
                      />
                      <span className="text-sm text-gray-700">
                        SDG {item.sdg_number}{sdg ? ` · ${sdg.title}` : ""}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500 capitalize">
                      {item.level}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: sdg?.color ?? "#ccc",
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}

      {/* ── Section 5: Active Projects ── */}
      {projects.length > 0 && (
        <SectionCard>
          <SectionHeading>🚀 Projects</SectionHeading>
          <div className="flex flex-col gap-2">
            {projects.map((project) => {
              const sdg = project.sdg_number ? sdgByNumber(project.sdg_number) : null
              return (
                <div
                  key={project.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                >
                  {/* SDG colour badge */}
                  {sdg ? (
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: sdg.color }}
                    >
                      {sdg.number}
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                      —
                    </span>
                  )}

                  <span className="flex-1 text-sm font-medium text-gray-900 leading-tight">
                    {project.title}
                  </span>

                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy text-xs font-semibold">
                    Stage {project.stage}
                  </span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}

      {/* ── Section 6: EGA Awards ── */}
      {awards.length > 0 && (
        <SectionCard>
          <SectionHeading>🏅 EGA Awards</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {awards.map((award) => {
              const colors = AWARD_COLORS[award.category]
              return (
                <div
                  key={award.id}
                  className={`rounded-xl border p-4 ${colors.bg} ${colors.border}`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${colors.text}`}>
                    {CATEGORY_LABELS[award.category]}
                  </p>
                  <p className={`text-sm font-bold leading-tight ${colors.text}`}>{award.title}</p>
                  {award.notes && (
                    <p className={`text-sm mt-1 ${colors.text} opacity-80`}>{award.notes}</p>
                  )}
                  <p className={`text-xs mt-2 ${colors.text} opacity-60`}>
                    {formatDate(award.awarded_at)}
                  </p>
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
