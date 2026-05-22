import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "rmensahuk@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean)

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!ADMIN_EMAILS.includes(user.email ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { profileId, updates } = await request.json()
  if (!profileId) return NextResponse.json({ error: "Missing profileId" }, { status: 400 })

  type ProfileUpdate = {
    full_name?: string
    role?: "participant" | "mentor"
    country?: string | null
    bio?: string | null
    organization?: string | null
    linkedin_url?: string | null
  }
  const allowed: ProfileUpdate = {}
  if ("full_name" in updates) allowed.full_name = updates.full_name
  if ("role" in updates) allowed.role = updates.role
  if ("country" in updates) allowed.country = updates.country
  if ("bio" in updates) allowed.bio = updates.bio
  if ("organization" in updates) allowed.organization = updates.organization
  if ("linkedin_url" in updates) allowed.linkedin_url = updates.linkedin_url

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
  }

  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("profiles")
      .update(allowed)
      .eq("id", profileId)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ profile: data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
