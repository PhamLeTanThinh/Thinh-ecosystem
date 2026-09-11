import type { StickyNote } from './types'
import { formatDayShortLabel, fromISODate, getSeason, weekOfMonth } from './date'

export interface TreeNode {
  key: string
  label: string
  color?: string
  count: number
  noteIds: string[]
  children: TreeNode[]
  isDay: boolean
  date?: string // chỉ có ở node ngày (leaf)
}

function seasonKey(year: string, season: string): string {
  return `${year}-${season}`
}

// Mỗi CẤP (Năm/Mùa/Tháng/Tuần/Ngày) 1 màu riêng, cố định, khác hẳn nhau về tông — không suy ra từ
// màu mùa nữa (trước đây chỉ đổi độ sáng/tối của 1 màu, nhìn vẫn na ná nhau, khó phân biệt cấp).
// Giờ nhìn màu là biết ngay đang ở cấp nào, bất kể đang ở mùa nào.
const LEVEL_COLOR = {
  year: '#E0648A', // hồng
  month: '#8B6FE0', // tím
  week: '#2FAE82', // xanh lá
  day: '#3E8FE0', // xanh dương
}

// Xây cây Năm -> Mùa -> Tháng -> Tuần -> Ngày từ danh sách note (dựa trên `date` của từng note).
// Ngày hôm nay luôn có mặt trong cây dù chưa có note nào (để luôn chọn được), nhưng không có
// nghĩa là được lưu xuống DB — node ngày trống chỉ tồn tại tạm trong cây hiển thị.
export function buildDateTree(notes: StickyNote[], todayISO: string): TreeNode[] {
  const dayMap = new Map<string, string[]>()
  for (const n of notes) {
    if (!dayMap.has(n.date)) dayMap.set(n.date, [])
    dayMap.get(n.date)!.push(n.id)
  }
  if (!dayMap.has(todayISO)) dayMap.set(todayISO, [])

  const dates = Array.from(dayMap.keys()).sort((a, b) => (a < b ? 1 : -1))

  const years: TreeNode[] = []
  let curYear: TreeNode | null = null
  let curSeason: TreeNode | null = null
  let curMonth: TreeNode | null = null
  let curWeek: TreeNode | null = null
  let prevYear = ''
  let prevSeasonKey = ''
  let prevMonthKey = ''
  let prevWeekKey = ''

  for (const dateStr of dates) {
    const d = fromISODate(dateStr)
    const year = String(d.getFullYear())
    const season = getSeason(d.getMonth())
    const sKey = seasonKey(year, season.key)
    const monthKey = `${year}-${d.getMonth()}`
    const weekNum = weekOfMonth(d)
    const weekKey = `${monthKey}-w${weekNum}`
    const noteIds = dayMap.get(dateStr)!

    if (year !== prevYear) {
      curYear = { key: year, label: year, color: LEVEL_COLOR.year, count: 0, noteIds: [], children: [], isDay: false }
      years.push(curYear)
      prevYear = year
      prevSeasonKey = ''
    }
    if (sKey !== prevSeasonKey) {
      curSeason = { key: sKey, label: season.label, color: season.color, count: 0, noteIds: [], children: [], isDay: false }
      curYear!.children.push(curSeason)
      prevSeasonKey = sKey
      prevMonthKey = ''
    }
    if (monthKey !== prevMonthKey) {
      curMonth = {
        key: monthKey,
        label: `Tháng ${d.getMonth() + 1}`,
        color: LEVEL_COLOR.month,
        count: 0,
        noteIds: [],
        children: [],
        isDay: false,
      }
      curSeason!.children.push(curMonth)
      prevMonthKey = monthKey
      prevWeekKey = ''
    }
    if (weekKey !== prevWeekKey) {
      curWeek = {
        key: weekKey,
        label: `Tuần ${weekNum}`,
        color: LEVEL_COLOR.week,
        count: 0,
        noteIds: [],
        children: [],
        isDay: false,
      }
      curMonth!.children.push(curWeek)
      prevWeekKey = weekKey
    }

    const dayNode: TreeNode = {
      key: dateStr,
      label: formatDayShortLabel(d),
      color: LEVEL_COLOR.day,
      count: noteIds.length,
      noteIds,
      children: [],
      isDay: true,
      date: dateStr,
    }
    curWeek!.children.push(dayNode)

    for (const g of [curWeek, curMonth, curSeason, curYear]) {
      g!.count += noteIds.length
      g!.noteIds.push(...noteIds)
    }
  }

  return years
}

// Khoá của mọi node tổ tiên chứa ngày `dateISO` — dùng để tự mở rộng cây tới ngày đang chọn.
export function getAncestorKeys(dateISO: string): string[] {
  const d = fromISODate(dateISO)
  const year = String(d.getFullYear())
  const season = getSeason(d.getMonth())
  const monthKey = `${year}-${d.getMonth()}`
  const weekKey = `${monthKey}-w${weekOfMonth(d)}`
  return [year, seasonKey(year, season.key), monthKey, weekKey]
}
