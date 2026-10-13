'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fundTheme } from '@/lib/trips/themes'
import { categoryOf, formatDate, formatVND, type Fund, type FundEntry, type FundMember } from '@/lib/trips/types'
import { Avatar } from './ui'

// Popup xem ảnh chứng từ của 1 khoản chi: đầu khung là thông tin khoản (tên, số tiền, ngày, ai trả), giữa là ảnh lớn có
// nút ‹ ›, cuối là dải ảnh nhỏ để chọn + mở ảnh gốc. Desktop: khung giữa màn hình; mobile: trượt từ dưới lên.
// ← → chuyển ảnh, Esc / bấm nền đóng. Render vào .trips-root để giữ màu / font của theme quỹ.
export function PhotoViewer({
  fund,
  entry,
  members,
  start,
  onClose,
}: {
  fund: Fund
  entry: FundEntry
  members: FundMember[]
  start: number
  onClose: () => void
}) {
  const photos = entry.attachments
  const [i, setI] = useState(Math.min(start, photos.length - 1))
  const [shown, setShown] = useState(false)
  const stripRef = useRef<HTMLDivElement>(null)
  const go = (d: number) => setI((x) => (x + d + photos.length) % photos.length)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true))
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setI((x) => (x + 1) % photos.length)
      if (e.key === 'ArrowLeft') setI((x) => (x - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [photos.length, onClose])

  // Ảnh nhỏ đang chọn luôn nằm trong tầm nhìn của dải ảnh
  useEffect(() => {
    stripRef.current?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [i])

  if (!photos.length) return null
  const theme = fundTheme(fund)
  const cat = categoryOf('out', entry.category)
  const payer = members.find((m) => m.id === entry.memberId)
  const root = document.querySelector('.trips-root') ?? document.body

  return createPortal(
    <div
      className={`tp-theme-${theme.key} fixed inset-0 z-90 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-200 sm:items-center sm:p-6 ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Ảnh chứng từ — ${entry.note || cat.label}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[94dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] bg-card shadow-2xl transition-transform duration-300 ease-out sm:rounded-[28px] ${
          shown ? 'translate-y-0 sm:scale-100' : 'translate-y-8 sm:scale-95'
        }`}
      >
        {/* Thông tin khoản chi */}
        <div className="flex items-start gap-3 border-b border-border px-4 py-3 sm:px-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-danger-soft text-xl">{cat.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="tp-display truncate text-lg font-bold text-(--tp-ink)">{entry.note || cat.label}</p>
            <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
              <span>{formatDate(entry.date)}</span>
              <span>·</span>
              <span>{cat.label}</span>
              <span>·</span>
              {payer ? (
                <span className="inline-flex items-center gap-1">
                  <Avatar id={payer.id} name={payer.name} size={16} />
                  {payer.name} ứng
                </span>
              ) : (
                <span>Quỹ chung</span>
              )}
            </p>
          </div>
          <span className="tp-mono shrink-0 pt-1 text-base font-bold tracking-normal text-danger">−{formatVND(entry.amount)}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card-soft text-muted transition hover:text-text"
          >
            ✕
          </button>
        </div>

        {/* Ảnh lớn */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#15171c] p-2 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- ảnh R2 domain động */}
          <img key={photos[i].key} src={photos[i].url} alt={`Ảnh chứng từ ${i + 1}`} className="max-h-[62dvh] max-w-full rounded-xl object-contain" />
          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Ảnh trước"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-(--tp-ink) shadow-lg transition hover:bg-white active:scale-95 sm:left-4"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Ảnh sau"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-(--tp-ink) shadow-lg transition hover:bg-white active:scale-95 sm:right-4"
              >
                ›
              </button>
              <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-pill bg-black/55 px-3 py-1 text-xs font-semibold text-white">
                {i + 1} / {photos.length}
              </span>
            </>
          )}
        </div>

        {/* Dải ảnh nhỏ + mở ảnh gốc */}
        <div className="flex items-center gap-3 border-t border-border px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] sm:px-5 sm:pb-3">
          <div ref={stripRef} className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {photos.map((p, k) => (
              <button
                key={p.key}
                type="button"
                data-i={k}
                onClick={() => setI(k)}
                aria-label={`Ảnh ${k + 1}`}
                aria-current={k === i}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition ${k === i ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- ảnh R2 domain động */}
                <img src={p.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <a
            href={photos[i].url}
            target="_blank"
            rel="noopener"
            className="shrink-0 rounded-pill border border-border px-3 py-2 text-xs font-semibold text-accent transition hover:border-accent"
          >
            ↗ Ảnh gốc
          </a>
        </div>
      </div>
    </div>,
    root,
  )
}
