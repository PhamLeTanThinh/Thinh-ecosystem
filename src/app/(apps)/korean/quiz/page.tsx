'use client'

import { Suspense, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useKoreanStore } from '@/lib/korean/store'
import { KOREAN_LESSON_GROUPS, koreanLessonLabel, toReviewCard } from '@/lib/korean/reviewCard'
import { LangQuiz, type QuizType } from '@/components/shared/quiz/LangQuiz'
import type { ReviewCard } from '@/components/shared/review/types'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'

const QUIZ_TYPES: { id: QuizType; label: string }[] = [
  { id: 'word-meaning', label: 'Từ → nghĩa' },
  { id: 'meaning-word', label: 'Nghĩa → từ' },
  { id: 'mixed', label: '🔀 Trộn' },
]

function QuizMessage({ text }: { text: string }) {
  return (
    <div className="py-16 text-center text-sm text-muted">
      <Link href="/korean" className="text-accent">
        ‹ Quay lại
      </Link>
      <p className="mt-6">{text}</p>
    </div>
  )
}

// useSearchParams() bắt buộc bọc Suspense — nếu không, build production sẽ lỗi
// "Missing Suspense boundary with useSearchParams".
export default function KoreanQuizPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <AppBreadcrumb app="/korean" trail={[{ label: 'Kiểm tra', icon: 'quiz' }]} className="mb-4" />
      <Suspense fallback={<QuizMessage text="Đang tải..." />}>
        <QuizSession />
      </Suspense>
    </div>
  )
}

// ?lesson=<n> (nút 📝 ở từng bài) → chỉ kiểm tra thẻ của bài đó; không có → chọn bài ở màn thiết lập.
function QuizSession() {
  const lessonParam = useSearchParams().get('lesson')
  const lesson = lessonParam ? Number(lessonParam) : null

  const hydrated = useKoreanStore((s) => s.hydrated)
  const allCards = useKoreanStore((s) => s.cards)
  const progress = useKoreanStore((s) => s.progress)
  const markResult = useKoreanStore((s) => s.markResult)

  const cards = useMemo(() => allCards.map(toReviewCard), [allCards])
  const progressMap = useMemo(() => new Map(progress.map((p) => [p.id, p])), [progress])
  const progressOf = useCallback((id: string) => progressMap.get(id), [progressMap])
  const preset = useMemo(() => (lesson !== null ? { label: koreanLessonLabel(lesson), filter: (c: ReviewCard) => c.lesson === lesson } : null), [lesson])

  if (!hydrated) return <QuizMessage text="Đang tải..." />
  if (lesson !== null && !cards.some((c) => c.lesson === lesson)) return <QuizMessage text={`Bài ${lesson} chưa có thẻ nào.`} />

  return (
    <LangQuiz
      appHref="/korean"
      storageKey="kr-quiz"
      lang="ko-KR"
      eyebrow="한국어 공부 · 📝 Kiểm tra"
      cards={cards}
      lessonGroups={KOREAN_LESSON_GROUPS}
      preset={preset}
      types={QUIZ_TYPES}
      progressOf={progressOf}
      onResult={markResult}
    />
  )
}
