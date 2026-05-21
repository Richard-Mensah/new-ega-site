import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import NewProjectModal from "@/components/features/dashboard/NewProjectModal"
import { Folder } from "lucide-react"
import { SDG_LIST } from "@/lib/constants/sdgs"
import type { Project } from "@/types"
import type { Tables } from "@/types/database"

const STAGES = ["Identify", "Set Goals", "Execute", "Analyze"]

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: projectsRaw } = await supabase.from("projects").select("*").eq("participant_id", user.id).order("created_at", { ascending: false })
  const projects = projectsRaw as Tables<"projects">[] | null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">My Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Track your SDG-aligned community projects</p>
        </div>
        <NewProjectModal />
      </div>

      {/* Stage pipeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAGES.map((stage, i) => {
          const count = projects?.filter((p) => p.stage === i + 1).length ?? 0
          return (
            <div key={stage} className="bg-white rounded-xl p-4 border border-gray-100 text-center">
              <div className="text-2xl font-extrabold text-brand-gold/30">{String(i + 1).padStart(2, "0")}</div>
              <div className="font-bold text-brand-navy text-sm">{stage}</div>
              <div className="text-xs text-gray-400 mt-1">{count} project{count !== 1 ? "s" : ""}</div>
            </div>
          )
        })}
      </div>

      {/* Project list */}
      {!projects || projects.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Folder size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="font-medium text-gray-500">No projects yet</p>
            <p className="text-sm text-gray-400 mt-1">Start your first SDG-aligned community project</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {(projects as Project[]).map((project) => {
            const sdg = SDG_LIST.find((s) => s.number === project.sdg_number)
            return (
              <Card key={project.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {sdg && (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: sdg.color }}>
                        {sdg.number}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-brand-navy">{project.title}</h3>
                      {sdg && <p className="text-xs text-gray-500 mt-0.5">SDG {sdg.number}: {sdg.title}</p>}
                      {project.description && <p className="text-sm text-gray-600 mt-1">{project.description}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge label={`Stage ${project.stage}: ${STAGES[project.stage - 1]}`} color="navy" />
                    <Badge label={project.status} color={project.status === "active" ? "green" : "gray"} />
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
