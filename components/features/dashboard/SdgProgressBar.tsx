import SdgRainbowBar from "@/components/ui/SdgRainbowBar"
import Card from "@/components/ui/Card"

type Props = { engagedSdgs: number[] }

export default function SdgProgressBar({ engagedSdgs }: Props) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-brand-navy">SDG Progress</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {engagedSdgs.length} of 17 Goals engaged
          </p>
        </div>
        <span className="text-2xl font-extrabold text-brand-gold">{engagedSdgs.length}/17</span>
      </div>
      <SdgRainbowBar engagedSdgs={engagedSdgs} height="md" showLabels />
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-brand-gold inline-block" />
          Engaged
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
          Not yet started
        </div>
      </div>
    </Card>
  )
}
