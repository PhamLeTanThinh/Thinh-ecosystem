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
  date?: string // only set on day nodes (leaves)
}

function seasonKey(year: string, season: string): string {
  return `${year}-${season}`
}

// Each LEVEL (Year/Season/Month/Week/Day) gets its own fixed color, clearly distinct from the
// others — no longer derived from the season color (previously just varied lightness/darkness of
// one hue, which looked too similar and made levels hard to tell apart). Now the color alone tells
// you which level you're looking at, regardless of season.
const LEVEL_COLOR = {
  year: '#E0648A', // pink
  month: '#8B6FE0', // purple
  week: '#2FAE82', // green
  day: '#3E8FE0', // blue
}

// Builds a Year -> Season -> Month -> Week -> Day tree from the note list (based on each note's
// `date`). Today's date is always present in the tree even with no notes yet (so it's always
// selectable), but that doesn't mean it's persisted to the DB — an empty day node only exists
// temporarily in the displayed tree.
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
        label: `Month ${d.getMonth() + 1}`,
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
        label: `Week ${weekNum}`,
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

// Keys of every ancestor node containing `dateISO` — used to auto-expand the tree down to the
// currently selected day.
export function getAncestorKeys(dateISO: string): string[] {
  const d = fromISODate(dateISO)
  const year = String(d.getFullYear())
  const season = getSeason(d.getMonth())
  const monthKey = `${year}-${d.getMonth()}`
  const weekKey = `${monthKey}-w${weekOfMonth(d)}`
  return [year, seasonKey(year, season.key), monthKey, weekKey]
}
