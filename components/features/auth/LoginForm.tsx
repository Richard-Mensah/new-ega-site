"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { LoginSchema, type LoginInput } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import Input from "@/components/ui/Input"

export default function LoginForm() {
  const router = useRouter()
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

    // Get profile to determine role-based redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profileRaw } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      const profile = profileRaw as { role: string } | null
      router.push(profile?.role === "mentor" ? "/mentor" : "/dashboard")
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          error={errors.password?.message}
          {...register("password")}
        />

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
