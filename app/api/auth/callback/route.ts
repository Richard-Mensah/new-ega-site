import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  const roleParam = searchParams.get("role") as "participant" | "mentor" | null

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth_failed", request.url))
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile) {
      // New OAuth user — create profile from Google metadata + role param
      const role = roleParam ?? "participant"
      const fullName =
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.email?.split("@")[0] ??
        "New User"
      const avatarUrl = user.user_metadata?.avatar_url ?? null

      await supabase.from("profiles").insert({
        id: user.id,
        role,
        full_name: fullName,
        avatar_url: avatarUrl,
      })

      return NextResponse.redirect(
        new URL(role === "mentor" ? "/mentor" : "/dashboard", request.url)
      )
    }

    // Existing user — redirect by stored role
    return NextResponse.redirect(
      new URL(profile.role === "mentor" ? "/mentor" : "/dashboard", request.url)
    )
  }

  return NextResponse.redirect(new URL(next, request.url))
}
