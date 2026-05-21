export default function AnalyticsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-7 w-36 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-2">
            <div className="h-8 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-3 bg-gray-100 rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
