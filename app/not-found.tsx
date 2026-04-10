import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-brand-navy/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-brand-navy">404</span>
        </div>
        <h1 className="text-2xl font-bold text-brand-navy mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-navy/90 transition-colors"
          >
            <Home size={16} />
            Go Home
          </Link>
          <Link
            href="javascript:history.back()"
            className="inline-flex items-center gap-2 border border-brand-navy text-brand-navy px-6 py-3 rounded-xl font-semibold hover:bg-brand-navy/5 transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-8">
          EGA Mentorship International
        </p>
      </div>
    </div>
  )
}
