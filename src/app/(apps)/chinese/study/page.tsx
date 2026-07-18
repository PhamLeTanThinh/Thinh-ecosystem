'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useChineseStore } from '@/lib/chinese/store'
import { FlashCard } from '@/components/chinese/FlashCard'
import { shuffle } from '@/lib/chinese/shuffle'
import type { ChineseCard } from '@/lib/chinese/types'

// Xáo trộn nếu bật cài đặt, ngược lại ôn theo đúng thứ tự danh sách (sortOrder).
function buildOrder(cards: ChineseCard[], shuffleEnabled: boolean): string[] {
  const ids = [...cards].sort((a, b) => a.sortOrder - b.sortOrder).map((c) => c.id)
  return shuffleEnabled ? shuffle(ids) : ids
}

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
    <Suspense fallback={<StudyMessage text="Đang tải..." />}>
      <StudySession />
    </Suspense>
  )
}

function StudySession() {
  const deckId = useSearchParams().get('deck')

  const hydrated = useChineseStore((s) => s.hydrated)
  const allCards = useChineseStore((s) => s.cards)
  const decks = useChineseStore((s) => s.decks)
  const settings = useChineseStore((s) => s.settings)
  const markResult = useChineseStore((s) => s.markResult)

  const [order, setOrder] = useState<string[] | null>(null)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [tally, setTally] = useState({ correct: 0, wrong: 0 })

  if (!hydrated) return <StudyMessage text="Đang tải..." />

  const deck = deckId ? decks.find((d) => d.id === deckId) : undefined
  if (deckId && !deck) return <StudyMessage text="Không tìm thấy bộ học này." />

  const cards = deck ? allCards.filter((c) => deck.cardIds.includes(c.id)) : allCards

  // Xáo bài ngay khi cards vừa sẵn sàng — cập nhật state trong lúc render (không phải
  // effect) để tránh 1 nhịp render thừa, cùng convention với components/chinese/BottomSheet.tsx.
  if (order === null && cards.length > 0) {
    setOrder(buildOrder(cards, settings.shuffle))
  }

  if (cards.length === 0) {
    return <StudyMessage text={deck ? `Bộ "${deck.name}" chưa có từ nào.` : 'Chưa có từ vựng nào để ôn tập.'} />
  }

  if (order === null) return <StudyMessage text="Đang tải..." />

  const finished = index >= order.length

  if (finished) {
    const total = tally.correct + tally.wrong
    const percent = total > 0 ? Math.round((tally.correct / total) * 100) : 0
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-accent to-accent-strong text-4xl shadow-lg">
          🎉
        </span>
        <div>
          <p className="text-xl font-bold">Hoàn thành ôn tập!</p>
          <p className="mt-1 text-sm text-muted">{deck ? deck.name : 'Toàn bộ từ vựng'} · {percent}% chính xác</p>
        </div>

        <div className="flex w-full max-w-xs gap-3">
          <div className="flex-1 rounded-card bg-accent-soft p-4">
            <p className="text-2xl font-bold text-accent-strong">{tally.correct}</p>
            <p className="text-xs text-muted">✓ Đã thuộc</p>
          </div>
          <div className="flex-1 rounded-card bg-danger-soft p-4">
            <p className="text-2xl font-bold text-danger">{tally.wrong}</p>
            <p className="text-xs text-muted">✕ Chưa thuộc</p>
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setOrder(buildOrder(cards, settings.shuffle))
              setIndex(0)
              setFlipped(false)
              setTally({ correct: 0, wrong: 0 })
            }}
            className="rounded-pill bg-accent px-5 py-3 text-sm font-semibold text-white shadow-sm"
          >
            🔁 Ôn lại
          </button>
          <Link href="/chinese" className="rounded-pill border border-border bg-card px-5 py-3 text-sm font-semibold">
            Quay lại
          </Link>
        </div>
      </div>
    )
  }

  const card = cards.find((c) => c.id === order[index])
  if (!card) return null

  const handleResult = (result: 'correct' | 'wrong') => {
    markResult(card.id, result)
    setTally((t) => (result === 'correct' ? { ...t, correct: t.correct + 1 } : { ...t, wrong: t.wrong + 1 }))
    setFlipped(false)
    setIndex((i) => i + 1)
  }

  const progressPercent = Math.round((index / order.length) * 100)

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full max-w-xs items-center justify-between">
        <Link href="/chinese" className="text-sm font-medium text-accent">
          ‹ Quay lại
        </Link>
        <p className="text-sm font-medium text-muted">
          {deck ? `${deck.name} · ` : ''}
          {index + 1} / {order.length}
        </p>
      </div>

      <div className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-pill bg-card-soft">
        <div
          className="h-full rounded-pill bg-linear-to-r from-accent to-accent-strong transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-6 w-full max-w-xs">
        <FlashCard
          key={card.id}
          hanzi={card.hanzi}
          pinyin={card.pinyin}
          meaning={card.meaning}
          pinyinPosition={settings.pinyinPosition}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onSwipe={(direction) => handleResult(direction === 'right' ? 'correct' : 'wrong')}
        />
      </div>

      <div className="mt-6 flex w-full max-w-xs gap-3">
        <button
          type="button"
          onClick={() => handleResult('wrong')}
          className="flex-1 rounded-pill border-2 border-danger bg-card py-3.5 text-sm font-semibold text-danger shadow-sm transition-transform active:scale-95"
        >
          ✕ Chưa thuộc
        </button>
        <button
          type="button"
          onClick={() => handleResult('correct')}
          className="flex-1 rounded-pill bg-linear-to-r from-accent to-accent-strong py-3.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
        >
          ✓ Đã thuộc
        </button>
      </div>
    </div>
  )
}
