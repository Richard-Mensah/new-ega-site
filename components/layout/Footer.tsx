import Image from "next/image"
import Link from "next/link"
import { Globe, X, Briefcase, Camera, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src="/images/ega-logo.png" alt="EGA" width={48} height={48} className="rounded-full" />
              <div>
                <p className="font-bold text-lg text-white">EGA Mentorship</p>
                <p className="text-xs text-white/60">International</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Empowering youth leaders aged 18–30 across 6 countries with mentorship, leadership, and SDG-aligned skills for sustainable global impact.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="p-2 rounded-lg bg-white/10 hover:bg-brand-gold transition-colors"><Globe size={16} /></a>
              <a href="#" aria-label="X / Twitter" className="p-2 rounded-lg bg-white/10 hover:bg-brand-gold transition-colors"><X size={16} /></a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg bg-white/10 hover:bg-brand-gold transition-colors"><Briefcase size={16} /></a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-lg bg-white/10 hover:bg-brand-gold transition-colors"><Camera size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-brand-gold font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About EGA" },
                { href: "/services", label: "Services" },
                { href: "/sdgs", label: "UN SDGs" },
                { href: "/team", label: "Our Team" },
                { href: "/blog", label: "Blog & News" },
                { href: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-brand-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-brand-gold font-semibold mb-4">Programs</h3>
            <ul className="space-y-2">
              {[
                { href: "/programs", label: "Mentorship Program" },
                { href: "/edu-consult", label: "Educational Consultancy" },
                { href: "/programs#leadership", label: "Leadership Training" },
                { href: "/programs#portfolio", label: "Portfolio Development" },
                { href: "/gallery", label: "Photo Gallery" },
                { href: "/register", label: "Apply Now" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-brand-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-brand-gold font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin size={16} className="text-brand-gold mt-0.5 shrink-0" />
                <span>East Legon, Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone size={16} className="text-brand-gold shrink-0" />
                <a href="tel:+233000000000" className="hover:text-brand-gold transition-colors">+233 000 000 000</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail size={16} className="text-brand-gold shrink-0" />
                <a href="mailto:info@egamentorship.org" className="hover:text-brand-gold transition-colors">info@egamentorship.org</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">© {new Date().getFullYear()} EGA Mentorship International. All rights reserved.</p>
          <p className="text-sm text-white/50">Building the Next Generation of World Changemakers</p>
        </div>
      </div>
    </footer>
  )
}
