import Card from "@/components/ui/Card"
import SdgInteractiveBar from "@/components/features/dashboard/SdgInteractiveBar"

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
      <SdgInteractiveBar engagedSdgs={engagedSdgs} />
    </Card>
  )
}
