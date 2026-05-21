import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

const attempts = new Map<string, number[]>()

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const hits = (attempts.get(key) ?? []).filter((t) => t > windowStart)
  if (hits.length >= MAX_ATTEMPTS) {
    attempts.set(key, hits)
    return false
  }
  hits.push(now)
  attempts.set(key, hits)
  return true
}

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  const emailKey = `email:${(email ?? "").toLowerCase()}`
  const ipKey = `ip:${ip}`

  console.log(`[forgot-password] attempt ip=${ip} email=${email}`)

  if (!checkRateLimit(emailKey) || !checkRateLimit(ipKey)) {
    console.warn(`[forgot-password] rate limited ip=${ip} email=${email}`)
    return NextResponse.json(
      { error: "Too many reset requests. Please check your inbox for an existing reset email, or wait a few minutes before trying again." },
      { status: 429 }
    )
  }

  const supabase = await createClient()
  const origin = request.headers.get("origin") ?? ""
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  })

  if (error) {
    console.error(`[forgot-password] error ip=${ip} email=${email} message=${error.message}`)
    if (error.message.toLowerCase().includes("rate limit")) {
      return NextResponse.json(
        { error: "Too many reset requests. Please check your inbox or wait a few minutes." },
        { status: 429 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  console.log(`[forgot-password] sent ip=${ip} email=${email}`)
  return NextResponse.json({ ok: true })
}
