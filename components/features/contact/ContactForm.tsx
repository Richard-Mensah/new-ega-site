"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ContactSchema, type ContactInput } from "@/lib/validations"
import Input from "@/components/ui/Input"

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(ContactSchema) })

  async function onSubmit(data: ContactInput) {
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSubmitted(true)
        reset()
      } else {
        setError("Failed to send your message. Please try again.")
      }
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-brand-navy mb-2">Message Sent!</h2>
        <p className="text-gray-600">Thank you for reaching out. Our team will get back to you within 24–48 hours.</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-brand-gold font-semibold hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-brand-navy mb-6">Send Us a Message</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="Your name" error={errors.name?.message} {...register("name")} />
          <Input label="Email Address" type="email" placeholder="you@email.com" error={errors.email?.message} {...register("email")} />
        </div>
        <Input label="Subject" placeholder="What is this about?" error={errors.subject?.message} {...register("subject")} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Message</label>
          <textarea
            placeholder="Write your message here..."
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent resize-none"
            {...register("message")}
          />
          {errors.message && <span className="text-sm text-red-600">{errors.message.message}</span>}
        </div>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-brand-navy text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-brand-navy/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  )
}
