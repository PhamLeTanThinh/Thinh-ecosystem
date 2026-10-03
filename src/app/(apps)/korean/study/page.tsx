'use client'

import { Suspense, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useKoreanStore } from '@/lib/korean/store'
import { KOREAN_LESSON_GROUPS, koreanLessonLabel, toReviewCard } from '@/lib/korean/reviewCard'
import { ReviewApp } from '@/components/shared/review/ReviewApp'
import type { ReviewCard } from '@/components/shared/review/types'
import { AppBreadcrumb, AppCrumbBar } from '@/components/study/Breadcrumb'

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

// useSearchParams() bắt buộc bọc Suspense — nếu không, build production sẽ lỗi
// "Missing Suspense boundary with useSearchParams".
export default function KoreanStudyPage() {
  return (
    // Breadcrumb ở hàng riêng, sát góc trên trái — cùng toạ độ với breadcrumb đầu sidebar ở trang bài học (AppCrumbBar),
    // không nằm trong khung nội dung nên không xê dịch theo độ rộng của từng trang.
    <div className="w-full">
      <AppCrumbBar>
        <AppBreadcrumb app="/korean" trail={[{ label: 'Ôn tập', icon: 'cards' }]} />
      </AppCrumbBar>
      <div className="mx-auto w-full max-w-xl px-4 pb-6">
        <Suspense fallback={<StudyMessage text="Đang tải..." />}>
          <StudySession />
        </Suspense>
      </div>
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
  const preset = useMemo(() => (lesson !== null ? { label: koreanLessonLabel(lesson), filter: (c: ReviewCard) => c.lesson === lesson } : null), [lesson])

  if (!hydrated) return <StudyMessage text="Đang tải..." />
  if (lesson !== null && !cards.some((c) => c.lesson === lesson)) return <StudyMessage text={`Bài ${lesson} chưa có thẻ nào.`} />

  return (
    <ReviewApp
      appHref="/korean"
      storageKey="kr-review-settings"
      lang="ko-KR"
      eyebrow="한국어 공부 · 🎴 Ôn tập"
      cards={cards}
      lessonGroups={KOREAN_LESSON_GROUPS}
      preset={preset}
      progressOf={progressOf}
      onResult={markResult}
      onUndo={restoreProgress}
    />
  )
}
