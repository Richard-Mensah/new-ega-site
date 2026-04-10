import type { Metadata } from "next"
import LoginForm from "@/components/features/auth/LoginForm"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Sign In | EGA Mentorship International",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/images/ega-logo.png" alt="EGA" width={64} height={64} className="mx-auto rounded-full" />
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your EGA dashboard</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-gold font-semibold hover:underline">
            Apply to EGA
          </Link>
        </p>
      </div>
    </div>
  )
}
