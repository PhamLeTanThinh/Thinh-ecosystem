'use client'

import { useRef, useState } from 'react'
import './donate-widget.css'

type Tab = 'qr' | 'feedback'

// Mèo "mua pate cho Diên" ở góc phải dưới /study — MỘT khối duy nhất (.dw-frame), không phải 2 khối
// tách rời: lúc nghỉ nó là viên thuốc nhỏ "Mua pate cho Diên", hover/bấm vào thì CHÍNH nó phóng to
// (animation width/height/border-radius) thành thẻ chứa mã QR — không bật thêm thẻ nào khác. Nội
// dung viên-thuốc và nội dung thẻ nằm chồng lên nhau (position:absolute, xem CSS) rồi chuyển tiếp
// bằng crossfade, còn con mèo (before-crop.png lúc nghỉ, after-crop.png lúc mở) cũng crossfade tương
// tự, đứng giữa và ló ra ngay trên viền trên của khối, ngoài phần overflow:hidden của khối để không bị
// cắt. before-crop.png/after-crop.png là before.png/after.png gốc (ảnh vuông 900×900, phần mèo chỉ
// chiếm khoảng giữa, phía trên/dưới trống rất nhiều) đã cắt sát viền mèo bằng ffmpeg — để nguyên ảnh
// gốc thì lúc thu nhỏ, 2 chân mèo bị nén thành 1 dải mỏng gần như không thấy.
//
// public/donate/qr-code.jpg là donate.jpg (ảnh VietQR gốc, còn cả tên/logo ngân hàng) đã cắt sẵn
// (ffmpeg) chỉ lấy đúng ô vuông mã QR.
//
// Chỉ hover đúng vào khối (.dw-frame) mới mở — không phải hover vùng rộng quanh nó. Hover mở ra trên
// máy có chuột; máy cảm ứng bấm để mở, bấm ✕ để đóng (không dùng bấm-để-đảo trên khối: cảm ứng thật
// bắn thêm 1 mouseenter "bù" ngay trước sự kiện click, nên nếu onClick đảo ngược trạng thái thì
// mouseenter mở ra rồi click lại đóng lại ngay, chưa kịp thấy mã QR).
//
// Đóng có trì hoãn 1 nhịp ngắn (setTimeout) thay vì đóng ngay khi rời chuột: .dw-frame phóng to neo ở
// góc dưới-phải nên mép TRÊN của nó di chuyển lên khi mở — nếu chuột đang đứng đúng mép đó, nút vừa to
// ra đã "chạy" khỏi con trỏ, tính là rời chuột, thu lại, rồi chuột lại nằm trong mép cũ, mở lại... giật
// liên tục. Trì hoãn đóng cho khối kịp "chạy" hẳn ra khỏi/vào con trỏ trước khi state đổi thật.
export function DonateWidget() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('qr')
  const closeTimer = useRef<number | undefined>(undefined)

  function openNow() {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }

  function closeSoon() {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="dw-root">
      <div className="dw-cats" aria-hidden="true">
        <img className={`dw-cat dw-cat-before${open ? ' dw-hide' : ''}`} src="/donate/before-crop.png" width={900} height={574} alt="" />
        <img className={`dw-cat dw-cat-after${open ? '' : ' dw-hide'}`} src="/donate/after-crop.png" width={813} height={498} alt="" />
      </div>

      <div
        className={`dw-frame${open ? ' dw-open' : ''}`}
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
        onClick={openNow}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label="Mua pate cho Diên"
      >
        <div className="dw-mini">
          <span className="dw-pill-icon" aria-hidden="true">
            🥫
          </span>
          <span className="dw-pill-text">Mua pate cho Diên</span>
          <span className="dw-pill-chevron" aria-hidden="true">
            ›
          </span>
        </div>

        <div className="dw-full" role="dialog" aria-label="Ủng hộ & góp ý">
          <button
            type="button"
            className="dw-close"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            aria-label="Đóng"
          >
            ×
          </button>

          {/* stopPropagation trên cả 2 nút tab — .dw-frame có onClick={openNow}, gọi lại openNow() vô hại
              (đã mở sẵn) nhưng để tránh phụ thuộc vào việc đó luôn vô hại, chặn nổi bọt cho chắc. */}
          <div className="dw-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'feedback'}
              className={`dw-tab${tab === 'feedback' ? ' active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setTab('feedback')
              }}
            >
              💬 Góp ý
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'qr'}
              className={`dw-tab${tab === 'qr' ? ' active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setTab('qr')
              }}
            >
              🥫 Ủng hộ
            </button>
          </div>

          {tab === 'qr' ? (
            <div className="dw-tab-panel">
              <p className="dw-thanks">Cảm ơn hội đồng quản trị ♡</p>
              <img className="dw-qr" src="/donate/qr-code.jpg" width={680} height={680} alt="Mã QR ủng hộ tác giả" />
            </div>
          ) : (
            <FeedbackForm />
          )}
        </div>
      </div>
    </div>
  )
}

type SendState = 'idle' | 'sending' | 'sent' | 'error'

// Form gửi góp ý — POST /api/feedback (không cần đăng nhập, xem route.ts). `page` gửi kèm pathname
// hiện tại để biết góp ý đang nói về app nào khi đọc lại qua db:studio.
function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [state, setState] = useState<SendState>('idle')

  async function submit() {
    const trimmed = message.trim()
    if (!trimmed || state === 'sending') return
    setState('sending')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, page: window.location.pathname }),
      })
      if (!res.ok) throw new Error('failed')
      setState('sent')
      setMessage('')
      // Tự quay về form trắng sau vài giây — không bắt người dùng tự bấm gì để "reset" lại.
      window.setTimeout(() => setState('idle'), 2500)
    } catch {
      setState('error')
    }
  }

  return (
    <div className="dw-tab-panel dw-feedback">
      {state === 'sent' ? (
        <p className="dw-feedback-sent">Đã nhận được góp ý, cảm ơn bạn! 🙏</p>
      ) : (
        <>
          <textarea
            className="dw-feedback-textarea"
            placeholder="Góp ý, đề xuất tính năng, báo lỗi..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            maxLength={2000}
            disabled={state === 'sending'}
          />
          <button
            type="button"
            className="dw-feedback-submit"
            onClick={(e) => {
              e.stopPropagation()
              submit()
            }}
            disabled={!message.trim() || state === 'sending'}
          >
            {state === 'sending' ? 'Đang gửi…' : 'Gửi góp ý'}
          </button>
          {state === 'error' && <p className="dw-feedback-error">Gửi lỗi rồi, thử lại giúp mình nhé.</p>}
        </>
      )}
    </div>
  )
}
