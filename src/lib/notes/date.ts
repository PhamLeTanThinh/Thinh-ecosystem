// Uses local date parts (not UTC) to avoid off-by-one-day errors across timezones.
export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(d: Date, delta: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + delta)
  return next
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function formatDayLabel(d: Date): string {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export function formatDayShortLabel(d: Date): string {
  return `${d.getDate()} — ${WEEKDAYS[d.getDay()]}`
}

interface Season {
  key: string
  label: string
  color: string
}

// Simple calendar-quarter seasons (Spring/Summer/Fall/Winter), not exact meteorological dates —
// good enough for grouping + coloring the hierarchical tree view.
const SEASONS: Season[] = [
  { key: 'spring', label: 'Spring', color: '#34B37A' },
  { key: 'summer', label: 'Summer', color: '#E0A62A' },
  { key: 'fall', label: 'Fall', color: '#D9773E' },
  { key: 'winter', label: 'Winter', color: '#3E7FE0' },
]

export function getSeason(month0: number): Season {
  return SEASONS[Math.floor(month0 / 3)]
}

// Week of the month (1-5), simple day-order based, not ISO week.
export function weekOfMonth(d: Date): number {
  return Math.ceil(d.getDate() / 7)
}

// Week starts on Monday, unlike the default getDay() which treats Sunday as the first day.
export function startOfWeek(d: Date): Date {
  return addDays(d, -((d.getDay() + 6) % 7))
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function addMonths(d: Date, delta: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1)
}
