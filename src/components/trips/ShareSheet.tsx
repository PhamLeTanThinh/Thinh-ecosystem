'use client'

import { useState } from 'react'
import { BottomSheet } from '@/components/money/BottomSheet'
import { SheetHeader } from '@/components/money/SheetHeader'
import { askConfirm, showError } from '@/lib/trips/dialog'
import { useTrips } from '@/lib/trips/store'
import type { Fund } from '@/lib/trips/types'
import { BusyLabel } from './ui'

export const shareUrl = (slug: string) => `${window.location.origin}/trips/share/${slug}`

// Chia sẻ link chỉ-xem (kiểu "ai có link đều xem được" của Google Drive): bật / copy / đổi link / tắt
export function ShareSheet({ fund, open, onClose }: { fund: Fund; open: boolean; onClose: () => void }) {
  const setShare = useTrips((s) => s.setShare)
  const [busy, setBusy] = useState<'enable' | 'disable' | 'regenerate' | null>(null)
  const [copied, setCopied] = useState(false)
  const url = fund.shareSlug ? shareUrl(fund.shareSlug) : ''

  async function run(action: 'enable' | 'disable' | 'regenerate') {
    if (action !== 'enable') {
      const ok = await askConfirm(
        action === 'disable'
          ? {
              title: 'Tắt link chia sẻ?',
              message: 'Ai đang có link sẽ không xem được nữa. Bật lại sẽ tạo link mới.',
              confirmLabel: 'Tắt chia sẻ',
              tone: 'danger',
              icon: '🔒',
            }
          : {
              title: 'Đổi link mới?',
              message: 'Link cũ hết hiệu lực ngay — cần gửi lại link mới cho mọi người.',
              confirmLabel: 'Đổi link',
              tone: 'danger',
              icon: '🔁',
            },
      )
      if (!ok) return
    }
    setBusy(action)
    try {
      await setShare(fund.id, action)
    } catch (e) {
      showError(e)
    } finally {
      setBusy(null)
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Mở qua http (IP mạng LAN) không có Clipboard API → cách cũ
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <BottomSheet open={open} onClose={onClose} responsive closeOnBackdrop={false}>
      <SheetHeader title="Chia sẻ link chỉ xem" onCancel={onClose} cancelLabel="Đóng" />
      <div className="space-y-5 px-4 py-5">
        <div className="flex items-start gap-3 rounded-2xl bg-accent-soft px-4 py-3 text-sm">
          <span className="text-2xl">👀</span>
          <p>
            Ai có link đều <b>xem được</b> toàn bộ tổng quan của &ldquo;{fund.name}&rdquo; — số dư, ai đã đóng, chi tiêu kèm ảnh chứng từ — nhưng{' '}
            <b>không sửa được gì</b>. Liên hệ & ghi chú riêng của thành viên được ẩn.
          </p>
        </div>

        {fund.shareSlug ? (
          <>
            <div>
              <p className="text-sm text-muted">Link chia sẻ (đang bật)</p>
              <div className="mt-1 flex gap-2">
                <input
                  readOnly
                  value={url}
                  onFocus={(e) => e.target.select()}
                  className="min-w-0 flex-1 rounded-xl bg-card-soft px-3 py-2.5 text-sm font-medium outline-none"
                  aria-label="Link chia sẻ"
                />
                <button
                  type="button"
                  onClick={copy}
                  className={`shrink-0 rounded-xl px-4 text-sm font-semibold text-white transition active:scale-95 ${copied ? 'bg-accent' : 'bg-(--tp-ink)'}`}
                >
                  {copied ? '✓ Đã copy' : '📋 Copy'}
                </button>
              </div>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-accent hover:border-accent"
            >
              ↗ Mở xem thử như người nhận
            </a>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!!busy}
                onClick={() => run('regenerate')}
                className="rounded-xl bg-card-soft py-3 text-sm font-semibold disabled:opacity-60"
              >
                <BusyLabel busy={busy === 'regenerate'} label="Đang đổi…">
                  🔁 Đổi link mới
                </BusyLabel>
              </button>
              <button
                type="button"
                disabled={!!busy}
                onClick={() => run('disable')}
                className="rounded-xl bg-danger-soft py-3 text-sm font-semibold text-danger disabled:opacity-60"
              >
                <BusyLabel busy={busy === 'disable'} label="Đang tắt…">
                  🔒 Tắt chia sẻ
                </BusyLabel>
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={!!busy}
            onClick={() => run('enable')}
            className="w-full rounded-xl bg-(--tp-ink) py-3.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            <BusyLabel busy={busy === 'enable'} label="Đang tạo link…">
              🔗 Tạo link chia sẻ
            </BusyLabel>
          </button>
        )}
      </div>
    </BottomSheet>
  )
}
