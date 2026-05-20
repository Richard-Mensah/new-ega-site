import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SDG_LIST } from "@/lib/constants/sdgs"
import SdgRainbowBar from "@/components/ui/SdgRainbowBar"
import Link from "next/link"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return SDG_LIST.map((sdg) => ({ slug: sdg.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const sdg = SDG_LIST.find((s) => s.slug === slug)
  if (!sdg) return {}
  return {
    title: `SDG ${sdg.number}: ${sdg.title} | EGA Mentorship International`,
    description: sdg.description,
  }
}

export default async function SdgDetailPage({ params }: Props) {
  const { slug } = await params
  const sdg = SDG_LIST.find((s) => s.slug === slug)
  if (!sdg) return notFound()

  const prevSdg = SDG_LIST.find((s) => s.number === sdg.number - 1)
  const nextSdg = SDG_LIST.find((s) => s.number === sdg.number + 1)

  return (
    <div>
      {/* Hero */}
      <section className="py-20 text-white" style={{ backgroundColor: sdg.color }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-6xl font-extrabold opacity-30 mb-2">SDG {sdg.number}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold">{sdg.title}</h1>
          <p className="mt-6 text-lg text-white/90 leading-relaxed">{sdg.description}</p>
        </div>
      </section>

      {/* EGA Approach */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">EGA&apos;s Approach</h2>
          <div className="bg-brand-warm rounded-2xl p-8 border-l-4" style={{ borderColor: sdg.color }}>
            <p className="text-gray-700 text-lg leading-relaxed">{sdg.egaApproach}</p>
          </div>

          <div className="mt-12 bg-brand-navy rounded-2xl p-8 text-white">
            <h3 className="text-xl font-bold text-brand-gold mb-4">Take Action with EGA</h3>
            <p className="text-white/80 mb-6">
              Join EGA&apos;s mentorship program and make a real difference for SDG {sdg.number}: {sdg.title}. Work alongside mentors, design community projects, and build skills that drive sustainable change.
            </p>
            <Link href="/register" className="bg-brand-gold text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors inline-block">
              Apply to EGA
            </Link>
          </div>
        </div>
      </section>

      {/* SDG Rainbow Bar */}
      <section className="py-10 bg-brand-bg">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-4">All 17 UN Sustainable Development Goals</p>
          <SdgRainbowBar engagedSdgs={[sdg.number]} height="md" showLabels />
        </div>
      </section>

      {/* Navigation */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          {prevSdg ? (
            <Link href={`/sdgs/${prevSdg.slug}`} className="text-sm font-semibold text-brand-navy hover:text-brand-gold transition-colors">
              ← SDG {prevSdg.number}: {prevSdg.title}
            </Link>
          ) : <div />}
          <Link href="/sdgs" className="text-sm text-gray-500 hover:text-brand-navy transition-colors">
            All 17 SDGs
          </Link>
          {nextSdg ? (
            <Link href={`/sdgs/${nextSdg.slug}`} className="text-sm font-semibold text-brand-navy hover:text-brand-gold transition-colors">
              SDG {nextSdg.number}: {nextSdg.title} →
            </Link>
          ) : <div />}
        </div>
      </section>
    </div>
  )
}
