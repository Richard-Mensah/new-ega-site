"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { COUNTRIES } from "@/lib/constants/team"
import Input from "@/components/ui/Input"
import Card from "@/components/ui/Card"

type FormValues = {
  full_name: string
  country: string
  bio: string
}

type Props = {
  userId: string
  defaultValues: FormValues
}

export default function SettingsForm({ userId, defaultValues }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ defaultValues })

  async function onSubmit(data: FormValues) {
    setSaving(true)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.from("profiles").update(data as any).eq("id", userId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Card>
      <h2 className="font-bold text-brand-navy text-lg mb-6">Profile Settings</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Full Name"
          error={errors.full_name?.message}
          {...register("full_name", { required: "Name is required" })}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <select
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            {...register("country")}
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Bio</label>
          <textarea
            rows={4}
            placeholder="Tell us about yourself..."
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
            {...register("bio")}
          />
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
            ✓ Profile updated successfully
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand-navy text-white py-3 rounded-xl font-semibold hover:bg-brand-navy/90 transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </Card>
  )
}
