"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { COUNTRIES } from "@/lib/constants/team"
import { SDG_LIST } from "@/lib/constants/sdgs"
import Input from "@/components/ui/Input"
import Card from "@/components/ui/Card"
import AvatarUpload from "@/components/features/dashboard/AvatarUpload"

type FormValues = {
  full_name: string
  country: string
  bio: string
  organization: string
  linkedin_url: string
}

type Props = {
  userId: string
  fullName: string
  avatarUrl: string | null
  sdgFocus: number[]
  defaultValues: FormValues
}

function calcCompletion(
  avatarUrl: string | null,
  sdgFocus: number[],
  values: FormValues
): number {
  return Math.round(
    [
      !!avatarUrl,
      !!values.country,
      !!values.bio,
      sdgFocus.length > 0,
      !!values.organization,
    ].filter(Boolean).length / 5 * 100
  )
}

export default function SettingsForm({
  userId,
  fullName,
  avatarUrl: initialAvatarUrl,
  sdgFocus: initialSdgFocus,
  defaultValues,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl)
  const [sdgFocus, setSdgFocus] = useState<number[]>(initialSdgFocus)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({ defaultValues })
  const watched = watch()
  const completion = calcCompletion(avatarUrl, sdgFocus, watched)

  function toggleSdg(n: number) {
    setSdgFocus((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    )
  }

  async function onSubmit(data: FormValues) {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from("profiles")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ ...data, sdg_focus: sdgFocus } as any)
      .eq("id", userId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Profile completion */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-brand-navy">Profile Completion</p>
          <span className="text-lg font-extrabold text-brand-gold">{completion}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${completion === 100 ? "bg-green-500" : "bg-brand-gold"}`}
            style={{ width: `${completion}%` }}
          />
        </div>
        {completion < 100 && (
          <p className="text-xs text-gray-400 mt-2">
            Complete your profile so mentors and fellow participants can connect with you.
          </p>
        )}
        {completion === 100 && (
          <p className="text-xs text-green-600 font-semibold mt-2">✓ Profile complete — great work!</p>
        )}
      </Card>

      {/* Avatar */}
      <Card>
        <h2 className="font-bold text-brand-navy text-base mb-5">Profile Photo</h2>
        <AvatarUpload
          userId={userId}
          currentUrl={avatarUrl}
          fullName={fullName}
          onUploaded={(url) => setAvatarUrl(url)}
        />
      </Card>

      {/* Personal details */}
      <Card>
        <h2 className="font-bold text-brand-navy text-base mb-5">Personal Details</h2>
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

          <Input
            label="Organization / Institution"
            placeholder="e.g. University of Ghana, Save the Children"
            {...register("organization")}
          />

          <Input
            label="LinkedIn Profile URL"
            placeholder="https://linkedin.com/in/yourname"
            type="url"
            {...register("linkedin_url")}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              rows={4}
              placeholder="Tell us about yourself — your background, passions, and goals…"
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
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </Card>

      {/* SDG Focus */}
      <Card>
        <h2 className="font-bold text-brand-navy text-base mb-1">SDG Focus Areas</h2>
        <p className="text-xs text-gray-500 mb-4">
          Select the Global Goals you are passionate about working on. These appear on your profile.
        </p>
        <div className="flex flex-wrap gap-2">
          {SDG_LIST.map((sdg) => {
            const active = sdgFocus.includes(sdg.number)
            return (
              <button
                key={sdg.number}
                type="button"
                onClick={() => toggleSdg(sdg.number)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                style={
                  active
                    ? { backgroundColor: sdg.color, borderColor: sdg.color, color: "#fff" }
                    : { backgroundColor: "transparent", borderColor: sdg.color, color: sdg.color }
                }
              >
                <span>{sdg.number}</span>
                <span>{sdg.title}</span>
              </button>
            )
          })}
        </div>
        {sdgFocus.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {sdgFocus.length} goal{sdgFocus.length > 1 ? "s" : ""} selected
            </p>
            <button
              type="button"
              onClick={async () => {
                const supabase = createClient()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await supabase.from("profiles").update({ sdg_focus: sdgFocus } as any).eq("id", userId)
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
              }}
              className="text-xs font-semibold text-brand-gold hover:text-amber-600 transition-colors"
            >
              Save SDG selection
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}
