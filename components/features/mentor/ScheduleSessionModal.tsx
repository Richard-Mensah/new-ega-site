"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { z } from "zod"
import Modal from "@/components/ui/Modal"
import { createClient } from "@/lib/supabase/client"

const SessionSchema = z.object({
  participant_id: z.string().min(1, "Please select a mentee"),
  scheduled_at: z.string().min(1, "Please select a date and time"),
  notes: z.string().optional(),
})
type FormInput = z.infer<typeof SessionSchema>

type Mentee = { id: string; full_name: string }

export default function ScheduleSessionModal({ mentees }: { mentees: Mentee[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>({
    resolver: zodResolver(SessionSchema),
  })

  function handleClose() {
    setOpen(false)
    reset()
    setError(null)
  }

  async function onSubmit(data: FormInput) {
    setError(null)
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: dbError } = await supabase.from("sessions").insert({
        mentor_id: user.id,
        participant_id: data.participant_id,
        scheduled_at: new Date(data.scheduled_at).toISOString(),
        notes: data.notes || null,
        status: "scheduled",
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
        New Session
      </button>

      <Modal isOpen={open} onClose={handleClose} title="Schedule Session">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Mentee</label>
            {mentees.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">No active mentees assigned yet.</p>
            ) : (
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                {...register("participant_id")}
              >
                <option value="">Select a mentee...</option>
                {mentees.map((m) => (
                  <option key={m.id} value={m.id}>{m.full_name}</option>
                ))}
              </select>
            )}
            {errors.participant_id && (
              <span className="text-sm text-red-600">{errors.participant_id.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Date & Time</label>
            <input
              type="datetime-local"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              {...register("scheduled_at")}
            />
            {errors.scheduled_at && (
              <span className="text-sm text-red-600">{errors.scheduled_at.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
              rows={3}
              placeholder="Session agenda or notes..."
              {...register("notes")}
            />
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
              disabled={loading || mentees.length === 0}
              className="flex-1 bg-brand-gold text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60"
            >
              {loading ? "Scheduling..." : "Schedule Session"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
