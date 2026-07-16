'use client'

import { useHabitsStore } from '@/lib/habits/store'
import { WellnessForm } from '@/components/habits/WellnessForm'
import { WellnessTrendChart } from '@/components/habits/WellnessTrendChart'
import { formatDayMonth, getAverageMood, getAverageSleep, parseISODate, toISODate } from '@/lib/habits/calculations'

const MOOD_ICONS = ['', '😞', '🙁', '😐', '🙂', '😄']

function lastNDates(n: number, today: Date): string[] {
  const dates: string[] = []
  const cursor = new Date(today)
  for (let i = 0; i < n; i++) {
    dates.push(toISODate(cursor))
    cursor.setDate(cursor.getDate() - 1)
  }
  return dates.reverse()
}

export default function HabitsWellnessPage() {
  const wellnessLogs = useHabitsStore((s) => s.wellnessLogs)
  const setWellness = useHabitsStore((s) => s.setWellness)

  const today = new Date()
  const todayISO = toISODate(today)
  const todayLog = wellnessLogs.find((w) => w.date === todayISO)

  const recentDates = lastNDates(14, today)
  const recentLogs = recentDates.map(
    (date) => wellnessLogs.find((w) => w.date === date) ?? { id: date, date, mood: null, sleepHours: null },
  )
  const last30 = wellnessLogs.filter((w) => w.date >= toISODate(new Date(today.getTime() - 29 * 86_400_000)))
  const avgMood = getAverageMood(last30)
  const avgSleep = getAverageSleep(last30)

  return (
    <div>
      <div className="px-4 pt-6">
        <h1 className="text-lg font-bold">Sức khoẻ</h1>
        <p className="text-sm text-muted">Tâm trạng & giấc ngủ mỗi ngày</p>
      </div>

      <div className="mt-4 px-4">
        <WellnessForm log={todayLog} onChange={(patch) => setWellness(todayISO, patch)} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 px-4">
        <div className="rounded-card bg-card p-4 text-center">
          <p className="text-xs text-muted">TB tâm trạng (30 ngày)</p>
          <p className="mt-1 text-lg font-bold">{avgMood != null ? avgMood.toFixed(1) : '—'}</p>
        </div>
        <div className="rounded-card bg-card p-4 text-center">
          <p className="text-xs text-muted">TB giờ ngủ (30 ngày)</p>
          <p className="mt-1 text-lg font-bold">{avgSleep != null ? `${avgSleep.toFixed(1)}h` : '—'}</p>
        </div>
      </div>

      <div className="mx-4 mt-4 rounded-card bg-card p-4">
        <p className="mb-2 text-xs font-medium text-muted">Xu hướng 14 ngày qua</p>
        <WellnessTrendChart logs={recentLogs} />
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full" style={{ backgroundColor: '#38bdf8' }} /> Giờ ngủ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-3 rounded-full" style={{ backgroundColor: '#f5a524' }} /> Tâm trạng
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 px-4 pb-6">
        {[...recentLogs].reverse().map((log) => (
          <div key={log.date} className="flex items-center justify-between rounded-card bg-card px-4 py-3 text-sm">
            <span className="text-muted">{formatDayMonth(parseISODate(log.date))}</span>
            <span className="flex items-center gap-4">
              <span>{log.mood != null ? MOOD_ICONS[log.mood] : '—'}</span>
              <span className="text-muted">{log.sleepHours != null ? `${log.sleepHours}h` : '—'}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
