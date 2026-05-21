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

export default function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("role")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    </div>
  )
}
