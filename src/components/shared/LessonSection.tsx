'use client'

import { useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react'
import './lesson-section.css'

// Mục lớn của 1 bài học Korean/Chinese (Từ vựng / Ngữ pháp / Hội thoại / Luyện nói) — bấm tiêu đề để thu gọn/mở.
// Trạng thái thu gọn nhớ theo LOẠI mục (không theo bài) trong localStorage nên áp dụng cho mọi bài, giữ qua F5.
// Chỉ có tác dụng trên desktop: ≤860px các mục đã thành tab (…-mobile-section) nên luôn hiện nội dung (CSS).
export type LessonSectionKey = 'vocab' | 'grammar' | 'dialogue' | 'speaking'

const STORAGE_KEY = 'lesson-sections-collapsed'
const EVENT = 'lesson-sections-change'

function read(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[])
  } catch {
    return new Set()
  }
}

function write(next: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  } catch {}
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

// Mở 1 mục đang thu gọn — mục lục "Đang đọc" gọi trước khi cuộn tới 1 thẻ nằm trong mục đó.
export function openLessonSection(key: LessonSectionKey) {
  const s = read()
  if (s.delete(key)) write(s)
}

export function LessonSection({
  sectionKey,
  prefix,
  title,
  count,
  children,
}: {
  sectionKey: LessonSectionKey
  prefix: 'kr' | 'cn' // tiền tố class tiêu đề mục của từng app (…-section-title / …-section-count) và id (…-section-<key>)
  title: ReactNode
  count: number
  children: ReactNode
}) {
  // Snapshot là chuỗi (so sánh được bằng ===) thay vì Set mới mỗi lần đọc
  const collapsedKeys = useSyncExternalStore(subscribe, () => [...read()].sort().join(','), () => '')
  const collapsed = collapsedKeys.split(',').includes(sectionKey)

  function toggle() {
    if (window.matchMedia('(max-width: 860px)').matches) return // mobile: mục là tab, không thu gọn
    const s = read()
    if (!s.delete(sectionKey)) s.add(sectionKey)
    write(s)
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    toggle()
  }

  return (
    <section className={`lsec${collapsed ? ' lsec-collapsed' : ''}`}>
      <p
        className={`${prefix}-section-title lsec-head`}
        id={`${prefix}-section-${sectionKey}`}
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        title={collapsed ? 'Bấm để mở' : 'Bấm để thu gọn'}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        {title} <span className={`${prefix}-section-count`}>({count})</span>
        <svg className="lsec-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </p>
      <div className="lsec-body">{children}</div>
    </section>
  )
}
