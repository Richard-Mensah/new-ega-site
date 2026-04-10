import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SettingsForm from "@/components/features/dashboard/SettingsForm"
import type { Tables } from "@/types/database"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const profile = profileRaw as Tables<"profiles"> | null

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Update your profile and preferences</p>
      </div>
      <SettingsForm
        userId={user.id}
        defaultValues={{
          full_name: profile?.full_name ?? "",
          country: profile?.country ?? "",
          bio: profile?.bio ?? "",
        }}
      />
    </div>
  )
}
