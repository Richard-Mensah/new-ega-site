"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import Modal from "@/components/ui/Modal"
import Input from "@/components/ui/Input"
import { ProjectSchema, type ProjectInput } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import { SDG_LIST } from "@/lib/constants/sdgs"

export default function NewProjectModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectInput>({
    resolver: zodResolver(ProjectSchema),
  })

  function handleClose() {
    setOpen(false)
    reset()
    setError(null)
  }

  async function onSubmit(data: ProjectInput) {
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: dbError } = await supabase.from("projects").insert({
        participant_id: user.id,
        title: data.title,
        sdg_number: data.sdg_number,
        description: data.description,
        stage: 1,
        status: "active",
      })

      if (dbError) throw new Error(dbError.message)
      handleClose()
      router.refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong"
      setError(msg.includes("row-level security") ? "Permission denied. Please try again or contact support." : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors"
      >
        <Plus size={16} />
        New Project
      </button>

      <Modal isOpen={open} onClose={handleClose} title="New Project">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="Enter project title"
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">SDG Focus</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              {...register("sdg_number", { setValueAs: (v) => v === "" ? null : Number(v) })}
            >
              <option value="">No SDG selected</option>
              {SDG_LIST.map((sdg) => (
                <option key={sdg.number} value={sdg.number}>
                  SDG {sdg.number}: {sdg.title}
                </option>
              ))}
            </select>
            {errors.sdg_number && <span className="text-sm text-red-600">{errors.sdg_number.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
              rows={3}
              placeholder="Describe your project..."
              {...register("description")}
            />
            {errors.description && <span className="text-sm text-red-600">{errors.description.message}</span>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-gold text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
