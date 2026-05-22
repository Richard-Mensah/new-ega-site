import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import ProfileHero from "@/components/features/community/ProfileHero"
import ProfileSections from "@/components/features/community/ProfileSections"
import type { PublicProfile } from "@/types"

interface PageProps {
  params: Promise<{ participantId: string }>
}

export default async function ParticipantProfilePage({ params }: PageProps) {
  const { participantId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [
    { data: profileRaw },
    { data: portfolioRaw },
    { data: sdgProgressRaw },
    { data: projectsRaw },
    { data: awardsRaw },
    { count: likeCount },
    { data: myLikeRaw },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, country, organization, bio, avatar_url, sdg_focus, linkedin_url, created_at, role")
      .eq("id", participantId)
      .single(),
    supabase
      .from("portfolio_items")
      .select("id, type, title, description, tags, content_url")
      .eq("participant_id", participantId)
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("sdg_progress")
      .select("sdg_number, level")
      .eq("participant_id", participantId),
    supabase
      .from("projects")
      .select("id, title, sdg_number, stage, status")
      .eq("participant_id", participantId)
      .order("created_at", { ascending: false }),
    supabase
      .from("mentor_awards")
      .select("id, category, title, notes, awarded_at")
      .eq("participant_id", participantId)
      .order("awarded_at", { ascending: false }),
    supabase
      .from("profile_likes")
      .select("id", { count: "exact", head: true })
      .eq("liked_id", participantId),
    supabase
      .from("profile_likes")
      .select("id")
      .eq("liked_id", participantId)
      .eq("liker_id", user.id)
      .maybeSingle(),
  ])

  if (!profileRaw || profileRaw.role !== "participant") notFound()

  const profile = profileRaw as PublicProfile
  const portfolio = (portfolioRaw ?? []) as Array<{
    id: string; type: "article" | "project" | "certificate" | "video"
    title: string; description: string | null; tags: string[]; content_url: string | null
  }>
  const sdgProgress = sdgProgressRaw ?? []
  const projects = projectsRaw ?? []
  const awards = (awardsRaw ?? []) as Array<{
    id: string; category: "leadership" | "sdg_engagement" | "communication" | "projects" | "overall"
    title: string; notes: string | null; awarded_at: string
  }>
  const initialLiked = myLikeRaw !== null

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back navigation */}
      <Link
        href="/dashboard/community"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-navy transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Community
      </Link>

      {/* Two-column layout at lg */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-4">
          <ProfileHero
            profile={profile}
            likeCount={likeCount ?? 0}
            initialLiked={initialLiked}
          />
          <ProfileSections
            bio={profile.bio}
            sdgFocus={profile.sdg_focus ?? []}
            portfolio={portfolio}
            sdgProgress={sdgProgress}
            projects={projects}
            awards={awards}
          />
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4">
          {/* Stats card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Profile Stats</h3>
            <dl className="space-y-2">
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Portfolio items</dt>
                <dd className="font-semibold text-gray-900">{portfolio.length}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">SDGs engaged</dt>
                <dd className="font-semibold text-gray-900">{sdgProgress.length}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Projects</dt>
                <dd className="font-semibold text-gray-900">{projects.length}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-gray-500">Awards</dt>
                <dd className="font-semibold text-gray-900">{awards.length}</dd>
              </div>
            </dl>
          </div>

          {/* LinkedIn */}
          {profile.linkedin_url && profile.linkedin_url.startsWith("http") && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors group"
            >
              <span>View LinkedIn Profile</span>
              <ExternalLink size={15} className="shrink-0" />
            </a>
          )}

          {/* Privacy note */}
          <p className="text-xs text-gray-400 leading-relaxed px-1">
            Sensitive information such as email addresses and dates of birth are never shown on public profiles.
          </p>
        </aside>
      </div>
    </div>
  )
}
