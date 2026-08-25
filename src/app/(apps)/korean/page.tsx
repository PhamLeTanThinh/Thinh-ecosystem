'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useKoreanStore } from '@/lib/korean/store'
import { useKoreanUIStore } from '@/lib/korean/uiStore'
import { LESSON_NUMBERS, LESSON_TITLES } from '@/lib/korean/lessons'
import { SegmentedControl } from '@/components/korean/SegmentedControl'
import type { KoreanCardKind, QuizMode } from '@/lib/korean/types'

const PAGE_SIZE = 30

const SHUFFLE_OPTIONS: { value: 'on' | 'off'; label: string }[] = [
  { value: 'on', label: '🔀 Ngẫu nhiên' },
  { value: 'off', label: 'Theo danh sách' },
]

const QUIZ_MODE_OPTIONS: { value: QuizMode; label: string }[] = [
  { value: 'front-to-meaning', label: 'Từ/mẫu câu → Nghĩa' },
  { value: 'meaning-to-front', label: 'Nghĩa → Từ/mẫu câu' },
]

const KIND_OPTIONS: { value: 'all' | KoreanCardKind; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'vocab', label: '📚 Từ vựng' },
  { value: 'grammar', label: '✏️ Ngữ pháp' },
]

type StatusFilter = 'all' | 'learned' | 'unlearned'

export default function KoreanPage() {
  const cards = useKoreanStore((s) => s.cards)
  const progress = useKoreanStore((s) => s.progress)
  const settings = useKoreanStore((s) => s.settings)
  const updateSettings = useKoreanStore((s) => s.updateSettings)
  const openAddCard = useKoreanUIStore((s) => s.openAddCard)

  const [kindFilter, setKindFilter] = useState<'all' | KoreanCardKind>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Quay lại trang đầu mỗi khi đổi bộ lọc hoặc từ khoá tìm kiếm — cập nhật state trong lúc
  // render (không phải effect) để tránh 1 nhịp render thừa, cùng convention với app/(apps)/chinese/page.tsx.
  const [prevFilterKey, setPrevFilterKey] = useState(`${kindFilter}|${statusFilter}|${searchQuery}`)
  const filterKey = `${kindFilter}|${statusFilter}|${searchQuery}`
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const progressByCard = new Map(progress.map((p) => [p.id, p]))
  const isLearned = (cardId: string) => progressByCard.get(cardId)?.lastResult === 'correct'

  const sortedCards = [...cards].sort((a, b) => a.lesson - b.lesson || a.sortOrder - b.sortOrder)
  const learnedCount = sortedCards.filter((c) => isLearned(c.id)).length
  const unlearnedCount = sortedCards.length - learnedCount
  const learnedPercent = sortedCards.length > 0 ? Math.round((learnedCount / sortedCards.length) * 100) : 0

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleCards = sortedCards.filter((c) => {
    if (kindFilter !== 'all' && c.kind !== kindFilter) return false
    if (statusFilter === 'learned' && !isLearned(c.id)) return false
    if (statusFilter === 'unlearned' && isLearned(c.id)) return false
    if (!normalizedQuery) return true
    return (
      c.front.toLowerCase().includes(normalizedQuery) ||
      c.meaning.toLowerCase().includes(normalizedQuery) ||
      c.note.toLowerCase().includes(normalizedQuery)
    )
  })

  const pagedCards = visibleCards.slice(0, visibleCount)
  const hasMore = visibleCount < visibleCards.length

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-card bg-linear-to-br from-brand to-brand-strong p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">한국어 공부</p>
          <h1 className="mt-1 text-2xl font-bold">Từ Vựng & Ngữ Pháp Tiếng Hàn</h1>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center backdrop-blur">
            <p className="text-lg font-bold">{sortedCards.length}</p>
            <p className="text-[11px] text-white/70">Tổng số thẻ</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center backdrop-blur">
            <p className="text-lg font-bold text-gold">{learnedCount}</p>
            <p className="text-[11px] text-white/70">Đã thuộc</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center backdrop-blur">
            <p className="text-lg font-bold">{learnedPercent}%</p>
            <p className="text-[11px] text-white/70">Hoàn thành</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => openAddCard()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-pill bg-card py-3 text-sm font-semibold shadow-sm"
      >
        <span className="text-lg leading-none text-accent">＋</span> Thêm thẻ mới
      </button>

      <div className="mt-4 flex flex-col gap-4 rounded-card bg-card p-4 shadow-sm">
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">Thứ tự ôn tập</p>
          <SegmentedControl
            options={SHUFFLE_OPTIONS}
            value={settings.shuffle ? 'on' : 'off'}
            onChange={(value) => updateSettings({ shuffle: value === 'on' })}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-muted">Chế độ trắc nghiệm</p>
          <SegmentedControl
            dense
            options={QUIZ_MODE_OPTIONS}
            value={settings.quizMode}
            onChange={(value) => updateSettings({ quizMode: value })}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-muted">Loại thẻ</p>
          <SegmentedControl dense options={KIND_OPTIONS} value={kindFilter} onChange={setKindFilter} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-muted">Lọc theo trạng thái</p>
          <SegmentedControl
            dense
            options={[
              { value: 'all' as const, label: `Tất cả (${sortedCards.length})` },
              { value: 'learned' as const, label: `Đã thuộc (${learnedCount})` },
              { value: 'unlearned' as const, label: `Chưa thuộc (${unlearnedCount})` },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-semibold text-muted">18 bài học</p>
        <div className="flex flex-col gap-2">
          {LESSON_NUMBERS.map((n) => {
            const lessonCards = sortedCards.filter((c) => c.lesson === n)
            const vocabCount = lessonCards.filter((c) => c.kind === 'vocab').length
            const grammarCount = lessonCards.filter((c) => c.kind === 'grammar').length
            return (
              <div key={n} className="flex items-center justify-between gap-3 rounded-card bg-card p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold-soft text-xs font-bold text-gold">
                    {n}과
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{LESSON_TITLES[n]}</p>
                    <p className="text-xs text-muted">
                      📚 {vocabCount} từ · ✏️ {grammarCount} ngữ pháp
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/korean/study?lesson=${n}`}
                    className="rounded-pill bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-strong"
                  >
                    🎴 Ôn
                  </Link>
                  <Link
                    href={`/korean/quiz?lesson=${n}`}
                    className="rounded-pill bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand"
                  >
                    📝 Test
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 pb-24">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted">Danh sách thẻ</p>
          <p className="text-xs text-muted">
            {visibleCards.length} thẻ
            {normalizedQuery || statusFilter !== 'all' || kindFilter !== 'all' ? ` (đã lọc / ${sortedCards.length} tổng)` : ''}
          </p>
        </div>

        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Tìm theo Hangul, mẫu ngữ pháp hoặc nghĩa..."
          className="rounded-2xl border border-transparent bg-card-soft px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
        />

        {visibleCards.length === 0 && (
          <p className="rounded-card bg-card py-10 text-center text-sm text-muted shadow-sm">
            {sortedCards.length === 0 ? 'Chưa có thẻ nào. Nhấn "Thêm thẻ mới" để bắt đầu.' : 'Không có thẻ nào khớp.'}
          </p>
        )}
        {pagedCards.map((card, i) => {
          const cardProgress = progressByCard.get(card.id)
          const learned = isLearned(card.id)
          const showLessonHeader = i === 0 || pagedCards[i - 1].lesson !== card.lesson
          return (
            <div key={card.id} className="contents">
              {showLessonHeader && (
                <p className="mt-3 px-1 text-xs font-bold text-brand first:mt-0">
                  제{card.lesson}과 · {LESSON_TITLES[card.lesson] ?? ''}
                </p>
              )}
              <button
                type="button"
                onClick={() => openAddCard(card.id)}
                className="flex items-center justify-between gap-3 rounded-card bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`relative flex min-h-14 min-w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft px-2 py-1.5 text-center font-bold leading-tight text-brand ${
                      card.front.length <= 4 ? 'text-lg' : card.front.length <= 10 ? 'text-sm' : 'text-xs'
                    }`}
                  >
                    {card.front}
                    {learned && (
                      <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white ring-2 ring-card">
                        ✓
                      </span>
                    )}
                  </span>
                  <div>
                    <p className="inline-flex items-center gap-1 rounded-pill bg-card-soft px-2 py-0.5 text-xs text-muted">
                      {card.kind === 'grammar' ? '✏️ Ngữ pháp' : '📚 Từ vựng'}
                    </p>
                    <p className="mt-1 text-sm font-medium">{card.meaning}</p>
                  </div>
                </div>
                {cardProgress && (cardProgress.correctCount > 0 || cardProgress.wrongCount > 0) && (
                  <div className="flex shrink-0 flex-col items-end gap-1 text-xs font-semibold">
                    {cardProgress.correctCount > 0 && (
                      <span className="rounded-pill bg-accent-soft px-2 py-0.5 text-accent-strong">✓ {cardProgress.correctCount}</span>
                    )}
                    {cardProgress.wrongCount > 0 && (
                      <span className="rounded-pill bg-danger-soft px-2 py-0.5 text-danger">✕ {cardProgress.wrongCount}</span>
                    )}
                  </div>
                )}
              </button>
            </div>
          )
        })}

        {hasMore && (
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-pill bg-card-soft py-3 text-sm font-semibold text-muted shadow-sm"
          >
            Xem thêm {Math.min(PAGE_SIZE, visibleCards.length - visibleCount)} thẻ ↓
          </button>
        )}
      </div>
    </div>
  )
}
