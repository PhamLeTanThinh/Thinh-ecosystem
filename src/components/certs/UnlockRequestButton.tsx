'use client'

import { useState } from 'react'
import type { UnlockStatus } from '@/lib/certs/unlock'

// Nút ở card cert đang khoá (trang /certs): bấm = mở ô hỏi họ tên đầy đủ, gửi = yêu cầu mở cert cho chủ trang
// (POST /api/certs/unlock-requests). Đã xin thì hiện "Đang chờ duyệt"; bị từ chối thì khoá nút luôn — xin lại cũng
// không báo chủ nữa (lib/certs/unlock.ts).
export function UnlockRequestButton({ certId, code, initial }: { certId: string; code: string; initial: UnlockStatus | null }) {
  const [status, setStatus] = useState<UnlockStatus | 'asking' | 'sending' | null>(initial)
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function request() {
    const name = fullName.trim().replace(/\s+/g, ' ')
    if (name.length < 2) {
      setError('Bạn nhập họ tên đầy đủ giúp mình nhé.')
      return
    }
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/certs/unlock-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certId, fullName: name }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 409) throw new Error('Bạn tạo hồ sơ học trước rồi xin quyền nhé.')
      if (!res.ok) throw new Error('Chưa gửi được, thử lại sau chút nhé.')
      // Chủ vừa mở cert này trong lúc trang đang mở → tải lại để hiện nút vào học.
      if (data.status === 'granted') return window.location.reload()
      setStatus('pending')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chưa gửi được, thử lại sau chút nhé.')
      setStatus('asking')
    }
  }

  return (
    <div className="ct-locked-actions">
      {status === 'pending' ? (
        <p className="ct-locked-note">⏳ Đã gửi yêu cầu — đang chờ chủ trang duyệt {code}.</p>
      ) : status === 'rejected' ? (
        <p className="ct-locked-note">Yêu cầu xem {code} chưa được duyệt.</p>
      ) : status === 'asking' || status === 'sending' ? (
        <form
          className="ct-unlock-form"
          onSubmit={(e) => {
            e.preventDefault()
            request()
          }}
        >
          <label className="ct-unlock-label" htmlFor={`unlock-name-${certId}`}>
            Họ tên đầy đủ của bạn
          </label>
          <input
            id={`unlock-name-${certId}`}
            className="ct-unlock-input"
            type="text"
            autoComplete="name"
            placeholder="Vd: Nguyễn Văn An"
            maxLength={80}
            value={fullName}
            autoFocus
            onChange={(e) => {
              setFullName(e.target.value)
              setError(null)
            }}
          />
          <div className="ct-unlock-row">
            <button type="button" className="ct-unlock-cancel" onClick={() => setStatus(null)} disabled={status === 'sending'}>
              Huỷ
            </button>
            <button type="submit" className="ct-unlock-submit" disabled={status === 'sending' || !fullName.trim()}>
              {status === 'sending' ? 'Đang gửi…' : `Gửi yêu cầu xem ${code}`}
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="ct-action ct-action--primary ct-unlock-btn" onClick={() => setStatus('asking')}>
          <span className="ct-action-icon">🔐</span>
          <span className="ct-action-label">Xin quyền xem</span>
          <span className="ct-action-meta">Chủ trang duyệt xong là vào học được</span>
        </button>
      )}
      {error && <p className="ct-locked-note ct-locked-error">{error}</p>}
    </div>
  )
}
