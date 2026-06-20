import { formatVND } from '@/lib/money/calculations'

interface BudgetGaugeProps {
  canSpend: number
  totalBudget: number
}

const CX = 100
const CY = 100
const R = 80

function pointAt(thetaDeg: number, radius: number) {
  const rad = (thetaDeg * Math.PI) / 180
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) }
}

export function BudgetGauge({ canSpend, totalBudget }: BudgetGaugeProps) {
  const progress = totalBudget > 0 ? Math.min(1, Math.max(0, canSpend / totalBudget)) : 0
  const theta = 180 - progress * 180
  const start = pointAt(180, R)
  const trackEnd = pointAt(0, R)
  const progressEnd = pointAt(theta, R)
  const needle = pointAt(theta, 58)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-full max-w-[260px]">
        <path
          d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke="var(--color-card-soft)"
          strokeWidth={14}
          strokeLinecap="round"
        />
        {progress > 0 && (
          <path
            d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${progressEnd.x} ${progressEnd.y}`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={14}
            strokeLinecap="round"
          />
        )}
        <line x1={CX} y1={CY} x2={needle.x} y2={needle.y} stroke="var(--color-text)" strokeWidth={3} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={5} fill="var(--color-text)" />
      </svg>
      <p className="-mt-2 text-xs text-muted">Số tiền bạn có thể chi</p>
      <p className="text-2xl font-bold text-accent">{formatVND(canSpend)}</p>
    </div>
  )
}
