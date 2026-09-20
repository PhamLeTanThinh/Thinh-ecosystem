'use client'

import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { HAPPY_VIDEO, MascotBubble, MascotCat, MascotDialog, MascotSub, QUESTION_VIDEO } from '@/components/mascot/MascotDialog'

// Popup xác nhận/hỏi–xong dùng chung (thay window.confirm mặc định của trình duyệt) cho mọi app — admin, hồ sơ học
// Chinese/Korean... Luồng:
//   1. popup CÂU HỎI (question.mp4) — hỏi xác nhận, kèm ô nhập nếu thao tác cần (đổi tên...);
//   2. bấm xác nhận → nút chuyển "Đang xử lý…" và chạy `run` ngay trong popup, lỗi thì hiện tại chỗ để thử lại/huỷ;
//   3. thành công → popup THÀNH CÔNG (happy.mp4) báo kết quả, bấm OK mới đóng. Nếu `run` trả ok mà không có `bubble`
//      thì bỏ qua popup thành công và đóng luôn — dùng khi ngay sau đó trang tự tải lại/đổi màn hình.

// copy: hiện ô chứa đoạn text + nút "Sao chép" ở popup thành công (vd link đăng nhập để chủ gửi tay khi mail không đi được).
export type ActionCopy = { text: string; label?: string }
export type ActionResult = { ok: true; bubble?: ReactNode; sub?: ReactNode; copy?: ActionCopy } | { ok: false; error: string }

export interface ActionSpec {
  bubble: ReactNode // câu hỏi chính trong bong bóng
  sub?: ReactNode // câu giải thích nhỏ hơn
  confirmLabel: string
  cancelLabel?: string
  danger?: boolean // thao tác không hoàn tác được → nút xác nhận màu đỏ
  input?: { placeholder: string; initial?: string; maxLength?: number; type?: 'text' | 'email'; hint?: string }
  // Chạy khi bấm xác nhận (value = nội dung ô nhập đã trim, '' nếu không có ô nhập). Trả kết quả để popup báo.
  run: (value: string) => Promise<ActionResult>
}

// onClose(true) = thao tác đã chạy xong thành công (và người dùng đã bấm OK nếu có popup thành công); false = huỷ.
// `style`: biến màu --md-* của app (bỏ trống thì ăn theo token --color-* của Chinese/Korean, xem MascotDialog).
export function ActionDialog({ spec, onClose, style }: { spec: ActionSpec; onClose: (ok: boolean) => void; style?: CSSProperties }) {
  const [phase, setPhase] = useState<'ask' | 'busy' | 'done'>('ask')
  const [value, setValue] = useState(spec.input?.initial ?? '')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ bubble: ReactNode; sub?: ReactNode; copy?: ActionCopy } | null>(null)
  const [copied, setCopied] = useState(false)

  async function submit() {
    if (phase !== 'ask') return
    const trimmed = value.trim()
    if (spec.input && !trimmed) return
    setPhase('busy')
    setError(null)
    let result: ActionResult
    try {
      result = await spec.run(trimmed)
    } catch {
      result = { ok: false, error: 'Có lỗi xảy ra rồi, thử lại sau chút nha' }
    }
    if (!result.ok) {
      setError(result.error)
      setPhase('ask')
    } else if (result.bubble === undefined) {
      onClose(true)
    } else {
      setDone({ bubble: result.bubble, sub: result.sub, copy: result.copy })
      setPhase('done')
    }
  }

  // Esc = huỷ (hoặc đóng popup thành công); đang chạy dở thì bỏ qua để không bỏ dở giữa chừng.
  const onEscape = phase === 'busy' ? undefined : () => onClose(phase === 'done')

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Trình duyệt chặn clipboard: ô chứa text đã được chọn sẵn để người dùng tự Ctrl+C.
    }
  }

  if (phase === 'done' && done) {
    return (
      <MascotDialog style={style} onEscape={onEscape}>
        <div className="md-body">
          <MascotBubble jump>
            {done.bubble}
            {done.sub && <MascotSub>{done.sub}</MascotSub>}
          </MascotBubble>
          <MascotCat videoKey={HAPPY_VIDEO} />
          {done.copy ? (
            <>
              <input className="md-input" readOnly value={done.copy.text} aria-label="Link đăng nhập" onFocus={(e) => e.currentTarget.select()} />
              <button type="button" className="md-btn" autoFocus onClick={() => copyText(done.copy!.text)}>
                {copied ? '✓ Đã sao chép' : (done.copy.label ?? 'Sao chép')}
              </button>
              <button type="button" className="md-link" onClick={() => onClose(true)}>
                Xong rồi
              </button>
            </>
          ) : (
            <button type="button" className="md-btn" autoFocus onClick={() => onClose(true)}>
              Ok nè!
            </button>
          )}
        </div>
      </MascotDialog>
    )
  }

  const busy = phase === 'busy'
  return (
    <MascotDialog style={style} onEscape={onEscape}>
      <form
        className="md-body"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <MascotBubble>
          {spec.bubble}
          {spec.sub && <MascotSub>{spec.sub}</MascotSub>}
        </MascotBubble>
        <MascotCat videoKey={QUESTION_VIDEO} />
        {spec.input && (
          <input
            className="md-input"
            type={spec.input.type ?? 'text'}
            value={value}
            autoFocus
            maxLength={spec.input.maxLength}
            placeholder={spec.input.placeholder}
            disabled={busy}
            onChange={(e) => {
              setValue(e.target.value)
              setError(null)
            }}
          />
        )}
        {error ? <p className="md-hint md-hint-error">{error}</p> : spec.input?.hint ? <p className="md-hint">{spec.input.hint}</p> : null}
        <button type="submit" className={`md-btn${spec.danger ? ' md-btn-danger' : ''}`} disabled={busy || (!!spec.input && !value.trim())} autoFocus={!spec.input}>
          {busy ? 'Đang xử lý…' : spec.confirmLabel}
        </button>
        <button type="button" className="md-link" disabled={busy} onClick={() => onClose(false)}>
          {spec.cancelLabel ?? 'Thôi, để em nghĩ lại'}
        </button>
      </form>
    </MascotDialog>
  )
}
