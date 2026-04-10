import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConditionalLayout from "@/components/layout/ConditionalLayout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "EGA Mentorship International",
  description:
    "Empowering youth leaders aged 18–30 across 6 countries with mentorship, leadership training, and SDG-aligned skills for sustainable global impact.",
  keywords: ["mentorship", "youth leadership", "SDGs", "EGA", "Ghana", "Africa", "education"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}
