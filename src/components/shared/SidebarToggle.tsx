'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

// Ẩn/hiện menu trái trên desktop — dùng chung cho mọi app có sidebar (Korean, Chinese, IELTS, Lessons, Habits,
// Money). Mỗi sidebar gắn data-app-sidebar lên <aside> và render <SidebarToggle /> bên trong; trạng thái là 1 thuộc
// tính trên <html> (CSS ở globals.css ẩn mọi [data-app-sidebar]) và lưu localStorage nên áp dụng cho MỌI trang,
// giữ qua F5 (script trong app/layout.tsx đặt lại thuộc tính trước khi vẽ để không bị nháy). Mobile vẫn dùng
// drawer ☰ riêng của từng app — nút này chỉ hiện từ 1024px.
const ATTR = 'data-sidebar-hidden'
export const SIDEBAR_HIDDEN_KEY = 'app-sidebar-hidden'
const EVENT = 'app-sidebar-toggle'

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  return () => window.removeEventListener(EVENT, cb)
}
const isHidden = () => document.documentElement.hasAttribute(ATTR)
const noopSubscribe = () => () => {}

const ANIM_ATTR = 'data-sidebar-anim'
const ANIM_MS = 320
let animTimer: ReturnType<typeof setTimeout> | undefined

// Bình thường sidebar ẩn bằng display:none (lúc tải trang không có gì để chạy hiệu ứng). Khi bấm, bật data-sidebar-anim
// trong ~320ms: sidebar vẫn được vẽ và trượt bằng margin-left âm (= bề rộng đo được) + mờ dần — vùng nội dung flex:1
// giãn/co theo từng khung hình. Hết hiệu ứng thì gỡ thuộc tính, trạng thái ẩn quay lại display:none.
function setHidden(hidden: boolean) {
  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) {
    clearTimeout(animTimer)
    root.setAttribute(ANIM_ATTR, '')
    const aside = document.querySelector<HTMLElement>('[data-app-sidebar]')
    if (aside?.offsetWidth) root.style.setProperty('--app-sidebar-w', `${aside.offsetWidth}px`) // ép reflow: trạng thái đầu được vẽ trước khi đổi
    animTimer = setTimeout(() => root.removeAttribute(ANIM_ATTR), ANIM_MS + 40)
  }
  root.toggleAttribute(ATTR, hidden)
  try {
    localStorage.setItem(SIDEBAR_HIDDEN_KEY, hidden ? '1' : '0')
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

export function SidebarToggle() {
  const hidden = useSyncExternalStore(subscribe, isHidden, () => false)
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false)

  // Nút nằm trên đường viền phải của sidebar → đo bề rộng sidebar (mỗi app 1 kiểu: 256–300px) ra biến CSS
  useEffect(() => {
    const aside = document.querySelector<HTMLElement>('[data-app-sidebar]')
    if (!aside) return
    const root = document.documentElement
    const sync = () => {
      if (aside.offsetWidth) root.style.setProperty('--app-sidebar-w', `${aside.offsetWidth}px`)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(aside)
    return () => ro.disconnect()
  }, [])

  // Ctrl/⌘ + B như VS Code — bỏ qua khi đang gõ trong ô nhập/soạn thảo (Ctrl+B = in đậm ở đó)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'b' || e.shiftKey || e.altKey) return
      const el = e.target as HTMLElement | null
      if (el?.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return
      e.preventDefault()
      setHidden(!isHidden())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!isClient) return null
  const label = hidden ? 'Hiện menu bên trái (Ctrl+B)' : 'Ẩn menu bên trái (Ctrl+B)'
  return createPortal(
    <button type="button" className="app-sidebar-toggle" aria-label={label} title={label} onClick={() => setHidden(!hidden)}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M15 6l-6 6 6 6" />
      </svg>
    </button>,
    document.body,
  )
}
