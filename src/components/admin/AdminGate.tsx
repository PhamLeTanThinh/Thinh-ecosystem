'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IELTS_TOKENS } from '@/components/ielts/AccessGate'
import { HAPPY_VIDEO, MascotBubble, MascotCat, MascotDialog, MascotEm, MascotSub, QUESTION_VIDEO } from '@/components/mascot/MascotDialog'
import { MAGIC_LINK_SUBJECT } from '@/lib/ielts/mailSubjects'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Cổng đăng nhập trang /admin — chỉ dành cho chủ trang. Khác AccessGate của IELTS: email lạ ở đây KHÔNG tạo
// "yêu cầu xin quyền" cho ai, server (POST /api/admin/request-link) chỉ gửi link khi đúng email chủ và luôn trả
// cùng 1 kết quả — nên màn "đã gửi" cũng không được khẳng định email này có đúng là của chủ hay không.
export function AdminGate() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    const trimmed = email.trim()
    if (!trimmed || status === 'sending') return
    if (!EMAIL_RE.test(trimmed)) {
      setError('Email này trông chưa đúng lắm, ông chủ kiểm tra lại giúp em nha')
      return
    }
    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/admin/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
    } catch {
      setError('Có lỗi xảy ra rồi, ông chủ thử lại sau chút nha')
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
              Ông chủ mở thư có tiêu đề <MascotEm>&ldquo;{MAGIC_LINK_SUBJECT.admin}&rdquo;</MascotEm> rồi bấm vào link (có hiệu lực 30 phút) là vào được liền. Chưa thấy
              thư thì ông chủ kiểm tra lại email đã nhập và cả mục thư rác giúp em nhé 🐾
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
            Xin chào ông chủ!
            <br />
            Cho em xin email của ông chủ nhé?
            <MascotSub>Trang Admin chỉ dành riêng cho ông chủ thôi nha. Em sẽ gửi link đăng nhập vào hộp thư, không cần mật khẩu đâu! 🐾</MascotSub>
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
          {error ? <p className="md-hint md-hint-error">{error}</p> : <p className="md-hint">Ông chủ dùng đúng email chủ trang để em gửi link nha.</p>}
          <button type="submit" className="md-btn" disabled={status === 'sending' || !email.trim()}>
            {status === 'sending' ? 'Đang gửi…' : 'Gửi link nè'}
          </button>
          <Link href="/study" className="md-link">
            ← Về trang Study
          </Link>
        </form>
      )}
    </MascotDialog>
  )
}
