'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { ActionDialog } from '@/components/mascot/ActionDialog'
import { HAPPY_VIDEO, MascotBubble, MascotCat, MascotDialog, MascotEm, MascotName, MascotSub, QUESTION_VIDEO } from '@/components/mascot/MascotDialog'
import './learner-profile.css'

type Me = { id: string | null; registered: boolean }
// claim = hồ sơ CŨ đã có cookie + dữ liệu nhưng chưa có tên (mã tự sinh từ bản trước, hoặc 'legacy').
type GateMode = 'create' | 'login' | 'claim' | 'done'

// "Hồ sơ học" — dùng chung cho cả app Chinese lẫn Korean (cùng 1 cookie learner_id, xem
// lib/learner/identity.ts + proxy.ts). Không mật khẩu: lần đầu vào app hiện popup hỏi TÊN, tên chưa ai
// dùng thì tạo hồ sơ mới; đã có hồ sơ (máy khác / cookie hết hạn) thì gõ đúng tên để vào lại. Hồ sơ giữ
// 30 ngày và tự gia hạn mỗi lần quay lại học.
//
// Gồm 2 phần: <LearnerGate /> đặt ở layout (popup chặn màn hình, chạy được ở MỌI trang con của app) và
// <LearnerProfile /> đặt ở topbar (nút hiện tên + menu). Cả hai dùng chung 1 lần gọi whoami.
let mePromise: Promise<Me> | null = null

function loadMe(): Promise<Me> {
  if (!mePromise) {
    mePromise = fetch('/api/learner/whoami')
      .then((r) => r.json() as Promise<Me>)
      .catch((err) => {
        mePromise = null
        throw err
      })
  }
  return mePromise
}

function useMe(): Me | undefined {
  const [me, setMe] = useState<Me | undefined>(undefined)
  useEffect(() => {
    loadMe()
      .then(setMe)
      .catch(() => {})
  }, [])
  return me
}

export function LearnerGate() {
  const me = useMe()
  if (!me) return null
  if (!me.id) return <ProfileGate initialMode="create" />
  if (!me.registered) return <ProfileGate initialMode="claim" />
  return null
}

export function LearnerProfile() {
  const me = useMe()
  if (!me?.id || !me.registered) return null
  return <ProfileMenu id={me.id} />
}

async function postJson(url: string, body?: unknown): Promise<{ ok: boolean; data: { error?: string; id?: string } }> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, data }
  } catch {
    return { ok: false, data: { error: 'Không kết nối được máy chủ, thử lại sau.' } }
  }
}

// Popup chặn toàn màn hình cho tới khi có hồ sơ có tên. Dùng <dialog>.showModal() (top layer) thay vì
// position:fixed vì topbar của 2 app có backdrop-filter — nó biến topbar thành containing block của
// mọi phần tử fixed bên trong, khiến popup bị nhốt trong thanh topbar thay vì phủ cả màn hình.
function ProfileGate({ initialMode }: { initialMode: GateMode }) {
  const [mode, setMode] = useState<GateMode>(initialMode)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdId, setCreatedId] = useState('')
  const [keptProgress, setKeptProgress] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)

  async function submit() {
    const username = name.trim()
    if (!username || busy) return
    setBusy(true)
    setError(null)
    const url = mode === 'create' ? '/api/learner/create' : mode === 'claim' ? '/api/learner/rename' : '/api/learner/login'
    const { ok, data } = await postJson(url, { username })
    setBusy(false)
    if (!ok) {
      setError(data.error ?? 'Có lỗi xảy ra, thử lại sau.')
      return
    }
    if (mode === 'login') {
      window.location.reload()
      return
    }
    setKeptProgress(mode === 'claim')
    setCreatedId(data.id ?? username)
    setMode('done')
  }

  function switchMode(next: GateMode) {
    setMode(next)
    setError(null)
  }

  // Bỏ hồ sơ cũ chưa có tên để tạo/vào hồ sơ khác — dữ liệu cũ không mất trong DB nhưng sẽ không còn
  // hiện ở trình duyệt này nữa (mã cũ không có cách nào gõ lại), nên hỏi lại cho chắc bằng popup mèo
  // (không dùng window.confirm). Xác nhận xong chuyển thẳng sang màn tạo hồ sơ, không cần popup thành công.
  function leaveOldProfile() {
    setConfirmLeave(true)
  }

  return (
    <>
      <MascotDialog>
        {mode === 'done' ? (
          <div className="md-body">
            <MascotBubble jump>
              {keptProgress ? (
                <>
                  Xong rồi nè! Em nhớ anh chị là <MascotEm>{createdId}</MascotEm> rồi đó 🎉
                  <MascotSub>Tiến độ học cũ em giữ nguyên hết nha!</MascotSub>
                </>
              ) : (
                <>
                  Yay! Hồ sơ của <MascotEm>{createdId}</MascotEm> xong rồi nè 🎉
                </>
              )}
              <MascotSub>
                Em giữ hồ sơ này cho anh chị 30 ngày nha! Mỗi lần anh chị ghé học, em lại gia hạn thêm 30 ngày. Hồ sơ dùng chung cho cả tiếng
                Trung và tiếng Hàn luôn đó 🐾
              </MascotSub>
            </MascotBubble>
            <MascotCat videoKey={HAPPY_VIDEO} />
            <button type="button" className="md-btn" onClick={() => window.location.reload()}>
              Bắt đầu học thôi!
            </button>
          </div>
        ) : (
          <form
            className="md-body"
            onSubmit={(e) => {
              e.preventDefault()
              submit()
            }}
          >
            <Fragment key={mode}>
              <MascotBubble>
                {mode === 'create' ? (
                  <>
                    Xin chào, em là <MascotName />!<br />
                    Anh chị tên gì nhỉ?
                    <MascotSub>Cho em xin 1 cái tên dễ nhớ để em lưu tiến độ học của anh chị nha, không cần mật khẩu đâu! 🐾</MascotSub>
                  </>
                ) : mode === 'claim' ? (
                  <>
                    <MascotName /> thấy anh chị đã học rồi nè!
                    <MascotSub>
                      Đặt cho em 1 cái tên dễ nhớ để em giữ nguyên tiến độ, anh chị còn dùng được cả trên máy khác nữa nha 🐾
                    </MascotSub>
                  </>
                ) : (
                  <>
                    Mừng anh chị quay lại!<br />
                    Anh chị là ai nhỉ?
                    <MascotSub>Nhập đúng tên hồ sơ hôm trước để em tìm lại tiến độ học cho anh chị nha 🐾</MascotSub>
                  </>
                )}
              </MascotBubble>
            </Fragment>
            <MascotCat videoKey={QUESTION_VIDEO} />
            <input
              className="md-input"
              value={name}
              autoFocus
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              placeholder="vd: thinh, mai_2004…"
              maxLength={24}
            />
            {error ? (
              <p className="md-hint md-hint-error">{error}</p>
            ) : (
              <p className="md-hint">Từ 3 ký tự, bắt đầu bằng chữ cái; gồm chữ, số, gạch ngang hoặc gạch dưới.</p>
            )}
            <button type="submit" className="md-btn" disabled={busy || !name.trim()}>
              {busy ? 'Đang xử lý…' : mode === 'create' ? 'Tạo hồ sơ' : mode === 'claim' ? 'Đặt tên' : 'Vào hồ sơ'}
            </button>
            {mode === 'claim' ? (
              <button type="button" className="md-link" onClick={leaveOldProfile}>
                Dùng hồ sơ khác
              </button>
            ) : (
              <button type="button" className="md-link" onClick={() => switchMode(mode === 'create' ? 'login' : 'create')}>
                {mode === 'create' ? 'Đã có hồ sơ? Dùng tên cũ' : '← Tạo hồ sơ mới'}
              </button>
            )}
          </form>
        )}
      </MascotDialog>
      {confirmLeave && (
        <ActionDialog
          spec={{
            bubble: 'Dùng hồ sơ khác hả anh chị?',
            sub: 'Hồ sơ hiện tại chưa có tên nên tiến độ đang có sẽ không hiện ở đây nữa nếu anh chị dùng hồ sơ khác đó nha. Anh chị chắc chưa?',
            confirmLabel: 'Chắc rồi, dùng hồ sơ khác',
            cancelLabel: 'Thôi, em giữ hồ sơ này',
            danger: true,
            run: async () => ({ ok: true }),
          }}
          onClose={(ok) => {
            setConfirmLeave(false)
            if (ok) switchMode('create')
          }}
        />
      )}
    </>
  )
}

function ProfileMenu({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const [confirmSwitch, setConfirmSwitch] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Bấm ra ngoài thì đóng bảng — tránh phải thêm nút đóng riêng.
  useEffect(() => {
    if (!open) return
    function onClickAway(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickAway)
    return () => document.removeEventListener('mousedown', onClickAway)
  }, [open])

  return (
    <div className="lp-root" ref={rootRef}>
      <button type="button" className="lp-trigger" onClick={() => setOpen((v) => !v)} title="Hồ sơ học của bạn">
        👤 {id}
      </button>

      {open && (
        <div className="lp-panel">
          <p className="lp-label">Hồ sơ của bạn</p>
          <code className="lp-code lp-code-block">{id}</code>
          <p className="lp-hint">
            Hồ sơ được giữ 30 ngày và tự gia hạn thêm 30 ngày mỗi lần bạn quay lại học. Dùng trên máy khác: mở app, chọn &quot;Đã có hồ
            sơ&quot; rồi nhập đúng tên này.
          </p>

          <button type="button" className="lp-switch" onClick={() => setConfirmSwitch(true)}>
            Đổi sang hồ sơ khác
          </button>
        </div>
      )}

      {/* Popup mèo hỏi xác nhận (không dùng window.confirm); xoá cookie xong trang tải lại và hiện popup chọn hồ sơ. */}
      {confirmSwitch && (
        <ActionDialog
          spec={{
            bubble: 'Anh chị muốn đổi sang hồ sơ khác hả?',
            sub: (
              <>
                Dữ liệu của hồ sơ <MascotEm>{id}</MascotEm> em vẫn giữ nguyên nha, lần sau gõ lại đúng tên là vào lại được liền 🐾
              </>
            ),
            confirmLabel: 'Đổi nè',
            cancelLabel: 'Thôi, ở lại hồ sơ này',
            run: async () => {
              const { ok } = await postJson('/api/learner/logout')
              return ok ? { ok: true } : { ok: false, error: 'Chưa đổi được rồi, anh chị thử lại sau chút nha' }
            },
          }}
          onClose={(ok) => {
            setConfirmSwitch(false)
            if (ok) window.location.reload()
          }}
        />
      )}
    </div>
  )
}
