import type { HabitMonthStats } from '@/lib/habits/calculations'
import type { Habit } from '@/lib/habits/types'

interface HabitAnalysisRowProps {
  habit: Habit
  stats: HabitMonthStats
  streak: number
  onClick: () => void
}

export function HabitAnalysisRow({ habit, stats, streak, onClick }: HabitAnalysisRowProps) {
  return (
    <button type="button" onClick={onClick} className="w-full rounded-card bg-card p-4 text-left">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: `${habit.color}26` }}
        >
          {habit.icon}
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium">{habit.name}</span>
          <span className="block text-xs text-muted">
            {stats.actual}/{stats.goal} ngày · Còn {stats.left} ngày
          </span>
        </span>
        {streak > 0 && (
          <span className="flex items-center gap-1 rounded-pill bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger">
            🔥 {streak}
          </span>
        )}
      </div>

      <div className="relative mt-3 h-1.5 rounded-pill bg-card-soft">
        <div
          className="h-full rounded-pill"
          style={{ width: `${Math.min(1, stats.progress) * 100}%`, backgroundColor: habit.color }}
        />
      </div>
    </button>
  )
}
