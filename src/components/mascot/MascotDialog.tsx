'use client'

import type { CSSProperties, ReactNode } from 'react'
import './mascot-dialog.css'

// Popup có con mèo Diên + bong bóng hội thoại phía trên đầu — dùng chung cho hồ sơ học (Chinese/Korean) và
// đăng nhập IELTS. Chỉ lo phần "khung + mèo + bong bóng"; nội dung form/nút do nơi dùng tự bày trong
// <div className="md-body"> với các class md-input / md-hint / md-btn / md-link (xem mascot-dialog.css).
export const QUESTION_VIDEO = '/preloader/video/question.mp4'
export const HAPPY_VIDEO = '/preloader/video/happy.mp4'

// Popup chặn toàn màn hình. Mặc định KHÔNG đóng được bằng Esc (popup hỏi tên/đăng nhập bắt buộc phải điền); truyền
// `onEscape` cho các popup xác nhận cần cho phép thoát bằng Esc. `style` để app truyền các biến màu --md-* (bỏ
// trống thì ăn theo token --color-* của app Chinese/Korean).
export function MascotDialog({ children, style, onEscape }: { children: ReactNode; style?: CSSProperties; onEscape?: () => void }) {
  return (
    <dialog
      className="md-dialog"
      style={style}
      ref={(el) => {
        if (el && !el.open) el.showModal()
      }}
      onCancel={(e) => {
        e.preventDefault()
        onEscape?.()
      }}
    >
      {children}
    </dialog>
  )
}

// Con mèo trên nền trắng của popup: clip có nền trắng nên hoà vào bằng mix-blend-mode: multiply — cùng kỹ
// thuật với con mèo ở /study, xem mascot-dialog.css.
export function MascotCat({ src }: { src: string }) {
  return <video className="md-cat" src={src} autoPlay muted loop playsInline preload="auto" disablePictureInPicture tabIndex={-1} aria-hidden="true" />
}

// Bong bóng là tiêu đề (h2) của popup. Đổi `key` khi đổi câu để bong bóng bật lên lại. jump = dùng với clip
// mèo nhảy lên cao (happy.mp4) để bong bóng không đè lên khung clip.
export function MascotBubble({ children, jump }: { children: ReactNode; jump?: boolean }) {
  return <h2 className={`md-title md-bubble${jump ? ' md-bubble-jump' : ''}`}>{children}</h2>
}

export function MascotSub({ children }: { children: ReactNode }) {
  return <span className="md-bubble-sub">{children}</span>
}

// Chữ nhấn theo màu lông mèo.
export function MascotEm({ children }: { children: ReactNode }) {
  return <span className="md-em">{children}</span>
}

export function MascotName() {
  return <MascotEm>Diên</MascotEm>
}
