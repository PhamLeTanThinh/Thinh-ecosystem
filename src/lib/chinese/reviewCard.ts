import type { ExampleDetail } from '@/lib/chinese/exampleDetail'
import type { ChineseCard } from '@/lib/chinese/types'
import { HSK_LEVELS, LESSON_TITLES, lessonDisplayNumber, lessonNumbersForLevel, levelLabel } from '@/lib/chinese/lessons'
import { stripNotePos } from '@/lib/chinese/notePos'
import { parsePos } from '@/components/shared/vocab/pos'
import { parseParts } from '@/components/shared/vocab/parts'
import type { ReviewCard, ReviewLessonGroup } from '@/components/shared/review/types'

// Thẻ Chinese → thẻ dùng chung của màn Ôn tập / Kiểm tra (cùng cách lấy dữ liệu với danh sách học trong ChineseApp).
export function toReviewCard(c: ChineseCard): ReviewCard {
  let detail: ExampleDetail | undefined
  try {
    detail = (JSON.parse(c.exampleDetail || '[]') as ExampleDetail[])[0]
  } catch {}
  return {
    id: c.id,
    kind: c.kind,
    lesson: c.lesson,
    sortOrder: c.sortOrder,
    word: c.hanzi,
    reading: c.pinyin || undefined,
    meaning: c.meaning,
    sub: stripNotePos(c.note) || undefined,
    pos: parsePos(c.pos),
    parts: parseParts(c.parts),
    example: c.example.split('\n')[0] || detail?.zh || undefined,
    exampleReading: detail?.pinyin || undefined,
    exampleVi: detail?.vi || undefined,
    image: c.image || undefined,
  }
}

// Bài 0 ("Chưa phân loại") là thẻ cũ trùng với các bài thật — không đưa vào danh sách chọn bài.
export const CHINESE_LESSON_GROUPS: ReviewLessonGroup[] = HSK_LEVELS.map((lv) => ({
  label: lv.label,
  lessons: lessonNumbersForLevel(lv.key).map((n) => ({ lesson: n, badge: `Bài ${lessonDisplayNumber(n)}`, title: LESSON_TITLES[n] ?? '' })),
})).filter((g) => g.lessons.length > 0)

export const chineseLessonLabel = (lesson: number) => `${levelLabel(lesson)} · Bài ${lessonDisplayNumber(lesson)} · ${LESSON_TITLES[lesson] ?? ''}`
