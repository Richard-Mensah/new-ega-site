"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { useMenteeGrowth } from "@/hooks/useMenteeGrowth"
import { useState } from "react"
import TimeRangeToggle from "@/components/features/mentor-analytics/TimeRangeToggle"
import Card from "@/components/ui/Card"

type Range = "1M" | "3M" | "6M"

// Distinct colors for mentee lines
const LINE_COLORS = [
  "#0D1B4B", // navy
  "#C9A84C", // gold (top performer)
  "#2563EB", // blue
  "#16A34A", // green
  "#DC2626", // red
  "#7C3AED", // purple
]

export default function GrowthChart() {
  const [range, setRange] = useState<Range>("3M")
  const { data, menteeNames, loading } = useMenteeGrowth(range)

  const menteeIds = data.length > 0
    ? Object.keys(data[0].scores)
    : []

  // Find top performer (highest latest score)
  const topPerformerId = menteeIds.reduce<string | null>((top, id) => {
    if (!data.length) return top
    const latest = data[data.length - 1].scores[id] ?? 0
    if (!top) return id
    const topScore = data[data.length - 1].scores[top] ?? 0
    return latest > topScore ? id : top
  }, null)

  const chartData = data.map((d) => ({
    week: d.week,
    ...Object.fromEntries(
      Object.entries(d.scores).map(([id, score]) => [
        menteeNames[id] ?? id.slice(0, 6),
        score,
      ])
    ),
  }))

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-brand-navy text-lg">Mentee Growth</h3>
          <p className="text-sm text-gray-500 mt-0.5">Skill score over time (0–100)</p>
        </div>
        <TimeRangeToggle value={range} onChange={setRange} />
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading chart data...</p>
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm font-medium">No growth data yet</p>
            <p className="text-xs mt-1">Milestone scores will appear here as you record them</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {menteeIds.map((id, i) => {
              const name = menteeNames[id] ?? id.slice(0, 6)
              const isTop = id === topPerformerId
              const color = isTop ? "#C9A84C" : LINE_COLORS[i % LINE_COLORS.length]
              return (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={name}
                  stroke={color}
                  strokeWidth={isTop ? 3 : 2}
                  dot={{ r: isTop ? 4 : 3 }}
                  activeDot={{ r: 6 }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
