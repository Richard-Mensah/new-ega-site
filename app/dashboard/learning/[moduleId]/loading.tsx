export default function ModuleDetailLoading() {
  return (
    <div className="p-6 space-y-8 max-w-3xl animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-28 bg-gray-200 rounded" />
        <div className="h-3 w-3 bg-gray-100 rounded" />
        <div className="h-4 w-36 bg-gray-200 rounded" />
      </div>

      {/* Module header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-14 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-gray-100 rounded" />
            <div className="h-6 w-56 bg-gray-200 rounded" />
            <div className="h-3 w-40 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-4/5 bg-gray-100 rounded" />
          <div className="h-3 w-3/5 bg-gray-100 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-36 bg-gray-200 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3.5 w-3.5 bg-gray-200 rounded-full shrink-0" />
              <div className="h-3 bg-gray-100 rounded" style={{ width: `${60 + i * 8}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-5">
        <div className="h-5 w-44 bg-gray-200 rounded" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-4 w-6 bg-gray-100 rounded" />
              <div className="h-5 w-48 bg-gray-200 rounded" />
            </div>
            <div className="space-y-1.5 pl-4 border-l-2 border-gray-100">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded" />
              <div className="h-3 w-4/6 bg-gray-100 rounded" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3.5 w-2/3 bg-gray-200 rounded" />
                    <div className="h-2.5 w-1/2 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="h-3 w-48 bg-gray-100 rounded" />
              <div className="h-9 w-36 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
