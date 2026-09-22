'use client'

import { useEffect, type ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  confirmLabel: string
  cancelLabel: string
  // danger: nút xác nhận màu đỏ và focus mặc định ở nút Huỷ (tránh bấm Enter nhầm vào hành động phá huỷ).
  tone?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

// Hộp thoại xác nhận trong giao diện (thay window.confirm của trình duyệt): Esc / bấm nền = huỷ.
export function ConfirmDialog({ title, children, confirmLabel, cancelLabel, tone = 'default', onConfirm, onCancel }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="ih-cf-overlay" onMouseDown={onCancel}>
      <div className="ih-cf" role="alertdialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}>
        <h2 className="ih-cf-title">{title}</h2>
        <div className="ih-cf-body">{children}</div>
        <div className="ih-cf-actions">
          <button type="button" className="ih-cf-btn" autoFocus={tone === 'danger'} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={`ih-cf-btn primary${tone === 'danger' ? ' danger' : ''}`} autoFocus={tone !== 'danger'} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
