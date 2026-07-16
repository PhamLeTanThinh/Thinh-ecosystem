interface HabitDonutProps {
  percent: number // 0-1
  label: string
  sublabel: string
}

const R = 70
const CIRCUMFERENCE = 2 * Math.PI * R

export function HabitDonut({ percent, label, sublabel }: HabitDonutProps) {
  const clamped = Math.min(1, Math.max(0, percent))
  const dashOffset = CIRCUMFERENCE * (1 - clamped)

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 160 160" className="w-40 -rotate-90">
        <circle cx={80} cy={80} r={R} fill="none" stroke="var(--color-card-soft)" strokeWidth={14} />
        <circle
          cx={80}
          cy={80}
          r={R}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-accent">{Math.round(clamped * 100)}%</span>
        <span className="text-xs text-muted">{label}</span>
        <span className="mt-0.5 text-[11px] text-muted">{sublabel}</span>
      </div>
    </div>
  )
}
