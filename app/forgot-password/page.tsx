import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Forgot Password | EGA Mentorship International",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/images/ega-logo.png" alt="EGA" width={64} height={64} className="mx-auto rounded-full" />
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">Reset your password</h1>
          <p className="text-gray-500 text-sm mt-1">Enter your email and we&apos;ll send you a reset link</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
