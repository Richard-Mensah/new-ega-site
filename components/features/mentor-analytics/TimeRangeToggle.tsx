"use client"

type Range = "1M" | "3M" | "6M"

type Props = {
  value: Range
  onChange: (r: Range) => void
}

const OPTIONS: Range[] = ["1M", "3M", "6M"]

export default function TimeRangeToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            value === opt
              ? "bg-brand-navy text-white shadow-sm"
              : "text-gray-500 hover:text-brand-navy"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
