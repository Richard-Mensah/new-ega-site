export default function ProjectsLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-7 w-36 bg-gray-200 rounded-lg" />
          <div className="h-4 w-56 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-gray-200 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 space-y-2">
            <div className="h-7 w-8 bg-gray-200 rounded mx-auto" />
            <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
            <div className="h-3 w-16 bg-gray-100 rounded mx-auto" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
              <div className="h-3 w-64 bg-gray-100 rounded" />
            </div>
            <div className="space-y-1.5 shrink-0">
              <div className="h-5 w-24 bg-gray-200 rounded-full" />
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
