'use client'

import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { PinyinPosition } from '@/lib/chinese/types'

interface FlashCardProps {
  hanzi: string
  pinyin: string
  meaning: string
  pinyinPosition: PinyinPosition
  flipped: boolean
  onFlip: () => void
  onSwipe: (direction: 'left' | 'right') => void
}

const SWIPE_THRESHOLD = 100 // px kéo ngang tối thiểu để tính là quẹt
const TAP_THRESHOLD = 8 // px di chuyển tối đa để vẫn tính là tap (không phải kéo)
const FLY_OUT_DISTANCE = 600

// Cỡ chữ co theo độ dài để những cụm từ/câu dài (VD "早吃好，午吃饱，晚吃少") không bị tràn khung.
function hanziSizeClass(length: number) {
  if (length <= 4) return 'text-6xl'
  if (length <= 8) return 'text-4xl'
  if (length <= 15) return 'text-2xl'
  return 'text-lg'
}

function meaningSizeClass(length: number) {
  if (length <= 15) return 'text-3xl'
  if (length <= 30) return 'text-xl'
  return 'text-base'
}

// Flip 3D bằng CSS transform (backface-visibility:hidden). Kéo ngang quá SWIPE_THRESHOLD rồi thả
// ra sẽ bay thẻ ra khỏi màn hình và báo kết quả, giống thao tác quẹt Tinder.
export function FlashCard({ hanzi, pinyin, meaning, pinyinPosition, flipped, onFlip, onSwipe }: FlashCardProps) {
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [flyingOut, setFlyingOut] = useState<'left' | 'right' | null>(null)
  const startXRef = useRef(0)

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (flyingOut) return
    startXRef.current = e.clientX
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging) return
    setDragX(e.clientX - startXRef.current)
  }

  function handlePointerUp() {
    if (!dragging) return
    setDragging(false)

    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      const direction = dragX > 0 ? 'right' : 'left'
      setFlyingOut(direction)
      setTimeout(() => onSwipe(direction), 250)
      return
    }

    if (Math.abs(dragX) < TAP_THRESHOLD) {
      onFlip()
    }
    setDragX(0)
  }

  const swipeProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1)
  const translateX = flyingOut ? (flyingOut === 'right' ? FLY_OUT_DISTANCE : -FLY_OUT_DISTANCE) : dragX
  const rotate = flyingOut ? (flyingOut === 'right' ? 20 : -20) : dragX / 20

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative aspect-[3/4] w-full max-w-xs cursor-grab touch-none select-none perspective-distant active:cursor-grabbing"
      style={{
        transform: `translateX(${translateX}px) rotate(${rotate}deg)`,
        transition: dragging ? 'none' : 'transform 300ms ease-out, opacity 250ms ease-out',
        opacity: flyingOut ? 0 : 1,
      }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-card border border-black/5 bg-linear-to-br from-card to-brand-soft shadow-xl backface-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-8 border-brand/10" />
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
            <span className={`text-center leading-tight font-bold text-brand-strong drop-shadow-sm ${hanziSizeClass(hanzi.length)}`}>
              {hanzi}
            </span>
            {pinyinPosition === 'hanzi' && (
              <span className="rounded-pill bg-white/70 px-3 py-1 text-base font-medium text-muted">{pinyin}</span>
            )}
            <span className="absolute bottom-6 text-xs text-muted">👆 Chạm xem nghĩa · 👉 Quẹt chấm điểm</span>
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden rounded-card border border-black/5 bg-linear-to-br from-card to-accent-soft shadow-xl backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="pointer-events-none absolute -left-8 -bottom-8 h-28 w-28 rounded-full border-8 border-accent/10" />
          <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
            <span className={`text-center font-bold leading-tight text-accent-strong ${meaningSizeClass(meaning.length)}`}>
              {meaning}
            </span>
            {pinyinPosition === 'vietnamese' && (
              <span className="rounded-pill bg-white/70 px-3 py-1 text-base font-medium text-muted">{pinyin}</span>
            )}
            <span className="absolute bottom-6 text-xs text-muted">👆 Chạm xem Hán tự · 👉 Quẹt chấm điểm</span>
          </div>
        </div>
      </div>

      {dragX > 20 && (
        <div
          className="absolute right-4 top-4 rotate-12 rounded-xl border-4 border-accent bg-accent-soft/90 px-3 py-1 text-lg font-black tracking-wide text-accent-strong"
          style={{ opacity: swipeProgress }}
        >
          ĐÃ THUỘC
        </div>
      )}
      {dragX < -20 && (
        <div
          className="absolute left-4 top-4 -rotate-12 rounded-xl border-4 border-danger bg-danger-soft/90 px-3 py-1 text-lg font-black tracking-wide text-danger"
          style={{ opacity: swipeProgress }}
        >
          CHƯA THUỘC
        </div>
      )}
    </div>
  )
}
