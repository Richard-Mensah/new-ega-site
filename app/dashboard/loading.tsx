export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Welcome card skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 h-28">
        <div className="h-5 bg-gray-200 rounded w-48 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-32" />
      </div>

      {/* Metric cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 h-24">
            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
            <div className="h-6 bg-gray-100 rounded w-10" />
          </div>
        ))}
      </div>

      {/* SDG bar skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 h-20">
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>

      {/* Activity / Mentor panel skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-3/5" />
          </div>
        ))}
      </div>
    </div>
  )
}
