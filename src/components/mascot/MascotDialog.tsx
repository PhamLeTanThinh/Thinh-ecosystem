'use client'

import type { CSSProperties, ReactNode } from 'react'
import { ShieldedVideo } from '@/components/media/ShieldedVideo'
import './mascot-dialog.css'

// Popup có con mèo Diên + bong bóng hội thoại phía trên đầu — dùng chung cho hồ sơ học (Chinese/Korean) và
// đăng nhập IELTS. Chỉ lo phần "khung + mèo + bong bóng"; nội dung form/nút do nơi dùng tự bày trong
// <div className="md-body"> với các class md-input / md-hint / md-btn / md-link (xem mascot-dialog.css).
export const QUESTION_VIDEO = 'question'
export const HAPPY_VIDEO = 'happy'

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
export function MascotCat({ videoKey }: { videoKey: string }) {
  return <ShieldedVideo className="md-cat" mediaKey={videoKey} />
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
