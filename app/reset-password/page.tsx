import type { Metadata } from "next"
import ResetPasswordForm from "@/components/features/auth/ResetPasswordForm"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Set New Password | EGA Mentorship International",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/images/ega-logo.png" alt="EGA" width={64} height={64} className="mx-auto rounded-full" />
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">Set a new password</h1>
          <p className="text-gray-500 text-sm mt-1">Choose a strong password for your account</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
