import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG or WebP images are allowed" }, { status: 400 })
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 2 MB" }, { status: 400 })
    }

    const bytes = new Uint8Array(await file.arrayBuffer())
    const path = `${user.id}/avatar.jpg`

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, bytes, { upsert: true, contentType: file.type })

    if (uploadError) {
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 })
    }

    // Build public URL with cache-bust
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path)
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`

    // Update profiles — use .select().single() so a silent RLS block surfaces as an error
    const { data: updated, error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id)
      .select("avatar_url")
      .single()

    if (updateError || !updated) {
      return NextResponse.json({
        error: updateError?.message ?? "Profile update was blocked. Run the profiles UPDATE policy SQL in Supabase.",
      }, { status: 500 })
    }

    return NextResponse.json({ url: publicUrl })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
