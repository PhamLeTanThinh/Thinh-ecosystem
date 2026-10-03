'use client'

import { Suspense, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useKoreanStore } from '@/lib/korean/store'
import { LESSON_TITLES, TOPIK_LABEL, lessonDisplayNumber, lessonNumbersForLevel } from '@/lib/korean/lessons'
import type { ExampleDetail } from '@/lib/korean/exampleDetail'
import type { KoreanCard } from '@/lib/korean/types'
import { parsePos } from '@/components/shared/vocab/pos'
import { parseParts } from '@/components/shared/vocab/parts'
import { ReviewApp } from '@/components/shared/review/ReviewApp'
import type { ReviewCard, ReviewLessonGroup } from '@/components/shared/review/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'

function StudyMessage({ text }: { text: string }) {
  return (
    <div className="py-16 text-center text-sm text-muted">
      <Link href="/korean" className="text-accent">
        ‹ Quay lại
      </Link>
      <p className="mt-6">{text}</p>
    </div>
  )
}

// Thẻ Korean → thẻ ôn tập dùng chung. Ví dụ: dòng đầu của example + bản dịch ở exampleDetail[0].vi.
function toReviewCard(c: KoreanCard): ReviewCard {
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

const LESSON_GROUPS: ReviewLessonGroup[] = (['topik1', 'topik2'] as const).map((level) => ({
  label: TOPIK_LABEL[level],
  lessons: lessonNumbersForLevel(level).map((n) => ({ lesson: n, badge: `${lessonDisplayNumber(n)}과`, title: LESSON_TITLES[n] ?? '' })),
}))

// useSearchParams() bắt buộc bọc Suspense — nếu không, build production sẽ lỗi
// "Missing Suspense boundary with useSearchParams".
export default function KoreanStudyPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      <AppBreadcrumb app="/korean" trail={[{ label: 'Ôn tập', icon: 'cards' }]} className="mb-4" />
      <Suspense fallback={<StudyMessage text="Đang tải..." />}>
        <StudySession />
      </Suspense>
    </div>
  )
}

// ?lesson=<n> (nút 🎴 ở từng bài) → vào thẳng phiên ôn của bài đó; không có → chọn bài + tuỳ chọn trước.
function StudySession() {
  const lessonParam = useSearchParams().get('lesson')
  const lesson = lessonParam ? Number(lessonParam) : null

  const hydrated = useKoreanStore((s) => s.hydrated)
  const allCards = useKoreanStore((s) => s.cards)
  const progress = useKoreanStore((s) => s.progress)
  const markResult = useKoreanStore((s) => s.markResult)
  const restoreProgress = useKoreanStore((s) => s.restoreProgress)

  const cards = useMemo(() => allCards.map(toReviewCard), [allCards])
  const progressMap = useMemo(() => new Map(progress.map((p) => [p.id, p])), [progress])
  const progressOf = useCallback((id: string) => progressMap.get(id), [progressMap])
  const preset = useMemo(
    () => (lesson !== null ? { label: `제${lessonDisplayNumber(lesson)}과 · ${LESSON_TITLES[lesson] ?? ''}`, filter: (c: ReviewCard) => c.lesson === lesson } : null),
    [lesson],
  )

  if (!hydrated) return <StudyMessage text="Đang tải..." />
  if (lesson !== null && !cards.some((c) => c.lesson === lesson)) return <StudyMessage text={`Bài ${lesson} chưa có thẻ nào.`} />

  return (
    <ReviewApp
      appHref="/korean"
      storageKey="kr-review-settings"
      lang="ko-KR"
      eyebrow="한국어 공부 · 🎴 Ôn tập"
      cards={cards}
      lessonGroups={LESSON_GROUPS}
      preset={preset}
      progressOf={progressOf}
      onResult={markResult}
      onUndo={restoreProgress}
    />
  )
}
