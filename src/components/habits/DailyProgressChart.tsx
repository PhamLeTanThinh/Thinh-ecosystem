'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDayMonth, parseISODate, type DailyProgressPoint } from '@/lib/habits/calculations'

interface DailyProgressChartProps {
  data: DailyProgressPoint[]
}

export function DailyProgressChart({ data }: DailyProgressChartProps) {
  const rows = data.map((point) => ({ date: point.date, percent: Math.round(point.rate * 100) }))

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatDayMonth(parseISODate(value))}
            tick={{ fill: '#71717a', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            cursor={{ fill: 'var(--color-card-soft)' }}
            contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: '#71717a' }}
            labelFormatter={(value) => (typeof value === 'string' ? formatDayMonth(parseISODate(value)) : '')}
            formatter={(value) => [`${value}%`, 'Hoàn thành']}
          />
          <Bar dataKey="percent" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
