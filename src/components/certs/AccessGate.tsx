'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { MAGIC_LINK_SUBJECT } from '@/lib/ielts/mailSubjects'
import { HAPPY_VIDEO, MascotBubble, MascotCat, MascotDialog, MascotEm, MascotName, MascotSub, QUESTION_VIDEO } from '@/components/mascot/MascotDialog'

// Popup đăng nhập Certs Hub — song song với components/ielts/AccessGate.tsx (đọc file đó để biết đầy đủ
// từng nhánh), chỉ đổi API endpoint, tiêu đề thư và bảng màu. Cùng cơ chế: hỏi email → gửi magic link →
// bấm vào thư là có session 30 ngày dùng chung với IELTS/Admin (xem lib/ielts/session.ts).
//
// Map token màu Certs (--color-*, khai báo trong certs.css) sang biến --md-* của MascotDialog.
const CERTS_TOKENS = {
  '--md-card': 'var(--color-card)',
  '--md-soft': 'var(--color-card-soft)',
  '--md-brand': 'var(--color-accent)',
  '--md-brand-strong': 'var(--color-plum)',
  '--md-text': 'var(--color-text)',
  '--md-muted': 'var(--color-muted)',
  '--md-border': 'var(--color-border)',
  '--md-radius': 'var(--radius-card)',
} as CSSProperties

const LOGIN_MAIL_SUBJECT = MAGIC_LINK_SUBJECT.certs

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function CertsAccessGate() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [view, setView] = useState<'ask' | 'requested'>('ask')
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    const trimmed = email.trim()
    if (!trimmed || status === 'sending') return
    if (!EMAIL_RE.test(trimmed)) {
      setError('Email này trông chưa đúng lắm, anh chị kiểm tra lại giúp em nha')
      return
    }
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/certs/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
    } catch {
      setError('Có lỗi xảy ra rồi, anh chị thử lại sau chút nha')
      setStatus('idle')
    }
  }

  return (
    <MascotDialog style={CERTS_TOKENS}>
      {status === 'sent' ? (
        <div className="md-body">
          <MascotBubble jump>
            Em gửi rồi nè! 💌
            <MascotSub>
              Anh chị đợi ông chủ của em duyệt quyền truy cập một chút nha, duyệt xong là link đăng nhập bay vào hộp thư của anh chị liền! Nếu cần
              gấp thì anh chị liên hệ ông chủ của em giúp em nhé, và nhớ ngó cả mục thư rác nữa nha 🐾
            </MascotSub>
          </MascotBubble>
          <MascotCat videoKey={HAPPY_VIDEO} />
          <button
            type="button"
            className="md-link"
            onClick={() => {
              setStatus('idle')
              setError(null)
            }}
          >
            ← Nhập email khác
          </button>
        </div>
      ) : view === 'requested' ? (
        <div className="md-body">
          <MascotBubble jump>
            Vậy anh chị kiểm tra email giúp em nha! 📬
            <MascotSub>
              Mở thư có tiêu đề <MascotEm>&ldquo;{LOGIN_MAIL_SUBJECT}&rdquo;</MascotEm> rồi bấm vào link (có hiệu lực 30 phút) là vào được liền. Sau đó
              em nhớ anh chị 30 ngày, mỗi lần ghé lại em gia hạn thêm, nên lần sau anh chị cứ vào thẳng trang nha! Hết hạn hoặc đổi máy thì xin link
              mới nhé 🐾
            </MascotSub>
          </MascotBubble>
          <MascotCat videoKey={HAPPY_VIDEO} />
          <button type="button" className="md-btn" onClick={() => setView('ask')}>
            Xin link mới
          </button>
          <Link href="/study" className="md-link">
            ← Về trang Study
          </Link>
        </div>
      ) : (
        <form
          className="md-body"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <MascotBubble>
            Xin chào, em là <MascotName />!<br />
            Anh chị cho em xin email nhé?
            <MascotSub>Em sẽ gửi link đăng nhập Certs Hub vào hộp thư của anh chị, không cần mật khẩu đâu! 🐾</MascotSub>
          </MascotBubble>
          <MascotCat videoKey={QUESTION_VIDEO} />
          <input
            className="md-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            autoFocus
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
          />
          {error ? <p className="md-hint md-hint-error">{error}</p> : <p className="md-hint">Anh chị dùng email thật để em gửi link cho đúng chỗ nha.</p>}
          <button type="submit" className="md-btn" disabled={status === 'sending' || !email.trim()}>
            {status === 'sending' ? 'Đang gửi…' : 'Gửi link nè'}
          </button>
          <button
            type="button"
            className="md-link"
            onClick={() => {
              setView('requested')
              setError(null)
            }}
          >
            Anh chị đã xin link rồi?
          </button>
          <Link href="/study" className="md-link">
            ← Về trang Study
          </Link>
        </form>
      )}
    </MascotDialog>
  )
}
