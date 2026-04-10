import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
  accent?: "gold" | "navy" | "green" | "blue" | "none"
}

export default function Card({ children, className, accent = "none" }: Props) {
  const accentStyles = {
    gold: "border-l-4 border-l-brand-gold",
    navy: "border-l-4 border-l-brand-navy",
    green: "border-l-4 border-l-green-500",
    blue: "border-l-4 border-l-blue-500",
    none: "",
  }

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
        accentStyles[accent],
        className
      )}
    >
      {children}
    </div>
  )
}
