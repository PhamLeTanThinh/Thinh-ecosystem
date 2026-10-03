'use client'

import { Suspense, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useChineseStore } from '@/lib/chinese/store'
import { CHINESE_LESSON_GROUPS, chineseLessonLabel, toReviewCard } from '@/lib/chinese/reviewCard'
import { ReviewApp } from '@/components/shared/review/ReviewApp'
import type { ReviewCard } from '@/components/shared/review/types'
import { AppBreadcrumb, AppCrumbBar } from '@/components/study/Breadcrumb'

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

// useSearchParams() bắt buộc bọc Suspense — nếu không, build production sẽ lỗi
// "Missing Suspense boundary with useSearchParams".
export default function ChineseStudyPage() {
  return (
    // Breadcrumb ở hàng riêng, sát góc trên trái — cùng toạ độ với breadcrumb đầu sidebar ở trang bài học (AppCrumbBar),
    // không nằm trong khung nội dung nên không xê dịch theo độ rộng của từng trang.
    <div className="w-full">
      <AppCrumbBar>
        <AppBreadcrumb app="/chinese" trail={[{ label: 'Ôn tập', icon: 'cards' }]} />
      </AppCrumbBar>
      <div className="mx-auto w-full max-w-xl px-4 pb-6">
        <Suspense fallback={<StudyMessage text="Đang tải..." />}>
          <StudySession />
        </Suspense>
      </div>
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
    if (lesson !== null) return { label: chineseLessonLabel(lesson), filter: (c: ReviewCard) => c.lesson === lesson }
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
      lessonGroups={CHINESE_LESSON_GROUPS}
      preset={preset}
      readingLabel="pinyin"
      progressOf={progressOf}
      onResult={markResult}
      onUndo={restoreProgress}
    />
  )
}
