// Dùng local date parts (không phải UTC) để tránh lệch ngày theo timezone.
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

const WEEKDAYS_VN = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

export function formatDayLabel(d: Date): string {
  return `${WEEKDAYS_VN[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export function formatDayShortLabel(d: Date): string {
  return `${d.getDate()} — ${WEEKDAYS_VN[d.getDay()]}`
}

interface Season {
  key: string
  label: string
  color: string
}

// Chia mùa đơn giản theo quý dương lịch (Xuân/Hạ/Thu/Đông), không theo mốc khí tượng chính xác —
// đủ dùng để nhóm + tô màu cho dễ quan sát trong danh sách phân cấp.
const SEASONS: Season[] = [
  { key: 'xuan', label: 'Xuân', color: '#34B37A' },
  { key: 'ha', label: 'Hạ', color: '#E0A62A' },
  { key: 'thu', label: 'Thu', color: '#D9773E' },
  { key: 'dong', label: 'Đông', color: '#3E7FE0' },
]

export function getSeason(month0: number): Season {
  return SEASONS[Math.floor(month0 / 3)]
}

// Tuần trong tháng (1-5), đơn giản theo thứ tự ngày, không phải tuần ISO.
export function weekOfMonth(d: Date): number {
  return Math.ceil(d.getDate() / 7)
}
