export default function SessionsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-7 w-28 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-gray-200 rounded-xl" />
      </div>
      <div className="space-y-3">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-36 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
