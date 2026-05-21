"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { LoginSchema, type LoginInput } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import Input from "@/components/ui/Input"
import PasswordInput from "@/components/ui/PasswordInput"
import Link from "next/link"

type Role = "participant" | "mentor"
type Step = "role" | "credentials"

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export default function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("role")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) })

  async function onSubmit(data: LoginInput) {
    setError(null)
    setLoading(true)

    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError("Invalid email or password. Please try again.")
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      const profile = profileRaw as { role: string } | null
      router.push(profile?.role === "mentor" ? "/mentor" : "/dashboard")
    }
  }

  if (step === "role") {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-brand-navy mb-2">Sign in as a...</h2>
        <p className="text-gray-500 text-sm mb-6">Choose your role to continue</p>
        <div className="grid grid-cols-2 gap-4">
          {(["participant", "mentor"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setSelectedRole(r); setStep("credentials") }}
              className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-brand-gold ${selectedRole === r ? "border-brand-gold bg-brand-gold/5" : "border-gray-200"}`}
            >
              <div className="text-3xl mb-2">{r === "participant" ? "🎓" : "👨‍🏫"}</div>
              <div className="font-bold text-brand-navy capitalize">{r}</div>
              <div className="text-xs text-gray-500 mt-1">
                {r === "participant" ? "I'm here to grow my leadership" : "I'm here to guide youth leaders"}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setStep("role")}
          className="text-gray-400 hover:text-brand-navy transition-colors"
          aria-label="Back to role selection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm text-gray-500 capitalize">
          Signing in as <span className="font-semibold text-brand-navy">{selectedRole}</span>
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <div>
          <PasswordInput
            label="Password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end mt-1">
            <Link href="/forgot-password" className="text-xs text-brand-gold hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-navy text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-brand-navy/90 transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        type="button"
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <GoogleIcon />
        Sign in with Google
      </button>
    </div>
  )
}
