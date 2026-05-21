"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import Input from "@/components/ui/Input"
import Link from "next/link"

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
})
type FormInput = z.infer<typeof schema>

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
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
    const { error: authError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (authError) {
      if (authError.message.toLowerCase().includes("rate limit")) {
        setError("Too many requests. Please check your inbox for an existing reset email, or wait a few minutes before trying again.")
      } else {
        setError(authError.message)
      }
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="text-4xl mb-4">✉️</div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">Check your inbox</h2>
        <p className="text-gray-500 text-sm">
          We&apos;ve sent a password reset link to your email address. Click the link to set a new password.
        </p>
        <p className="text-gray-400 text-xs mt-4">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            onClick={() => setSent(false)}
            className="text-brand-gold hover:underline"
          >
            try again
          </button>
          .
        </p>
      </div>
    )
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
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        <Link href="/login" className="text-brand-gold hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  )
}
