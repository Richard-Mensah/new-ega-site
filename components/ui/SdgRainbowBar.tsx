import { SDG_LIST } from "@/lib/constants/sdgs"

type Props = {
  engagedSdgs?: number[]
  showLabels?: boolean
  height?: "sm" | "md" | "lg"
}

const heightClasses = {
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
}

export default function SdgRainbowBar({ engagedSdgs = [], showLabels = false, height = "md" }: Props) {
  return (
    <div className="w-full">
      <div className={`flex w-full ${heightClasses[height]} rounded-full overflow-hidden`}>
        {SDG_LIST.map((sdg) => {
          const isEngaged = engagedSdgs.includes(sdg.number)
          return (
            <div
              key={sdg.number}
              title={`SDG ${sdg.number}: ${sdg.title}`}
              className="flex-1 transition-opacity duration-300"
              style={{
                backgroundColor: sdg.color,
                opacity: engagedSdgs.length === 0 ? 1 : isEngaged ? 1 : 0.2,
              }}
            />
          )
        })}
      </div>
      {showLabels && (
        <div className="flex w-full mt-1">
          {SDG_LIST.map((sdg) => (
            <div key={sdg.number} className="flex-1 text-center">
              <span className="text-[8px] text-gray-500 font-medium">{sdg.number}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
