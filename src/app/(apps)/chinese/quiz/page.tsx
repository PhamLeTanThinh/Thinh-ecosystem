'use client'

import { Suspense, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useChineseStore } from '@/lib/chinese/store'
import { CHINESE_LESSON_GROUPS, chineseLessonLabel, toReviewCard } from '@/lib/chinese/reviewCard'
import { LangQuiz, type QuizType } from '@/components/shared/quiz/LangQuiz'
import type { ReviewCard } from '@/components/shared/review/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'

const QUIZ_TYPES: { id: QuizType; label: string }[] = [
  { id: 'word-meaning', label: 'Chữ Hán → nghĩa' },
  { id: 'word-reading', label: 'Chữ Hán → pinyin' },
  { id: 'meaning-word', label: 'Nghĩa → chữ Hán' },
  { id: 'mixed', label: '🔀 Trộn' },
]

function QuizMessage({ text }: { text: string }) {
  return (
    <div className="py-16 text-center text-sm text-muted">
      <Link href="/chinese" className="text-accent">
        ‹ Quay lại
      </Link>
      <p className="mt-6">{text}</p>
    </div>
  )
}

// useSearchParams() bắt buộc bọc Suspense — nếu không, build production sẽ lỗi
// "Missing Suspense boundary with useSearchParams".
export default function ChineseQuizPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <AppBreadcrumb app="/chinese" trail={[{ label: 'Kiểm tra', icon: 'quiz' }]} className="mb-4" />
      <Suspense fallback={<QuizMessage text="Đang tải..." />}>
        <QuizSession />
      </Suspense>
    </div>
  )
}

// ?lesson=<n> (nút 📝 ở từng bài) hoặc ?deck=<id> (bộ tự tạo) → chỉ kiểm tra thẻ của bài / bộ đó; không có → chọn bài.
function QuizSession() {
  const params = useSearchParams()
  const lessonParam = params.get('lesson')
  const lesson = lessonParam ? Number(lessonParam) : null
  const deckId = params.get('deck')

  const hydrated = useChineseStore((s) => s.hydrated)
  const allCards = useChineseStore((s) => s.cards)
  const decks = useChineseStore((s) => s.decks)
  const progress = useChineseStore((s) => s.progress)
  const markResult = useChineseStore((s) => s.markResult)

  const cards = useMemo(() => allCards.map(toReviewCard), [allCards])
  const progressMap = useMemo(() => new Map(progress.map((p) => [p.id, p])), [progress])
  const progressOf = useCallback((id: string) => progressMap.get(id), [progressMap])
  const deck = deckId ? decks.find((d) => d.id === deckId) : undefined
  const preset = useMemo(() => {
    if (deck) {
      const ids = new Set(deck.cardIds)
      return { label: `Bộ: ${deck.name}`, filter: (c: ReviewCard) => ids.has(c.id) }
    }
    if (lesson !== null) return { label: chineseLessonLabel(lesson), filter: (c: ReviewCard) => c.lesson === lesson }
    return null
  }, [deck, lesson])

  if (!hydrated) return <QuizMessage text="Đang tải..." />
  if (deckId && !deck) return <QuizMessage text="Không tìm thấy bộ học này." />
  if (preset && !cards.some(preset.filter)) return <QuizMessage text={deck ? `Bộ "${deck.name}" chưa có từ nào.` : `Bài ${lesson} chưa có thẻ nào.`} />

  return (
    <LangQuiz
      appHref="/chinese"
      storageKey="cn-quiz"
      lang="zh-CN"
      eyebrow="学中文 · 📝 Kiểm tra"
      cards={cards}
      lessonGroups={CHINESE_LESSON_GROUPS}
      preset={preset}
      types={QUIZ_TYPES}
      progressOf={progressOf}
      onResult={markResult}
    />
  )
}
