'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDayMonth, formatVND, parseISODate, type TrendPoint } from '@/lib/money/calculations'

interface TrendChartProps {
  current: TrendPoint[]
  average: TrendPoint[]
}

interface ChartRow {
  date: string
  current: number
  average: number
}

export function TrendChart({ current, average }: TrendChartProps) {
  const data: ChartRow[] = current.map((point, i) => ({
    date: point.date,
    current: point.amount,
    average: average[i]?.amount ?? 0,
  }))

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) => formatDayMonth(parseISODate(value))}
            tick={{ fill: '#71717a', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide />
          <Tooltip
            cursor={{ stroke: '#e4e4e7' }}
            contentStyle={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 12, fontSize: 12 }}
            labelStyle={{ color: '#71717a' }}
            labelFormatter={(value) => (typeof value === 'string' ? formatDayMonth(parseISODate(value)) : '')}
            formatter={(value, name) => [
              formatVND(typeof value === 'number' ? value : Number(value) || 0),
              name === 'current' ? 'Tháng này' : 'Trung bình 3 tháng trước',
            ]}
          />
          <Line type="monotone" dataKey="current" stroke="#dc2626" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="average" stroke="#a1a1aa" strokeWidth={2} strokeDasharray="4 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
