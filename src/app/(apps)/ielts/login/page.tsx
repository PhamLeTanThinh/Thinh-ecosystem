'use client'

import { useState } from 'react'

export default function IeltsLoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [message, setMessage] = useState('')

  async function submit() {
    const trimmed = email.trim()
    if (!trimmed) return
    setStatus('sending')
    try {
      const res = await fetch('/api/ielts/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const data = await res.json()
      setMessage(data.message || 'Đã gửi yêu cầu.')
      setStatus('sent')
    } catch {
      setMessage('Có lỗi xảy ra, thử lại sau.')
      setStatus('idle')
    }
  }

  return (
    <div className="ih-access-denied">
      <h1 className="ih-font-hand" style={{ fontSize: 24, marginBottom: 4 }}>
        IELTS Knowledge Hub
      </h1>
      <p>Nhập email đã được mời để nhận link đăng nhập.</p>

      {status === 'sent' ? (
        <p style={{ maxWidth: 360 }}>{message}</p>
      ) : (
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <input
            className="ih-input"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
          />
          <button type="button" className="ih-btn-solid" onClick={submit} disabled={status === 'sending'}>
            {status === 'sending' ? 'Đang gửi…' : 'Gửi link'}
          </button>
        </div>
      )}
    </div>
  )
}
