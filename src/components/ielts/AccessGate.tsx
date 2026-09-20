'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { MAGIC_LINK_SUBJECT } from '@/lib/ielts/mailSubjects'
import { HAPPY_VIDEO, MascotBubble, MascotCat, MascotDialog, MascotEm, MascotName, MascotSub, QUESTION_VIDEO } from '@/components/mascot/MascotDialog'

// Popup đăng nhập IELTS Hub: hỏi email để gửi link đăng nhập (magic link). Dùng cho cả trang /ielts/login lẫn
// màn "cần đăng nhập" của /ielts. Phía server (POST /api/ielts/request-link) luôn trả 1 thông báo chung dù email
// đã được mời hay chưa để không lộ ai có quyền — nên màn "đã gửi" không được nói chắc "đang chờ duyệt" hay "đã gửi
// link" cho riêng ai; câu chữ ở đó chủ ý để người đọc hiểu là: link sẽ tới ngay khi có quyền (được mời hoặc chủ duyệt).
//
// Map token của IELTS (--color-ih-*, khai báo trong ielts.css) sang biến --md-* của MascotDialog.
export const IELTS_TOKENS = {
  '--md-card': 'var(--color-ih-surface)',
  '--md-soft': 'var(--color-ih-bg)',
  '--md-brand': 'var(--color-ih-rose)',
  '--md-brand-strong': '#a94d61',
  '--md-text': 'var(--color-ih-ink)',
  '--md-muted': 'var(--color-ih-ink-soft)',
  '--md-border': 'var(--color-ih-border)',
  '--md-radius': '24px',
} as CSSProperties

// Tiêu đề email chứa link đăng nhập lấy từ lib/ielts/mailSubjects.ts (cùng hằng số mailer.ts dùng để gửi thư) nên luôn
// khớp. Link trong thư chỉ có hiệu lực 30 phút để bấm (và bấm được 1 lần) — xem api/ielts/verify +
// lib/ielts/invite.ts; bấm xong là có session 30 ngày, trượt theo mỗi lần vào lại (lib/ielts/session.ts, proxy.ts), nên
// các lần sau vào thẳng /ielts, không cần link nữa. Hết hạn session hoặc đổi máy thì mới cần xin link mới.
const LOGIN_MAIL_SUBJECT = MAGIC_LINK_SUBJECT.ielts

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AccessGate() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  // requested = người đã từng xin link rồi: ẩn ô nhập email, chỉ chỉ cách mở link trong thư đã nhận.
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
      const res = await fetch('/api/ielts/request-link', {
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
    <MascotDialog style={IELTS_TOKENS}>
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
            <MascotSub>Em sẽ gửi link đăng nhập vào hộp thư của anh chị, không cần mật khẩu đâu! 🐾</MascotSub>
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
