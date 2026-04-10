import { cn } from "@/lib/utils"

type Props = {
  label: string
  onClick?: () => void
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  className?: string
}

export default function Button({
  label,
  onClick,
  href,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className,
}: Props) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variants = {
    primary: "bg-brand-gold text-white hover:bg-amber-600 focus:ring-brand-gold",
    secondary:
      "border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white focus:ring-brand-navy",
    ghost: "text-brand-gold hover:bg-brand-gold/10 focus:ring-brand-gold",
  }

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
  }

  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    disabled && "opacity-50 cursor-not-allowed",
    className
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {label}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {label}
    </button>
  )
}
