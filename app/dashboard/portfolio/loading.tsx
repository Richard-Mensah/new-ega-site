export default function PortfolioLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-7 w-36 bg-gray-200 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-28 bg-gray-200 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 space-y-2">
            <div className="h-8 w-12 bg-gray-200 rounded" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-200 rounded-full" />
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
