'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDayMonth, parseISODate } from '@/lib/habits/calculations'
import type { WellnessLog } from '@/lib/habits/types'

interface WellnessTrendChartProps {
  logs: WellnessLog[] // sorted ascending by date
}

export function WellnessTrendChart({ logs }: WellnessTrendChartProps) {
  const rows = logs.map((log) => ({ date: log.date, mood: log.mood, sleep: log.sleepHours }))

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatDayMonth(parseISODate(value))}
            tick={{ fill: '#71717a', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis yAxisId="sleep" hide domain={[0, 12]} />
          <YAxis yAxisId="mood" hide domain={[1, 5]} orientation="right" />
          <Tooltip
            contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: '#71717a' }}
            labelFormatter={(value) => (typeof value === 'string' ? formatDayMonth(parseISODate(value)) : '')}
            formatter={(value, name) => [value ?? '—', name === 'sleep' ? 'Giờ ngủ' : 'Tâm trạng']}
          />
          <Line yAxisId="sleep" type="monotone" dataKey="sleep" stroke="#38bdf8" strokeWidth={2.5} dot={false} connectNulls />
          <Line yAxisId="mood" type="monotone" dataKey="mood" stroke="#f5a524" strokeWidth={2} strokeDasharray="4 4" dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
