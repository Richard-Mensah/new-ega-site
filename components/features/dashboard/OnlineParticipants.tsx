import Link from "next/link"
import { Users } from "lucide-react"
import Card from "@/components/ui/Card"

type OnlineUser = {
  id: string
  full_name: string
  avatar_url: string | null
}

interface Props {
  users: OnlineUser[]
}

function Avatar({ user }: { user: OnlineUser }) {
  const initials = user.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" title={user.full_name}>
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user.full_name}
          className="w-8 h-8 rounded-full object-cover border-2 border-white"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-brand-navy border-2 border-white flex items-center justify-center">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      )}
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
    </div>
  )
}

export default function OnlineParticipants({ users }: Props) {
  const visible = users.slice(0, 8)
  const overflow = users.length - visible.length

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <h3 className="font-bold text-brand-navy">Online Now</h3>
          {users.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              {users.length}
            </span>
          )}
        </div>
        <Link
          href="/dashboard/community"
          className="text-xs text-brand-gold hover:text-amber-600 font-semibold transition-colors"
        >
          View all →
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-4 gap-2 text-gray-400">
          <Users size={28} className="opacity-30" />
          <p className="text-sm">No one else online right now</p>
        </div>
      ) : (
        <div className="flex items-center gap-1 flex-wrap">
          {visible.map((u) => (
            <Avatar key={u.id} user={u} />
          ))}
          {overflow > 0 && (
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-500">+{overflow}</span>
            </div>
          )}
          <p className="w-full mt-2 text-xs text-gray-400">
            {users.length === 1
              ? "1 participant active in the last 15 minutes"
              : `${users.length} participants active in the last 15 minutes`}
          </p>
        </div>
      )}
    </Card>
  )
}
