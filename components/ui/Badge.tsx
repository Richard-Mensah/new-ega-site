import { cn } from "@/lib/utils"

type Props = {
  label: string
  color?: "gold" | "navy" | "green" | "red" | "blue" | "gray"
  size?: "sm" | "md"
}

export default function Badge({ label, color = "gold", size = "sm" }: Props) {
  const colors = {
    gold: "bg-brand-gold/10 text-amber-800 border border-brand-gold/30",
    navy: "bg-brand-navy/10 text-brand-navy border border-brand-navy/30",
    green: "bg-green-50 text-green-800 border border-green-200",
    red: "bg-red-50 text-red-800 border border-red-200",
    blue: "bg-blue-50 text-blue-800 border border-blue-200",
    gray: "bg-gray-100 text-gray-700 border border-gray-200",
  }

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  }

  return (
    <span className={cn("inline-flex items-center rounded-full font-medium", colors[color], sizes[size])}>
      {label}
    </span>
  )
}
