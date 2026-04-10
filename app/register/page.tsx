import type { Metadata } from "next"
import RegisterForm from "@/components/features/auth/RegisterForm"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Apply to EGA | EGA Mentorship International",
  description: "Apply to EGA Mentorship International's 2-year leadership program. Open to youth aged 18–30 across 6 countries.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-brand-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/images/ega-logo.png" alt="EGA" width={64} height={64} className="mx-auto rounded-full" />
          </Link>
          <h1 className="mt-4 text-3xl font-extrabold text-brand-navy">Apply to EGA</h1>
          <p className="text-gray-500 text-sm mt-1">Join our global leadership program — free to apply, open to all</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-gold font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
