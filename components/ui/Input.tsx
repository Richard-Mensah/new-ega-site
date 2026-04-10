import { forwardRef } from "react"
import { cn } from "@/lib/utils"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent",
            "transition-colors duration-200",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
