'use client'

import { Suspense, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useChineseStore } from '@/lib/chinese/store'
import { HSK_LEVELS, LESSON_TITLES, lessonDisplayNumber, lessonNumbersForLevel, levelLabel } from '@/lib/chinese/lessons'
import type { ExampleDetail } from '@/lib/chinese/exampleDetail'
import type { ChineseCard } from '@/lib/chinese/types'
import { stripNotePos } from '@/lib/chinese/notePos'
import { parsePos } from '@/components/shared/vocab/pos'
import { parseParts } from '@/components/shared/vocab/parts'
import { ReviewApp } from '@/components/shared/review/ReviewApp'
import type { ReviewCard, ReviewLessonGroup } from '@/components/shared/review/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'

function StudyMessage({ text }: { text: string }) {
  return (
    <div className="py-16 text-center text-sm text-muted">
      <Link href="/chinese" className="text-accent">
        ‹ Quay lại
      </Link>
      <p className="mt-6">{text}</p>
    </div>
  )
}

// Thẻ Chinese → thẻ ôn tập dùng chung (cùng cách lấy dữ liệu với danh sách học trong ChineseApp).
function toReviewCard(c: ChineseCard): ReviewCard {
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
const LESSON_GROUPS: ReviewLessonGroup[] = HSK_LEVELS.map((lv) => ({
  label: lv.label,
  lessons: lessonNumbersForLevel(lv.key).map((n) => ({ lesson: n, badge: `Bài ${lessonDisplayNumber(n)}`, title: LESSON_TITLES[n] ?? '' })),
})).filter((g) => g.lessons.length > 0)

// useSearchParams() bắt buộc bọc Suspense — nếu không, build production sẽ lỗi
// "Missing Suspense boundary with useSearchParams".
export default function ChineseStudyPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6">
      <AppBreadcrumb app="/chinese" trail={[{ label: 'Ôn tập', icon: 'cards' }]} className="mb-4" />
      <Suspense fallback={<StudyMessage text="Đang tải..." />}>
        <StudySession />
      </Suspense>
    </div>
  )
}

// ?lesson=<n> (nút 🎴 ở từng bài) hoặc ?deck=<id> (bộ tự tạo) → vào thẳng phiên ôn; không có → chọn bài + tuỳ chọn trước.
function StudySession() {
  const params = useSearchParams()
  const lessonParam = params.get('lesson')
  const lesson = lessonParam ? Number(lessonParam) : null
  const deckId = params.get('deck')

  const hydrated = useChineseStore((s) => s.hydrated)
  const allCards = useChineseStore((s) => s.cards)
  const decks = useChineseStore((s) => s.decks)
  const progress = useChineseStore((s) => s.progress)
  const markResult = useChineseStore((s) => s.markResult)
  const restoreProgress = useChineseStore((s) => s.restoreProgress)

  const cards = useMemo(() => allCards.map(toReviewCard), [allCards])
  const progressMap = useMemo(() => new Map(progress.map((p) => [p.id, p])), [progress])
  const progressOf = useCallback((id: string) => progressMap.get(id), [progressMap])
  const deck = deckId ? decks.find((d) => d.id === deckId) : undefined
  const preset = useMemo(() => {
    if (deck) {
      const ids = new Set(deck.cardIds)
      return { label: `Bộ: ${deck.name}`, filter: (c: ReviewCard) => ids.has(c.id) }
    }
    if (lesson !== null) return { label: `${levelLabel(lesson)} · Bài ${lessonDisplayNumber(lesson)} · ${LESSON_TITLES[lesson] ?? ''}`, filter: (c: ReviewCard) => c.lesson === lesson }
    return null
  }, [deck, lesson])

  if (!hydrated) return <StudyMessage text="Đang tải..." />
  if (deckId && !deck) return <StudyMessage text="Không tìm thấy bộ học này." />
  if (preset && !cards.some(preset.filter)) return <StudyMessage text={deck ? `Bộ "${deck.name}" chưa có từ nào.` : `Bài ${lesson} chưa có thẻ nào.`} />

  return (
    <ReviewApp
      appHref="/chinese"
      storageKey="cn-review-settings"
      lang="zh-CN"
      eyebrow="学中文 · 🎴 Ôn tập"
      cards={cards}
      lessonGroups={LESSON_GROUPS}
      preset={preset}
      readingLabel="pinyin"
      progressOf={progressOf}
      onResult={markResult}
      onUndo={restoreProgress}
    />
  )
}
