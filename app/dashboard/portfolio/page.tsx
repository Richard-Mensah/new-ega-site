import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import PortfolioManager from "@/components/features/dashboard/PortfolioManager"
import type { PortfolioItem } from "@/types"

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: itemsRaw } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("participant_id", user.id)
    .order("created_at", { ascending: false })

  const items = (itemsRaw ?? []) as PortfolioItem[]

  return (
    <div className="p-6 space-y-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">My Portfolio</h1>
        <p className="text-gray-500 text-sm mt-1">Showcase your projects, articles, certificates, and achievements</p>
      </div>
      <PortfolioManager initialItems={items} />
    </div>
  )
}
