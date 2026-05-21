import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import NewPortfolioModal from "@/components/features/dashboard/NewPortfolioModal"
import { Briefcase, FileText, Video, Award } from "lucide-react"
import type { PortfolioItem } from "@/types"
import type { Tables } from "@/types/database"

const TYPE_ICONS = {
  article: FileText,
  project: Briefcase,
  certificate: Award,
  video: Video,
}

const TYPE_COLORS = {
  article: "blue" as const,
  project: "navy" as const,
  certificate: "gold" as const,
  video: "green" as const,
}

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: itemsRaw } = await supabase.from("portfolio_items").select("*").eq("participant_id", user.id).order("created_at", { ascending: false })
  const items = itemsRaw as Tables<"portfolio_items">[] | null

  const published = items?.filter((i) => i.published).length ?? 0
  const total = items?.length ?? 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">My Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">Showcase your projects, articles, and achievements</p>
        </div>
        <NewPortfolioModal />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card accent="navy">
          <div className="text-3xl font-extrabold text-brand-navy">{total}</div>
          <div className="text-xs text-gray-500 mt-1">Total Items</div>
        </Card>
        <Card accent="green">
          <div className="text-3xl font-extrabold text-brand-navy">{published}</div>
          <div className="text-xs text-gray-500 mt-1">Published</div>
        </Card>
        <Card accent="gold">
          <div className="text-3xl font-extrabold text-brand-navy">{total - published}</div>
          <div className="text-xs text-gray-500 mt-1">Drafts</div>
        </Card>
      </div>

      {/* Items grid */}
      {!items || items.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="font-medium text-gray-500">Your portfolio is empty</p>
            <p className="text-sm text-gray-400 mt-1">Start adding articles, projects, and certificates to showcase your journey</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(items as PortfolioItem[]).map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? Briefcase
            const color = TYPE_COLORS[item.type] ?? "gray"
            return (
              <Card key={item.id}>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-brand-navy/5 rounded-xl shrink-0">
                    <Icon size={18} className="text-brand-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-brand-navy text-sm truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge label={item.type} color={color} />
                      <Badge label={item.published ? "Published" : "Draft"} color={item.published ? "green" : "gray"} />
                    </div>
                    {item.content_url && (
                      <a href={item.content_url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-gold hover:underline mt-1 block">
                        View →
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
