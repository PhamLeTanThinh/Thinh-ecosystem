'use client'

import { useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { speak } from '@/lib/shared/speech'
import { POS_LABELS } from '@/components/shared/vocab/pos'
import { WordParts } from '@/components/shared/vocab/WordParts'
import type { ReviewCard, ReviewDirection } from './types'

const SWIPE_THRESHOLD = 90 // px kéo ngang tối thiểu để tính là quẹt
const AXIS_LOCK = 8 // px di chuyển đầu tiên để chốt hướng kéo (ngang = quẹt thẻ, dọc = cuộn trang); ít hơn = chạm (lật thẻ)

function wordSize(len: number) {
  if (len <= 4) return 'rv-xl'
  if (len <= 8) return 'rv-lg'
  if (len <= 16) return 'rv-md'
  return 'rv-sm'
}

// Thẻ lật 3D + quẹt trái/phải để chấm (như Tinder). Hai mặt xếp chồng trong cùng 1 ô grid nên chiều cao thẻ
// = mặt cao hơn — mặt sau nhiều nội dung (ảnh, ví dụ, cấu tạo từ) không bị cắt.
// Trên điện thoại thẻ chặn hết cử chỉ mặc định (touch-action: none) rồi tự chốt hướng sau vài px đầu: kéo ngang
// chỉ quẹt thẻ (trang đứng yên — trước đây trình duyệt vừa quẹt vừa cuộn), kéo dọc thì tự cuộn trang bằng tay.
// Quẹt chỉ dành cho màn cảm ứng (điện thoại, tablet): chuột trên desktop chỉ bấm để lật — chấm bằng nút / phím tắt.
// Quẹt xong báo kết quả NGAY (thẻ kế tiếp hiện liền, quẹt tiếp được không phải chờ); hiệu ứng bay ra do 1 bản sao
// `ghost` (không nhận thao tác) đặt chồng lên — xem ReviewApp.
export function ReviewFlashCard({
  card,
  lang,
  direction,
  showReading,
  flipped,
  onFlip,
  onSwipe,
  ghost,
}: {
  card: ReviewCard
  lang: string
  direction: ReviewDirection
  showReading: boolean
  flipped: boolean
  onFlip: () => void
  onSwipe?: (direction: 'left' | 'right', fromX: number) => void
  ghost?: { dir: 'left' | 'right'; fromX: number } // bản sao đang bay ra sau khi chấm
}) {
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  // onButton: bắt đầu trên nút 🔊 — kéo đi thì vẫn là quẹt/cuộn, chỉ chạm thì để nút tự xử lý (không lật thẻ).
  // Chỉ giữ con trỏ (pointer capture) khi đã chốt hướng, để cú chạm vào nút vẫn ra sự kiện click bình thường.
  const gesture = useRef<{ x: number; y: number; lastY: number; axis: 'x' | 'y' | null; onButton: boolean } | null>(null)

  function down(e: ReactPointerEvent<HTMLDivElement>) {
    if (ghost) return
    gesture.current = { x: e.clientX, y: e.clientY, lastY: e.clientY, axis: null, onButton: !!(e.target as HTMLElement).closest('button') }
    setDragging(true)
  }
  function move(e: ReactPointerEvent<HTMLDivElement>) {
    const g = gesture.current
    if (!g || e.pointerType === 'mouse') return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (!g.axis && Math.max(Math.abs(dx), Math.abs(dy)) > AXIS_LOCK) {
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (g.axis === 'x') setDragX(dx)
    else if (g.axis === 'y') {
      window.scrollBy(0, g.lastY - e.clientY)
      g.lastY = e.clientY
    }
  }
  function up() {
    const g = gesture.current
    gesture.current = null
    setDragging(false)
    if (!g) return
    if (g.axis === 'x' && Math.abs(dragX) > SWIPE_THRESHOLD) {
      onSwipe?.(dragX > 0 ? 'right' : 'left', dragX)
      return
    }
    if (!g.axis && !g.onButton) onFlip()
    setDragX(0)
  }
  function cancel() {
    gesture.current = null
    setDragging(false)
    setDragX(0)
  }

  const shownX = ghost ? ghost.fromX : dragX
  const progress = Math.min(Math.abs(shownX) / SWIPE_THRESHOLD, 1)

  const wordBlock = (big: boolean) => (
    <div className="rv-word-row">
      <span className={`rv-word ${big ? wordSize([...card.word].length) : 'rv-md'}`} lang={lang}>
        {card.word}
      </span>
      <button type="button" className="rv-speak" aria-label={`Phát âm ${card.word}`} onClick={() => speak(card.word, lang)}>
        🔊
      </button>
    </div>
  )

  return (
    <div
      className={`rv-card${ghost ? ` rv-ghost ${ghost.dir}` : ''}`}
      aria-hidden={ghost ? true : undefined}
      onPointerDown={ghost ? undefined : down}
      onPointerMove={ghost ? undefined : move}
      onPointerUp={ghost ? undefined : up}
      onPointerCancel={ghost ? undefined : cancel}
      style={
        ghost
          ? ({ '--from-x': `${ghost.fromX}px`, '--from-rot': `${ghost.fromX / 20}deg` } as React.CSSProperties)
          : { transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)`, transition: dragging ? 'none' : 'transform 260ms ease-out' }
      }
    >
      <div className={`rv-card-inner${flipped ? ' flipped' : ''}`}>
        {/* Mặt trước */}
        <div className="rv-face rv-front">
          <span className="rv-kind">{card.kind === 'grammar' ? '✏️ Ngữ pháp' : '📚 Từ vựng'}</span>
          {direction === 'word' ? (
            <>
              {wordBlock(true)}
              {showReading && card.reading && <span className="rv-reading">{card.reading}</span>}
            </>
          ) : (
            <>
              <span className={`rv-meaning-front ${wordSize(Math.ceil(card.meaning.length / 3))}`}>{card.meaning}</span>
              {card.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="rv-front-img" src={card.image} alt="" draggable={false} />
              )}
            </>
          )}
          <span className="rv-hint rv-hint-touch">Chạm để lật · quẹt ← chưa thuộc / → đã thuộc</span>
          <span className="rv-hint rv-hint-mouse">Bấm vào thẻ để lật</span>
        </div>

        {/* Mặt sau */}
        <div className="rv-face rv-back">
          {wordBlock(false)}
          {card.reading && <span className="rv-reading">{card.reading}</span>}
          {card.pos && card.pos.length > 0 && (
            <span className="rv-pos">
              {card.pos.map((p) => (
                <span key={p} className={`vs-pos vs-pos-${p}`}>
                  {POS_LABELS[p] ?? p}
                </span>
              ))}
            </span>
          )}
          <p className="rv-meaning">{card.meaning}</p>
          {card.sub && <p className="rv-sub">{card.sub}</p>}
          {card.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="rv-back-img" src={card.image} alt="" draggable={false} />
          )}
          {card.parts && <WordParts parts={card.parts} lang={lang} className="rv-parts" />}
          {card.example && (
            <div className="rv-example">
              <p lang={lang}>
                <button type="button" className="rv-speak rv-speak-sm" aria-label="Đọc câu ví dụ" onClick={() => speak(card.example!, lang)}>
                  🔊
                </button>
                {card.example}
              </p>
              {card.exampleReading && <p className="rv-example-reading">{card.exampleReading}</p>}
              {card.exampleVi && <p className="rv-example-vi">{card.exampleVi}</p>}
            </div>
          )}
        </div>
      </div>

      {shownX > 20 && (
        <span className="rv-stamp ok" style={{ opacity: progress }}>
          ĐÃ THUỘC
        </span>
      )}
      {shownX < -20 && (
        <span className="rv-stamp bad" style={{ opacity: progress }}>
          CHƯA THUỘC
        </span>
      )}
    </div>
  )
}
