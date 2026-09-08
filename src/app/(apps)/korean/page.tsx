'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useKoreanStore } from '@/lib/korean/store'
import { useKoreanUIStore } from '@/lib/korean/uiStore'
import { LESSON_TITLES } from '@/lib/korean/lessons'
import { Sidebar, type Selection } from '@/components/korean/Sidebar'
import { SegmentedControl } from '@/components/korean/SegmentedControl'
import type { ExampleDetail } from '@/lib/korean/exampleDetail'
import type { KoreanCard, KoreanCardKind, KoreanProgress, QuizMode } from '@/lib/korean/types'

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

  const [selection, setSelection] = useState<Selection>({ type: 'overview' })
  const [kindFilter, setKindFilter] = useState<'all' | KoreanCardKind>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Quay lại trang đầu mỗi khi đổi bộ lọc/lựa chọn/từ khoá tìm kiếm — cập nhật state trong lúc
  // render (không phải effect) để tránh 1 nhịp render thừa, cùng convention với app/(apps)/chinese/page.tsx.
  const filterKey = `${selection.type === 'lesson' ? selection.lesson : 'overview'}|${kindFilter}|${statusFilter}|${searchQuery}`
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const progressByCard = new Map(progress.map((p) => [p.id, p]))
  const isLearned = (cardId: string) => progressByCard.get(cardId)?.lastResult === 'correct'

  const sortedCards = [...cards].sort((a, b) => a.lesson - b.lesson || a.sortOrder - b.sortOrder)
  const learnedCount = sortedCards.filter((c) => isLearned(c.id)).length
  const learnedPercent = sortedCards.length > 0 ? Math.round((learnedCount / sortedCards.length) * 100) : 0

  return (
    <div className="kr-shell">
      <Sidebar cards={sortedCards} isLearned={isLearned} selection={selection} onSelect={setSelection} />

      <div className="kr-main">
        <header className="kr-topbar">
          <span className="kr-wordmark">Korean Hub</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Tìm theo Hangul, mẫu ngữ pháp hoặc nghĩa…"
            className="kr-search"
          />
          <button type="button" onClick={() => openAddCard()} className="kr-btn-outline">
            ＋ Thêm thẻ
          </button>
        </header>

        {selection.type === 'overview' ? (
          <OverviewContent
            sortedCards={sortedCards}
            progressByCard={progressByCard}
            isLearned={isLearned}
            learnedCount={learnedCount}
            learnedPercent={learnedPercent}
            settings={settings}
            updateSettings={updateSettings}
            kindFilter={kindFilter}
            setKindFilter={setKindFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            visibleCount={visibleCount}
            setVisibleCount={setVisibleCount}
            openAddCard={openAddCard}
          />
        ) : (
          <LessonContent lesson={selection.lesson} cards={sortedCards} progressByCard={progressByCard} isLearned={isLearned} openAddCard={openAddCard} />
        )}
      </div>
    </div>
  )
}

function OverviewContent({
  sortedCards,
  progressByCard,
  isLearned,
  learnedCount,
  learnedPercent,
  settings,
  updateSettings,
  kindFilter,
  setKindFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  visibleCount,
  setVisibleCount,
  openAddCard,
}: {
  sortedCards: KoreanCard[]
  progressByCard: Map<string, KoreanProgress>
  isLearned: (id: string) => boolean
  learnedCount: number
  learnedPercent: number
  settings: { shuffle: boolean; quizMode: QuizMode }
  updateSettings: (patch: Partial<{ shuffle: boolean; quizMode: QuizMode }>) => void
  kindFilter: 'all' | KoreanCardKind
  setKindFilter: (v: 'all' | KoreanCardKind) => void
  statusFilter: StatusFilter
  setStatusFilter: (v: StatusFilter) => void
  searchQuery: string
  visibleCount: number
  setVisibleCount: (fn: (c: number) => number) => void
  openAddCard: (cardId?: string) => void
}) {
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
    <div className="kr-content">
      <div className="kr-content-header">
        <div>
          <p className="kr-eyebrow">한국어 공부</p>
          <h1 className="kr-page-title">Tất cả bài học</h1>
        </div>
      </div>

      <div className="kr-stats-row">
        <div className="kr-glass kr-stat-tile">
          <p className="kr-stat-value">{sortedCards.length}</p>
          <p className="kr-stat-label">Tổng số thẻ</p>
        </div>
        <div className="kr-glass kr-stat-tile">
          <p className="kr-stat-value kr-stat-value-accent">{learnedCount}</p>
          <p className="kr-stat-label">Đã thuộc</p>
        </div>
        <div className="kr-glass kr-stat-tile">
          <p className="kr-stat-value">{learnedPercent}%</p>
          <p className="kr-stat-label">Hoàn thành</p>
        </div>
      </div>

      <div className="kr-glass kr-filter-panel">
        <div>
          <p className="kr-filter-label">THỨ TỰ ÔN TẬP</p>
          <SegmentedControl options={SHUFFLE_OPTIONS} value={settings.shuffle ? 'on' : 'off'} onChange={(value) => updateSettings({ shuffle: value === 'on' })} />
        </div>
        <div>
          <p className="kr-filter-label">CHẾ ĐỘ TRẮC NGHIỆM</p>
          <SegmentedControl dense options={QUIZ_MODE_OPTIONS} value={settings.quizMode} onChange={(value) => updateSettings({ quizMode: value })} />
        </div>
        <div>
          <p className="kr-filter-label">LOẠI THẺ</p>
          <SegmentedControl dense options={KIND_OPTIONS} value={kindFilter} onChange={setKindFilter} />
        </div>
        <div>
          <p className="kr-filter-label">TRẠNG THÁI</p>
          <SegmentedControl
            dense
            options={[
              { value: 'all' as const, label: `Tất cả (${sortedCards.length})` },
              { value: 'learned' as const, label: `Đã thuộc (${learnedCount})` },
              { value: 'unlearned' as const, label: `Chưa thuộc (${sortedCards.length - learnedCount})` },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      <div className="kr-card-list-header">
        <p className="kr-section-label">DANH SÁCH THẺ</p>
        <p className="kr-section-meta">
          {visibleCards.length} thẻ
          {normalizedQuery || statusFilter !== 'all' || kindFilter !== 'all' ? ` (đã lọc / ${sortedCards.length} tổng)` : ''}
        </p>
      </div>

      {visibleCards.length === 0 && (
        <p className="kr-glass py-10 text-center text-sm text-muted">
          {sortedCards.length === 0 ? 'Chưa có thẻ nào. Nhấn "Thêm thẻ" để bắt đầu.' : 'Không có thẻ nào khớp.'}
        </p>
      )}

      <div className="kr-card-grid">
        {pagedCards.map((card, i) => {
          const showLessonHeader = i === 0 || pagedCards[i - 1].lesson !== card.lesson
          return (
            <div key={card.id} className="contents">
              {showLessonHeader && (
                <p className="kr-lesson-group-header">
                  제{card.lesson}과 · {LESSON_TITLES[card.lesson] ?? ''}
                </p>
              )}
              <VocabTile card={card} progress={progressByCard.get(card.id)} learned={isLearned(card.id)} onClick={() => openAddCard(card.id)} />
            </div>
          )
        })}
      </div>

      {hasMore && (
        <button type="button" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="kr-glass mt-2 w-full py-3 text-sm font-semibold text-muted">
          Xem thêm {Math.min(PAGE_SIZE, visibleCards.length - visibleCount)} thẻ ↓
        </button>
      )}
    </div>
  )
}

function LessonContent({
  lesson,
  cards,
  progressByCard,
  isLearned,
  openAddCard,
}: {
  lesson: number
  cards: KoreanCard[]
  progressByCard: Map<string, KoreanProgress>
  isLearned: (id: string) => boolean
  openAddCard: (cardId?: string) => void
}) {
  const lessonCards = cards.filter((c) => c.lesson === lesson)
  const vocabCards = lessonCards.filter((c) => c.kind === 'vocab')
  const grammarCards = lessonCards.filter((c) => c.kind === 'grammar')

  return (
    <div className="kr-content">
      <div className="kr-content-header">
        <div>
          <p className="kr-eyebrow">한국어 공부 · 제{lesson}과</p>
          <h1 className="kr-page-title">{LESSON_TITLES[lesson] ?? ''}</h1>
        </div>
        <div className="kr-content-header-actions">
          <Link href={`/korean/study?lesson=${lesson}`} className="kr-btn-outline">
            🎴 Ôn tập
          </Link>
          <Link href={`/korean/quiz?lesson=${lesson}`} className="kr-btn-solid">
            📝 Kiểm tra
          </Link>
        </div>
      </div>

      <p className="kr-section-title">
        📚 Từ vựng <span className="kr-section-count">({vocabCards.length})</span>
      </p>
      {vocabCards.length === 0 ? (
        <p className="kr-glass py-6 text-center text-sm text-muted">Chưa có từ vựng nào trong bài này.</p>
      ) : (
        <div className="kr-vocab-tile-grid">
          {vocabCards.map((card) => (
            <VocabTile key={card.id} card={card} progress={progressByCard.get(card.id)} learned={isLearned(card.id)} onClick={() => openAddCard(card.id)} />
          ))}
        </div>
      )}

      <p className="kr-section-title">
        ✏️ Ngữ pháp <span className="kr-section-count">({grammarCards.length})</span>
      </p>
      {grammarCards.length === 0 ? (
        <p className="kr-glass py-6 text-center text-sm text-muted">Chưa có ngữ pháp nào trong bài này.</p>
      ) : (
        <div className="kr-grammar-list">
          {grammarCards.map((card) => (
            <GrammarCard key={card.id} card={card} onEdit={() => openAddCard(card.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

function VocabTile({ card, progress, learned, onClick }: { card: KoreanCard; progress: KoreanProgress | undefined; learned: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="kr-glass flex items-center justify-between gap-3 p-3 text-left transition-shadow hover:shadow-md">
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
      {progress && (progress.correctCount > 0 || progress.wrongCount > 0) && (
        <div className="flex shrink-0 flex-col items-end gap-1 text-xs font-semibold">
          {progress.correctCount > 0 && <span className="rounded-pill bg-accent-soft px-2 py-0.5 text-accent-strong">✓ {progress.correctCount}</span>}
          {progress.wrongCount > 0 && <span className="rounded-pill bg-danger-soft px-2 py-0.5 text-danger">✕ {progress.wrongCount}</span>}
        </div>
      )}
    </button>
  )
}

function GrammarCard({ card, onEdit }: { card: KoreanCard; onEdit: () => void }) {
  return (
    <div className="kr-glass kr-grammar-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="kr-grammar-eyebrow">✏️ NGỮ PHÁP</p>
          <h3 className="kr-grammar-title">{card.front}</h3>
        </div>
        <button type="button" onClick={onEdit} aria-label="Sửa thẻ" className="kr-lesson-row-action mt-1 shrink-0">
          ✎
        </button>
      </div>
      <p className="kr-grammar-meaning">{card.meaning}</p>

      {card.note && (
        <div className="kr-grammar-structure">
          <span className="kr-grammar-structure-label">Cấu trúc</span>
          <span className="kr-grammar-structure-text">{card.note}</span>
        </div>
      )}

      {card.theory && (
        <div className="kr-grammar-theory">
          {card.theory.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      <GrammarExamples card={card} />
    </div>
  )
}

function GrammarExamples({ card }: { card: KoreanCard }) {
  let details: ExampleDetail[] = []
  try {
    details = card.exampleDetail ? JSON.parse(card.exampleDetail) : []
  } catch {
    details = []
  }

  if (details.length > 0) {
    return (
      <div className="kr-grammar-examples">
        <span className="kr-grammar-examples-label">Ví dụ</span>
        {details.map((d, i) => (
          <div key={i} className="kr-grammar-example">
            <p className="kr-grammar-example-line">{d.ko}</p>
            <p className="kr-grammar-example-vi">{d.vi}</p>
            {d.vocab && (
              <p className="kr-grammar-example-note">
                <span className="kr-grammar-example-note-label">Từ vựng</span> {d.vocab}
              </p>
            )}
            {d.breakdown && (
              <p className="kr-grammar-example-note">
                <span className="kr-grammar-example-note-label">Biến đổi</span> {d.breakdown}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (!card.example) return null
  return (
    <div className="kr-grammar-examples">
      <span className="kr-grammar-examples-label">Ví dụ</span>
      {card.example.split('\n').map((ex, i) => (
        <p key={i} className="kr-grammar-example-line">
          {ex}
        </p>
      ))}
    </div>
  )
}
