export default function LearningLoading() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      <div className="space-y-1">
        <div className="h-7 w-40 bg-gray-200 rounded-lg" />
        <div className="h-4 w-56 bg-gray-100 rounded" />
      </div>

      {/* Progress card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-52 bg-gray-100 rounded" />
          </div>
          <div className="h-8 w-14 bg-gray-200 rounded" />
        </div>
        <div className="h-3 bg-gray-100 rounded-full" />
      </div>

      {/* Phase 1 */}
      {[1, 2].map((phase) => (
        <div key={phase} className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-5 w-44 bg-gray-100 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-10 bg-gray-200 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-4/5 bg-gray-100 rounded" />
                <div className="h-1.5 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
