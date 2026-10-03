import type { ExampleDetail } from '@/lib/korean/exampleDetail'
import type { KoreanCard } from '@/lib/korean/types'
import { LESSON_TITLES, TOPIK_LABEL, lessonDisplayNumber, lessonNumbersForLevel } from '@/lib/korean/lessons'
import { parsePos } from '@/components/shared/vocab/pos'
import { parseParts } from '@/components/shared/vocab/parts'
import type { ReviewCard, ReviewLessonGroup } from '@/components/shared/review/types'

// Thẻ Korean → thẻ dùng chung của màn Ôn tập / Kiểm tra. Ví dụ: dòng đầu của example + bản dịch ở exampleDetail[0].vi.
export function toReviewCard(c: KoreanCard): ReviewCard {
  let detail: ExampleDetail | undefined
  try {
    detail = (JSON.parse(c.exampleDetail || '[]') as ExampleDetail[])[0]
  } catch {}
  return {
    id: c.id,
    kind: c.kind,
    lesson: c.lesson,
    sortOrder: c.sortOrder,
    word: c.front,
    meaning: c.meaning,
    sub: c.note || undefined,
    pos: parsePos(c.pos),
    parts: parseParts(c.parts),
    example: c.example.split('\n')[0] || detail?.ko || undefined,
    exampleVi: detail?.vi || undefined,
    image: c.image || undefined,
  }
}

export const KOREAN_LESSON_GROUPS: ReviewLessonGroup[] = (['topik1', 'topik2'] as const).map((level) => ({
  label: TOPIK_LABEL[level],
  lessons: lessonNumbersForLevel(level).map((n) => ({ lesson: n, badge: `${lessonDisplayNumber(n)}과`, title: LESSON_TITLES[n] ?? '' })),
}))

export const koreanLessonLabel = (lesson: number) => `제${lessonDisplayNumber(lesson)}과 · ${LESSON_TITLES[lesson] ?? ''}`
