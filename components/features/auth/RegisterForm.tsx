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

type Step = 1 | 2 | 3

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
            <Input label="Password" type="password" placeholder="Min 8 characters" error={errors.password?.message} {...register("password")} />
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
