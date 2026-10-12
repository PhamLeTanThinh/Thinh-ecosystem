'use client'

import { useEffect, useRef } from 'react'
import { closeDialog, useTripsDialog } from '@/lib/trips/dialog'

// Hộp xác nhận / thông báo kiểu tấm vé, thay cho popup mặc định của trình duyệt (xem lib/trips/dialog.ts).
// Esc / bấm nền = huỷ. Focus sẵn nút đồng ý, riêng hộp nguy hiểm thì focus nút huỷ để lỡ bấm Enter cũng không xoá.
export function TripsDialog() {
  const dialog = useTripsDialog((s) => s.dialog)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!dialog) return
    const danger = dialog.tone === 'danger' && dialog.cancelLabel !== null
    ;(danger ? cancelRef : confirmRef).current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDialog(dialog.cancelLabel === null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialog])

  if (!dialog) return null
  const danger = dialog.tone === 'danger'
  const single = dialog.cancelLabel === null

  return (
    <div className="tp-dialog fixed inset-0 z-80 flex items-end justify-center p-4 sm:items-center" role="presentation">
      <button type="button" aria-label="Đóng" onClick={() => closeDialog(single)} className="absolute inset-0 bg-(--tp-ink)/55 backdrop-blur-[2px]" />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="tp-dialog-title"
        aria-describedby={dialog.message ? 'tp-dialog-msg' : undefined}
        className="tp-ticket tp-dialog-card relative w-full max-w-sm overflow-hidden"
      >
        <div className={`h-1.5 ${danger ? 'bg-danger' : 'tp-ticket-band'}`} />
        <div className="px-6 pb-5 pt-6 text-center">
          <span
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${danger ? 'bg-danger-soft' : 'bg-accent-soft'}`}
            aria-hidden="true"
          >
            {dialog.icon ?? (danger ? '🗑️' : '🧭')}
          </span>
          <h2 id="tp-dialog-title" className="tp-display mt-4 text-xl font-bold leading-snug text-(--tp-ink)">
            {dialog.title}
          </h2>
          {dialog.message && (
            <p id="tp-dialog-msg" className="mt-2 whitespace-pre-line text-sm text-muted">
              {dialog.message}
            </p>
          )}
        </div>
        <div className="tp-perf" />
        <div className={`grid gap-2 p-4 ${single ? '' : 'grid-cols-2'}`}>
          {!single && (
            <button
              ref={cancelRef}
              type="button"
              onClick={() => closeDialog(false)}
              className="rounded-pill border border-border py-3 text-sm font-semibold text-text transition hover:bg-card-soft focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
            >
              {dialog.cancelLabel ?? 'Huỷ'}
            </button>
          )}
          <button
            ref={confirmRef}
            type="button"
            onClick={() => closeDialog(true)}
            className={`rounded-pill py-3 text-sm font-semibold text-white transition active:scale-95 focus-visible:ring-2 focus-visible:outline-none ${
              danger ? 'bg-danger focus-visible:ring-danger/40' : 'bg-(--tp-ink) focus-visible:ring-accent/40'
            }`}
          >
            {dialog.confirmLabel ?? 'Đồng ý'}
          </button>
        </div>
      </div>
    </div>
  )
}
