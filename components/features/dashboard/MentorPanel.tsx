import Card from "@/components/ui/Card"
import Link from "next/link"
import { MapPin, Calendar } from "lucide-react"

type Props = {
  mentor: { full_name: string; country: string | null; avatar_url: string | null } | null
}

export default function MentorPanel({ mentor }: Props) {
  if (!mentor) {
    return (
      <Card>
        <h3 className="font-bold text-brand-navy mb-4">Your Mentor</h3>
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">👤</div>
          <p className="text-sm">Mentor assignment in progress</p>
          <p className="text-xs mt-1">You&apos;ll be matched with a mentor soon</p>
        </div>
      </Card>
    )
  }

  return (
    <Card accent="gold">
      <h3 className="font-bold text-brand-navy mb-4">Your Mentor</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-brand-navy/10 border-2 border-brand-gold flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-brand-navy">
            {mentor.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="font-bold text-brand-navy">{mentor.full_name}</p>
          {mentor.country && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin size={10} />
              <span>{mentor.country}</span>
            </div>
          )}
        </div>
      </div>
      <Link
        href="/dashboard/mentor"
        className="flex items-center justify-center gap-2 w-full bg-brand-gold text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
      >
        <Calendar size={14} />
        View Mentor Profile
      </Link>
    </Card>
  )
}
