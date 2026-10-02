'use client'

import { useEffect, useMemo, useState } from 'react'
import { openLessonSection, type LessonSectionKey } from './LessonSection'

// Mục lục "Đang đọc" bên phải của 1 bài Korean/Chinese — dạng cây: mỗi mục lớn (Từ vựng / Ngữ pháp / Hội thoại /
// Luyện nói) có các mục con lấy từ dữ liệu thật của bài (nhóm chủ đề từ vựng, từng điểm ngữ pháp, từng hội thoại,
// từng câu luyện nói). Chỉ mục lớn đang đọc mới xổ các mục con ra (để menu không dài loằng ngoằng); mục con đang đọc
// được tô sáng, mục lớn chứa nó cũng sáng theo. Bấm 1 mục nằm trong mục lớn đang thu gọn → mở mục lớn rồi mới cuộn.
export interface TocChild {
  id: string
  label: string
}

export interface TocNode {
  id: string
  label: string
  section: LessonSectionKey
  children: TocChild[]
}

export function LessonToc({ nodes, prefix }: { nodes: TocNode[]; prefix: 'kr' | 'cn' }) {
  const allIds = useMemo(() => nodes.flatMap((n) => [n.id, ...n.children.map((c) => c.id)]), [nodes])
  const activeId = useScrollspy(allIds)
  const activeNode = nodes.find((n) => n.id === activeId || n.children.some((c) => c.id === activeId))

  function go(id: string, section: LessonSectionKey) {
    openLessonSection(section)
    // đợi 1 khung hình để mục vừa mở hiện ra rồi mới cuộn
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  if (nodes.length === 0) return null
  return (
    <aside className={`${prefix}-side-toc`} aria-label="Mục lục">
      <span className={`${prefix}-side-toc-label`}>Đang đọc</span>
      {nodes.map((n) => {
        const open = n === activeNode
        return (
          <div key={n.id} className="ltoc-node">
            <button
              type="button"
              title={n.label}
              className={`${prefix}-side-toc-item${open ? ' active' : ''}`}
              aria-expanded={n.children.length > 0 ? open : undefined}
              onClick={() => go(n.id, n.section)}
            >
              {n.label}
            </button>
            {open && n.children.length > 0 && (
              <div className="ltoc-children">
                {n.children.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    title={c.label}
                    className={`ltoc-child${c.id === activeId ? ' active' : ''}`}
                    onClick={() => go(c.id, n.section)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </aside>
  )
}

// Scrollspy: theo vị trí cuộn thực tế của window — mục cuối cùng đã cuộn qua mép trên (trừ hao thanh trên) là mục đang đọc.
// Bỏ qua phần tử đang ẩn (nằm trong mục lớn đã thu gọn → display:none, toạ độ vô nghĩa).
function useScrollspy(ids: string[]): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (ids.length === 0) return
    const topOffset = 110
    let ticking = false

    function update() {
      ticking = false
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el || !el.offsetParent) continue
        if (el.getBoundingClientRect().top - topOffset <= 0) current = id
      }
      setActiveId(current)
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('lesson-sections-change', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('lesson-sections-change', onScroll)
    }
  }, [ids])

  return activeId
}
