'use client'

import type { WellnessLog } from '@/lib/habits/types'

const MOODS: { value: number; icon: string; label: string }[] = [
  { value: 1, icon: '😞', label: 'Tệ' },
  { value: 2, icon: '🙁', label: 'Không tốt' },
  { value: 3, icon: '😐', label: 'Bình thường' },
  { value: 4, icon: '🙂', label: 'Tốt' },
  { value: 5, icon: '😄', label: 'Tuyệt vời' },
]

interface WellnessFormProps {
  log: WellnessLog | undefined
  onChange: (patch: Partial<Pick<WellnessLog, 'mood' | 'sleepHours'>>) => void
}

export function WellnessForm({ log, onChange }: WellnessFormProps) {
  return (
    <div className="rounded-card bg-card p-4">
      <p className="text-xs font-medium text-muted">Tâm trạng hôm nay</p>
      <div className="mt-2 flex justify-between">
        {MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange({ mood: log?.mood === m.value ? null : m.value })}
            aria-pressed={log?.mood === m.value}
            aria-label={m.label}
            className={`flex h-12 w-12 flex-col items-center justify-center rounded-full text-2xl transition-transform ${
              log?.mood === m.value ? 'scale-110 bg-accent-soft ring-2 ring-accent' : 'bg-card-soft'
            }`}
          >
            {m.icon}
          </button>
        ))}
      </div>

      <p className="mt-5 text-xs font-medium text-muted">Số giờ ngủ</p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange({ sleepHours: Math.max(0, (log?.sleepHours ?? 0) - 0.5) })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card-soft text-lg"
          aria-label="Giảm giờ ngủ"
        >
          −
        </button>
        <span className="flex-1 text-center text-lg font-semibold">
          {log?.sleepHours != null ? `${log.sleepHours}h` : '—'}
        </span>
        <button
          type="button"
          onClick={() => onChange({ sleepHours: Math.min(24, (log?.sleepHours ?? 0) + 0.5) })}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card-soft text-lg"
          aria-label="Tăng giờ ngủ"
        >
          +
        </button>
      </div>
    </div>
  )
}
