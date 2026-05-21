"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import Input from "@/components/ui/Input"

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
type FormInput = z.infer<typeof schema>

export default function ResetPasswordForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormInput) {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.updateUser({ password: data.password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    router.push("/dashboard")
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="New Password"
          type="password"
          placeholder="Min 8 characters"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Repeat your new password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
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
          {loading ? "Saving..." : "Set New Password"}
        </button>
      </form>
    </div>
  )
}
