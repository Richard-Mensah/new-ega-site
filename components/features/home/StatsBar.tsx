"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

type Stat = {
  value: string
  label: string
  prefix?: string
  suffix?: string
}

const STATS: Stat[] = [
  { value: "10,000", label: "Leaders Goal", suffix: "+" },
  { value: "6", label: "Countries" },
  { value: "17", label: "SDGs Focus" },
  { value: "98", label: "Satisfaction Rate", suffix: "%" },
]

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center px-6 py-4"
    >
      <div className="text-3xl md:text-4xl font-extrabold text-brand-navy">
        {stat.value}{stat.suffix}
      </div>
      <div className="text-sm md:text-base text-gray-500 mt-1 font-medium">{stat.label}</div>
    </motion.div>
  )
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section ref={ref} className="bg-brand-warm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
          {isInView && STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} />
          ))}
          {!isInView && STATS.map((stat) => (
            <div key={stat.label} className="text-center px-6 py-4">
              <div className="h-9 bg-gray-200 rounded animate-pulse mx-auto w-24" />
              <div className="h-4 bg-gray-100 rounded animate-pulse mx-auto w-20 mt-2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
