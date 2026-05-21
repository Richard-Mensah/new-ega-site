"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { RegisterSchema, type RegisterInput } from "@/lib/validations"
import { createClient } from "@/lib/supabase/client"
import { SDG_LIST } from "@/lib/constants/sdgs"
import { COUNTRIES } from "@/lib/constants/team"
import Input from "@/components/ui/Input"
import PasswordInput from "@/components/ui/PasswordInput"

type Step = 1 | 2 | 3

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

export default function RegisterForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedSdgs, setSelectedSdgs] = useState<number[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(RegisterSchema), defaultValues: { sdg_focus: [] } })

  const role = watch("role")

  async function signUpWithGoogle() {
    const supabase = createClient()
    const currentRole = watch("role") ?? "participant"
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?role=${currentRole}`,
      },
    })
  }

  function toggleSdg(num: number) {
    setSelectedSdgs((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    )
  }

  async function onSubmit(data: RegisterInput) {
    setError(null)
    setSuccessMessage(null)
    setLoading(true)
    setValue("sdg_focus", selectedSdgs)

    try {
      const supabase = createClient()
      const redirectTo = `${window.location.origin}/api/auth/callback?next=${
        data.role === "mentor" ? "/mentor" : "/dashboard"
      }`

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            role: data.role,
            full_name: data.full_name,
            country: data.country,
          },
        },
      })

      if (authError) {
        if (authError.message.toLowerCase().includes("rate limit")) {
          setError("Too many sign-up attempts. Please check your inbox for a confirmation email, or wait a few minutes before trying again.")
        } else {
          setError(authError.message)
        }
        return
      }

      if (!authData.session) {
        setSuccessMessage("Check your email to confirm your account, then sign in to continue.")
        return
      }

      router.push(data.role === "mentor" ? "/mentor" : "/dashboard")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Step indicators */}
      <div className="flex gap-2 mb-8">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full ${step >= s ? "bg-brand-gold" : "bg-gray-200"}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Role */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-brand-navy mb-2">I want to join as a...</h2>
            <p className="text-gray-500 text-sm mb-6">Choose your role in the EGA community</p>
            <div className="grid grid-cols-2 gap-4">
              {(["participant", "mentor"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => { setValue("role", r); setStep(2) }}
                  className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-brand-gold ${role === r ? "border-brand-gold bg-brand-gold/5" : "border-gray-200"}`}
                >
                  <div className="text-3xl mb-2">{r === "participant" ? "🎓" : "👨‍🏫"}</div>
                  <div className="font-bold text-brand-navy capitalize">{r}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {r === "participant" ? "I want to grow my leadership skills" : "I want to guide and mentor youth leaders"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-brand-navy mb-4">Your Details</h2>
            <Input label="Full Name" placeholder="Your full name" error={errors.full_name?.message} {...register("full_name")} />
            <Input label="Email Address" type="email" placeholder="you@email.com" error={errors.email?.message} {...register("email")} />
            <PasswordInput label="Password" placeholder="Min 8 characters" error={errors.password?.message} {...register("password")} />
            <PasswordInput label="Confirm Password" placeholder="Repeat your password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-gold" {...register("country")}>
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.country && <span className="text-sm text-red-600">{errors.country.message}</span>}
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-brand-navy transition-colors">Back</button>
              <button type="button" onClick={() => setStep(role === "participant" ? 3 : 3)} className="flex-1 bg-brand-navy text-white py-3 rounded-xl font-semibold hover:bg-brand-navy/90 transition-colors">Continue</button>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={signUpWithGoogle}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl py-3 font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors mt-2"
            >
              <GoogleIcon />
              Sign up with Google
            </button>
          </div>
        )}

        {/* Step 3: SDG Interests + Submit */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-brand-navy mb-2">SDG Interests</h2>
            <p className="text-gray-500 text-sm mb-4">Select the UN SDGs you&apos;re most passionate about (optional)</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-6 max-h-60 overflow-y-auto pr-1">
              {SDG_LIST.map((sdg) => (
                <button
                  key={sdg.number}
                  type="button"
                  onClick={() => toggleSdg(sdg.number)}
                  className={`p-2 rounded-xl border-2 text-center text-xs font-semibold transition-all ${selectedSdgs.includes(sdg.number) ? "border-current text-white" : "border-gray-200 text-gray-600"}`}
                  style={selectedSdgs.includes(sdg.number) ? { backgroundColor: sdg.color, borderColor: sdg.color } : {}}
                >
                  <div className="font-bold text-lg">{sdg.number}</div>
                  <div className="leading-tight">{sdg.title}</div>
                </button>
              ))}
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
                {successMessage}
              </div>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold">Back</button>
              <button type="submit" disabled={loading} className="flex-1 bg-brand-gold text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors disabled:opacity-60">
                {loading ? "Creating account..." : "Complete Registration"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
