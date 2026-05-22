"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Clock, XCircle } from "lucide-react"
import RequestMentorModal, { type PickableMentor } from "@/components/features/mentor/RequestMentorModal"

type Props = {
  status: "none" | "pending" | "declined"
  adminNote?: string | null
  submittedAt?: string | null
  focusAreas?: string[] | null
  mentors?: PickableMentor[]
}

export default function MentorRequestSection({ status, adminNote, submittedAt, focusAreas, mentors = [] }: Props) {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  if (status === "none") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🤝</div>
          <h2 className="text-xl font-bold text-brand-navy">Request Mentor Support</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
            Choose a specific mentor or let our team find the best fit for your goals.
          </p>
          <button
            type="button"
            className="mt-6 px-6 py-3 bg-brand-gold text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition-colors"
            onClick={() => setShowModal(true)}
          >
            Request a Mentor
          </button>
        </div>
        {showModal && (
          <RequestMentorModal
            mentors={mentors}
            onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); router.refresh() }}
          />
        )}
      </div>
    )
  }

  if (status === "pending") {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 rounded-xl p-3">
            <Clock size={24} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-amber-800 text-lg">Request Under Review</h2>
            <p className="text-amber-700 text-sm mt-1">
              Your mentor request has been submitted and is being reviewed.
            </p>
            {focusAreas && focusAreas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {focusAreas.map((fa) => (
                  <span key={fa} className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                    {fa}
                  </span>
                ))}
              </div>
            )}
            {submittedAt && (
              <p className="text-xs text-amber-600 mt-3">
                Submitted {new Date(submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="bg-red-100 rounded-xl p-3">
          <XCircle size={24} className="text-red-500" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-red-800 text-lg">Request Not Matched</h2>
          {adminNote && (
            <p className="text-red-700 text-sm mt-1">{adminNote}</p>
          )}
          <p className="text-red-600 text-sm mt-2">You can submit a new request at any time.</p>
          <button
            type="button"
            className="mt-4 px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
            onClick={() => setShowModal(true)}
          >
            Request Again
          </button>
        </div>
      </div>
      {showModal && (
        <RequestMentorModal
          mentors={mentors}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); router.refresh() }}
        />
      )}
    </div>
  )
}
