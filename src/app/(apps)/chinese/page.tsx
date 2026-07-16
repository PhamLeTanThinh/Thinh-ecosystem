'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useChineseStore } from '@/lib/chinese/store'
import { useChineseUIStore } from '@/lib/chinese/uiStore'
import { SegmentedControl } from '@/components/chinese/SegmentedControl'
import type { PinyinPosition } from '@/lib/chinese/types'

const PAGE_SIZE = 30

const PINYIN_POSITION_OPTIONS: { value: PinyinPosition; label: string }[] = [
  { value: 'hanzi', label: 'Cùng mặt Hán tự' },
  { value: 'vietnamese', label: 'Cùng mặt tiếng Việt' },
]

const SHUFFLE_OPTIONS: { value: 'on' | 'off'; label: string }[] = [
  { value: 'on', label: '🔀 Ngẫu nhiên' },
  { value: 'off', label: 'Theo danh sách' },
]

type StatusFilter = 'all' | 'learned' | 'unlearned'

export default function ChinesePage() {
  const cards = useChineseStore((s) => s.cards)
  const progress = useChineseStore((s) => s.progress)
  const settings = useChineseStore((s) => s.settings)
  const decks = useChineseStore((s) => s.decks)
  const updateSettings = useChineseStore((s) => s.updateSettings)
  const addDeck = useChineseStore((s) => s.addDeck)
  const deleteDeck = useChineseStore((s) => s.deleteDeck)
  const openAddCard = useChineseUIStore((s) => s.openAddCard)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selecting, setSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Quay lại trang đầu mỗi khi đổi bộ lọc hoặc từ khoá tìm kiếm — cập nhật state trong lúc
  // render (không phải effect) để tránh 1 nhịp render thừa, cùng convention với study/page.tsx.
  const [prevFilterKey, setPrevFilterKey] = useState(`${statusFilter}|${searchQuery}`)
  const filterKey = `${statusFilter}|${searchQuery}`
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setVisibleCount(PAGE_SIZE)
  }

  const progressByCard = new Map(progress.map((p) => [p.id, p]))
  const isLearned = (cardId: string) => progressByCard.get(cardId)?.lastResult === 'correct'

  const sortedCards = [...cards].sort((a, b) => a.sortOrder - b.sortOrder)
  const learnedCount = sortedCards.filter((c) => isLearned(c.id)).length
  const unlearnedCount = sortedCards.length - learnedCount
  const learnedPercent = sortedCards.length > 0 ? Math.round((learnedCount / sortedCards.length) * 100) : 0

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const visibleCards = sortedCards.filter((c) => {
    if (statusFilter === 'learned' && !isLearned(c.id)) return false
    if (statusFilter === 'unlearned' && isLearned(c.id)) return false
    if (!normalizedQuery) return true
    return (
      c.hanzi.toLowerCase().includes(normalizedQuery) ||
      c.pinyin.toLowerCase().includes(normalizedQuery) ||
      c.meaning.toLowerCase().includes(normalizedQuery)
    )
  })

  const pagedCards = visibleCards.slice(0, visibleCount)
  const hasMore = visibleCount < visibleCards.length

  function toggleSelecting() {
    setSelecting((s) => !s)
    setSelectedIds(new Set())
  }

  function toggleSelected(cardId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(cardId)) next.delete(cardId)
      else next.add(cardId)
      return next
    })
  }

  function handleCreateDeck() {
    const name = window.prompt('Tên bộ học:')
    if (!name || !name.trim()) return
    addDeck(name.trim(), Array.from(selectedIds))
    setSelecting(false)
    setSelectedIds(new Set())
  }

  function handleDeleteDeck(deckId: string, deckName: string) {
    if (!window.confirm(`Xoá bộ học "${deckName}"? Các từ vựng trong bộ không bị xoá.`)) return
    deleteDeck(deckId)
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-card bg-linear-to-br from-brand to-brand-strong p-6 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">学中文</p>
            <h1 className="mt-1 text-2xl font-bold">Từ Vựng Tiếng Trung</h1>
          </div>
          <button
            type="button"
            onClick={toggleSelecting}
            className={`shrink-0 rounded-pill border border-white/25 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors ${
              selecting ? 'bg-white text-brand-strong' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {selecting ? 'Huỷ' : 'Chọn từ'}
          </button>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/10 px-3 py-2.5 text-center backdrop-blur">
            <p className="text-lg font-bold">{sortedCards.length}</p>
            <p className="text-[11px] text-white/70">Tổng số từ</p>
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
        <span className="text-lg leading-none text-accent">＋</span> Thêm từ vựng mới
      </button>

      <Link
        href="/chinese/study"
        className="mt-3 flex items-center gap-4 rounded-card bg-linear-to-r from-accent to-accent-strong p-5 text-white shadow-lg transition-transform active:scale-[0.98]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-2xl">🎴</span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Bắt đầu ôn tập</span>
          <span className="block text-xs text-white/75">{sortedCards.length} thẻ · toàn bộ từ vựng</span>
        </span>
        <span className="text-xl">›</span>
      </Link>

      <div className="mt-4 flex flex-col gap-4 rounded-card bg-card p-4 shadow-sm">
        <div>
          <p className="mb-2 text-xs font-semibold text-muted">Hiện pinyin</p>
          <SegmentedControl
            options={PINYIN_POSITION_OPTIONS}
            value={settings.pinyinPosition}
            onChange={(value) => updateSettings({ pinyinPosition: value })}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-muted">Thứ tự ôn tập</p>
          <SegmentedControl
            options={SHUFFLE_OPTIONS}
            value={settings.shuffle ? 'on' : 'off'}
            onChange={(value) => updateSettings({ shuffle: value === 'on' })}
          />
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

      {decks.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold text-muted">Bộ học của tôi</p>
          <div className="flex flex-col gap-2">
            {decks.map((deck) => (
              <div key={deck.id} className="flex items-center justify-between gap-3 rounded-card bg-card p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold-soft text-lg text-gold">
                    📚
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{deck.name}</p>
                    <p className="text-xs text-muted">{deck.cardIds.length} từ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/chinese/study?deck=${deck.id}`}
                    className="rounded-pill bg-accent-soft px-3 py-1.5 text-xs font-semibold text-accent-strong"
                  >
                    Ôn tập
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteDeck(deck.id, deck.name)}
                    aria-label={`Xoá bộ học ${deck.name}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 pb-24">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-muted">Danh sách từ vựng</p>
          <p className="text-xs text-muted">
            {visibleCards.length} từ{normalizedQuery || statusFilter !== 'all' ? ` (đã lọc / ${sortedCards.length} tổng)` : ''}
          </p>
        </div>

        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Tìm theo Hán tự, pinyin hoặc nghĩa..."
          className="rounded-2xl border border-transparent bg-card-soft px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
        />

        {visibleCards.length === 0 && (
          <p className="rounded-card bg-card py-10 text-center text-sm text-muted shadow-sm">
            {sortedCards.length === 0 ? 'Chưa có từ vựng nào. Nhấn "Thêm từ vựng mới" để bắt đầu.' : 'Không có từ nào khớp.'}
          </p>
        )}
        {pagedCards.map((card) => {
          const cardProgress = progressByCard.get(card.id)
          const selected = selectedIds.has(card.id)
          const learned = isLearned(card.id)
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => (selecting ? toggleSelected(card.id) : openAddCard(card.id))}
              className={`flex items-center justify-between gap-3 rounded-card bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md ${
                selecting && selected ? 'ring-2 ring-accent' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {selecting && (
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                      selected ? 'border-accent bg-accent text-white' : 'border-border'
                    }`}
                  >
                    {selected && '✓'}
                  </span>
                )}
                <span
                  className={`relative flex min-h-14 min-w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft px-2 py-1.5 text-center font-bold leading-tight text-brand ${
                    card.hanzi.length <= 2 ? 'text-2xl' : card.hanzi.length <= 4 ? 'text-lg' : 'text-sm'
                  }`}
                >
                  {card.hanzi}
                  {learned && (
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white ring-2 ring-card">
                      ✓
                    </span>
                  )}
                </span>
                <div>
                  <p className="inline-block rounded-pill bg-card-soft px-2 py-0.5 text-xs text-muted">{card.pinyin}</p>
                  <p className="mt-1 text-sm font-medium">{card.meaning}</p>
                </div>
              </div>
              {!selecting && cardProgress && (cardProgress.correctCount > 0 || cardProgress.wrongCount > 0) && (
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
          )
        })}

        {hasMore && (
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-pill bg-card-soft py-3 text-sm font-semibold text-muted shadow-sm"
          >
            Xem thêm {Math.min(PAGE_SIZE, visibleCards.length - visibleCount)} từ ↓
          </button>
        )}
      </div>

      {selecting && selectedIds.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-xl items-center justify-between gap-3 border-t border-border bg-card/90 p-4 shadow-2xl backdrop-blur">
          <p className="text-sm font-medium">Đã chọn {selectedIds.size} từ</p>
          <button
            type="button"
            onClick={handleCreateDeck}
            className="rounded-pill bg-accent px-5 py-2.5 text-sm font-semibold text-white"
          >
            Tạo bộ học
          </button>
        </div>
      )}
    </div>
  )
}
