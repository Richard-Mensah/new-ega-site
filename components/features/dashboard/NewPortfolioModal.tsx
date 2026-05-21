"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { z } from "zod"
import Modal from "@/components/ui/Modal"
import Input from "@/components/ui/Input"
import { createClient } from "@/lib/supabase/client"

const PortfolioItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["article", "project", "certificate", "video"]),
  content_url: z.string().optional(),
  published: z.boolean(),
})

type FormValues = z.input<typeof PortfolioItemSchema>
type FormOutput = z.output<typeof PortfolioItemSchema>

const TYPES = ["article", "project", "certificate", "video"] as const

export default function NewPortfolioModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(PortfolioItemSchema),
    defaultValues: { type: "article", published: false },
  })

  function handleClose() {
    setOpen(false)
    reset()
    setError(null)
  }

  async function onSubmit(data: FormOutput) {
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: dbError } = await supabase.from("portfolio_items").insert({
        participant_id: user.id,
        title: data.title,
        type: data.type,
        content_url: data.content_url || null,
        published: data.published,
      })

      if (dbError) throw new Error(dbError.message)
      handleClose()
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors"
      >
        <Plus size={16} />
        Add Item
      </button>

      <Modal isOpen={open} onClose={handleClose} title="Add Portfolio Item">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter title"
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <select
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              {...register("type")}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <Input
            label="URL (optional)"
            type="url"
            placeholder="https://..."
            error={errors.content_url?.message}
            {...register("content_url")}
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-brand-gold"
              {...register("published")}
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>

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
              {loading ? "Saving..." : "Add to Portfolio"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
