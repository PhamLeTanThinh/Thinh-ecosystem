'use client'

import { useEffect, useState } from 'react'
import { useIeltsAccess } from '@/components/ielts/AccessContext'

interface Invite {
  email: string
  invitedAt: string
  revokedAt: string | null
}

// Trang quản lý riêng cho chủ — mời/thu hồi quyền xem theo email. Nhập email rồi bấm mời sẽ gửi
// luôn 1 magic link đăng nhập tới đúng địa chỉ đó. Việc thực thi quyền thật nằm ở API
// (`requireOwnerApi`) — trang này chỉ ẩn UI cho gọn.
export default function IeltsAdminPage() {
  const { isOwner } = useIeltsAccess()
  const [invites, setInvites] = useState<Invite[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!isOwner) return
    fetch('/api/ielts/invites')
      .then((r) => r.json())
      .then((data) => setInvites(data))
      .finally(() => setLoading(false))
  }, [isOwner])

  async function inviteEmail() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    setSending(true)
    try {
      const res = await fetch('/api/ielts/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      const created: Invite = await res.json()
      setInvites((v) => (v.some((x) => x.email === created.email) ? v.map((x) => (x.email === created.email ? created : x)) : [...v, created]))
      setEmail('')
    } finally {
      setSending(false)
    }
  }

  async function toggleRevoke(targetEmail: string, revoked: boolean) {
    await fetch(`/api/ielts/invites/${encodeURIComponent(targetEmail)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revoked }),
    })
    setInvites((v) => v.map((x) => (x.email === targetEmail ? { ...x, revokedAt: revoked ? new Date().toISOString() : null } : x)))
  }

  async function removeInvite(targetEmail: string) {
    if (!window.confirm(`Xoá hẳn "${targetEmail}"? Không thể khôi phục.`)) return
    await fetch(`/api/ielts/invites/${encodeURIComponent(targetEmail)}`, { method: 'DELETE' })
    setInvites((v) => v.filter((x) => x.email !== targetEmail))
  }

  if (!isOwner) {
    return (
      <div className="ih-empty-state">
        <p>Trang này chỉ dành cho chủ trang.</p>
      </div>
    )
  }

  return (
    <div className="ih-vocab" style={{ maxWidth: 720 }}>
      <header className="ih-vocab-header">
        <h1 className="ih-font-hand ih-vocab-title">Mời người xem qua email</h1>
      </header>

      <div className="ih-glass ih-vocab-form">
        <div className="ih-vocab-form-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <input
            className="ih-input"
            type="email"
            placeholder="Email người được mời"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && inviteEmail()}
          />
          <button type="button" className="ih-btn-solid" onClick={inviteEmail} disabled={sending}>
            {sending ? 'Đang gửi…' : '+ Mời qua email'}
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ih-ink-soft)', margin: '8px 0 0' }}>
          Họ sẽ nhận 1 email chứa link đăng nhập ngay sau khi bạn bấm mời.
        </p>
      </div>

      <div className="ih-vocab-grid" style={{ marginTop: 16, gridTemplateColumns: '1fr' }}>
        {loading && <p className="ih-vocab-empty">Đang tải…</p>}
        {!loading && invites.length === 0 && <p className="ih-vocab-empty">Chưa mời ai.</p>}
        {invites.map((v) => (
          <div key={v.email} className="ih-glass ih-vocab-card" style={{ flexDirection: 'row', alignItems: 'center', display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="ih-vocab-word">{v.email}</div>
              <div className="ih-vocab-meaning" style={{ fontSize: 12 }}>
                Mời lúc {new Date(v.invitedAt).toLocaleString('vi-VN')}
                {v.revokedAt ? ' · Đã thu hồi' : ''}
              </div>
            </div>
            <button type="button" className="ih-btn-outline" onClick={() => toggleRevoke(v.email, !v.revokedAt)}>
              {v.revokedAt ? 'Cấp lại quyền' : 'Thu hồi'}
            </button>
            <button type="button" className="ih-vocab-card-action" aria-label="Xoá" onClick={() => removeInvite(v.email)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
