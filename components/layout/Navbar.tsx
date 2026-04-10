"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/sdgs", label: "SDGs" },
  { href: "/programs", label: "Programs" },
  { href: "/team", label: "Team" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/images/ega-logo.png"
              alt="EGA Mentorship International"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-lg font-bold text-white hidden sm:block">EGA Mentorship</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/80 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-brand-gold text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("lg:hidden border-t border-white/10", mobileOpen ? "block" : "hidden")}>
        <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 border-t border-white/10 mt-2">
            <Link href="/login" className="flex-1 text-center py-2 text-white/80 hover:text-white transition-colors text-sm">
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 text-center bg-brand-gold text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
            >
              Join Us
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
