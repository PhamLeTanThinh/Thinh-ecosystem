'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { Lesson, LessonBlock, LessonBoxKind, LessonTerm } from '@/lib/lessons/types'
import { VIZ } from './viz/registry'
import { VizBoundary } from './viz/VizBoundary'
import './lesson-article.css'

type Glossary = Record<string, LessonTerm>

const BOX_LABEL: Record<LessonBoxKind, string> = {
  example: '🧮 Ví dụ',
  analogy: '🧠 Hình dung cho dễ',
  tip: '💡 Mẹo',
  warn: '⚠️ Lưu ý',
  formula: '📐 Công thức',
}

// Thuật ngữ trong bài: rê chuột (hoặc chạm/Tab tới) để xem giải thích — tra trong bảng thuật ngữ chung
// của cả khoá, không có thì hiện chữ thường. Phần "Ví dụ: …" trong giải thích tách thành dòng riêng.
// Tooltip render qua portal ra <body> (position: fixed) rồi kẹp trong màn hình: đặt ngay trong dòng chữ thì
// bị sidebar che (sidebar nằm trên khối nội dung) và tràn ngang trên mobile khi thuật ngữ sát mép.
function TermRef({ label, term }: { label: string; term?: LessonTerm }) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const popRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const anchor = anchorRef.current?.getBoundingClientRect()
      const pop = popRef.current
      if (!anchor || !pop) return
      const { width, height } = pop.getBoundingClientRect()
      const gap = 8
      const left = Math.max(gap, Math.min(anchor.left + anchor.width / 2 - width / 2, window.innerWidth - width - gap))
      // Mặc định nằm trên chữ; không đủ chỗ phía trên thì lật xuống dưới
      const top = anchor.top - height - gap >= gap ? anchor.top - height - gap : anchor.bottom + gap
      pop.style.left = `${left}px`
      pop.style.top = `${top}px`
      pop.style.visibility = 'visible'
    }
    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  if (!term) return <>{label}</>
  return (
    <span
      ref={anchorRef}
      className="la-term"
      tabIndex={0}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {label}
      {open &&
        createPortal(
          <span ref={popRef} className="la-term-pop" role="tooltip">
            <b>
              {term.term}
              {term.full && <span className="la-term-full"> · {term.full}</span>}
            </b>
            {term.explain.split(/\s(?=Ví dụ:)/).map((part, i) => (
              <span key={i} className={i ? 'la-term-eg' : undefined}>
                {inline(part, {})}
              </span>
            ))}
          </span>,
          document.body,
        )}
    </span>
  )
}

function inline(text: string, glossary: Glossary): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of text.matchAll(/(\*\*[^*]+\*\*|`[^`]+`|\[\[[^\]]+\]\])/g)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) out.push(<strong key={i++}>{inline(tok.slice(2, -2), glossary)}</strong>)
    else if (tok.startsWith('`')) out.push(<code key={i++}>{tok.slice(1, -1)}</code>)
    else {
      const [label, key] = tok.slice(2, -2).split('|')
      out.push(<TermRef key={i++} label={label} term={glossary[(key ?? label).trim().toLowerCase()]} />)
    }
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

type Zoom = { src: string; caption: string } | null

// Danh sách lồng: dựng cây từ levels (độ thụt lề) để mục con nằm trong <ul> riêng bên trong mục cha —
// mục con "-" dưới mục "3." không bị đánh số tiếp thành 4, 5.
interface ListNode {
  text: string
  children: ListNode[]
}

function toTree(items: string[], levels: number[]): ListNode[] {
  const root: ListNode[] = []
  const stack: { level: number; node: ListNode }[] = []
  items.forEach((text, i) => {
    const node = { text, children: [] }
    while (stack.length && stack[stack.length - 1].level >= levels[i]) stack.pop()
    ;(stack.length ? stack[stack.length - 1].node.children : root).push(node)
    stack.push({ level: levels[i], node })
  })
  return root
}

function NestedList({ type, nodes, glossary }: { type: 'ul' | 'ol'; nodes: ListNode[]; glossary: Glossary }) {
  const List = type
  return (
    <List>
      {nodes.map((n, j) => (
        <li key={j}>
          {inline(n.text, glossary)}
          {n.children.length > 0 && <NestedList type="ul" nodes={n.children} glossary={glossary} />}
        </li>
      ))}
    </List>
  )
}

function Blocks({ blocks, glossary, onZoom }: { blocks: LessonBlock[]; glossary: Glossary; onZoom: (z: Zoom) => void }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'p':
            return <p key={i}>{inline(b.text, glossary)}</p>
          case 'h3':
            return <h3 key={i}>{inline(b.text, glossary)}</h3>
          case 'ul':
          case 'ol':
            return <NestedList key={i} type={b.t} nodes={toTree(b.items, b.levels)} glossary={glossary} />
          case 'code':
            return (
              <pre key={i} className="la-code" data-lang={b.lang}>
                <code>{b.code}</code>
              </pre>
            )
          case 'table':
            return (
              <div key={i} className="la-table-wrap">
                <table className="la-table">
                  <thead>
                    <tr>
                      {b.head.map((h, j) => (
                        <th key={j}>{inline(h, glossary)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>{inline(c, glossary)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'img':
            // Hiện nhỏ hơn kích thước gốc (ảnh được cắt ở độ phân giải cao) — bấm để xem to
            return (
              <figure key={i} className="la-figure">
                <button type="button" onClick={() => onZoom({ src: b.src, caption: b.caption })} aria-label={`Phóng to hình: ${b.caption}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.src} alt={b.caption} width={b.width} height={b.height} loading="lazy" decoding="async" style={b.width ? { maxWidth: Math.round(b.width / 1.6) } : undefined} />
                </button>
                {b.caption && <figcaption>{inline(b.caption, glossary)}</figcaption>}
              </figure>
            )
          case 'viz': {
            const v = VIZ[b.name]
            return (
              <figure key={i} className="la-figure la-figure-viz">
                <div className="la-viz-slot">
                  <div style={{ aspectRatio: v?.ratio ?? 2 }}>{v ? (
                      <VizBoundary name={b.name}>
                        <v.C />
                      </VizBoundary>
                    ) : (
                      <p className="la-viz-missing">Chưa có đồ thị “{b.name}”</p>
                    )}</div>
                </div>
                {b.caption && <figcaption>{inline(b.caption, glossary)}</figcaption>}
              </figure>
            )
          }
          case 'box':
            return (
              <div key={i} className={`la-box la-box-${b.kind}`}>
                <p className="la-box-label">
                  {BOX_LABEL[b.kind]}
                  {b.title && <span> · {inline(b.title, glossary)}</span>}
                </p>
                <Blocks blocks={b.blocks} glossary={glossary} onZoom={onZoom} />
              </div>
            )
        }
      })}
    </>
  )
}

export function LessonArticle({
  lesson,
  index,
  total,
  topicLabel,
  glossary,
  prev,
  next,
}: {
  lesson: Lesson
  index: number // 1-based
  total: number
  topicLabel: string
  glossary: Glossary
  prev?: { href: string; title: string } // bài trước/bài tiếp — link sang URL riêng của bài đó
  next?: { href: string; title: string }
}) {
  const [zoom, setZoom] = useState<Zoom>(null)

  // Mục cho menu đọc bên phải: các phần nội dung + Ghi nhớ nhanh
  const marks: TocMark[] = [
    ...lesson.sections.map((s, i) => ({
      id: s.id,
      label: s.heading,
      num: String(i + 1),
    })),
    ...(lesson.takeaways.length ? [{ id: TAKEAWAYS_ID, label: 'Ghi nhớ nhanh', num: '📌' }] : []),
  ]

  return (
    <div className="la-layout">
      <article className="la-root">
        <header className="la-head">
          <p className="la-eyebrow">
            {topicLabel} · Bài {index}/{total} · ~{lesson.minutes} phút đọc
          </p>
          <h1 className="la-title">
            <span className="la-title-icon">{lesson.icon}</span>
            {lesson.title}
          </h1>
          {lesson.summary && <p className="la-summary">{inline(lesson.summary, glossary)}</p>}
        </header>

        {lesson.goals.length > 0 && (
          <div className="la-goals">
            <p className="la-box-label">🎯 Học xong bài này bạn sẽ</p>
            <ul>
              {lesson.goals.map((g, i) => (
                <li key={i}>{inline(g, glossary)}</li>
              ))}
            </ul>
          </div>
        )}

        {lesson.sections.length > 1 && (
          <nav className="la-toc" aria-label="Mục lục bài">
            {lesson.sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} onClick={(e) => (e.preventDefault(), scrollToMark(s.id))}>
                <span>{i + 1}</span>
                {s.heading}
              </a>
            ))}
          </nav>
        )}

        {lesson.sections.map((s, i) => (
          <section key={s.id} id={s.id} className="la-section">
            <h2>
              <span className="la-section-num">{i + 1}</span>
              {s.heading}
            </h2>
            <Blocks blocks={s.blocks} glossary={glossary} onZoom={setZoom} />
          </section>
        ))}

        {lesson.takeaways.length > 0 && (
          <div id={TAKEAWAYS_ID} className="la-takeaways">
            <p className="la-box-label">📌 Ghi nhớ nhanh</p>
            <ul>
              {lesson.takeaways.map((t, i) => (
                <li key={i}>{inline(t, glossary)}</li>
              ))}
            </ul>
          </div>
        )}

        <nav className="la-pager">
          {prev ? (
            <Link href={prev.href}>
              <small>← Bài trước</small>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={next.href} className="la-pager-next">
              <small>Bài tiếp →</small>
              {next.title}
            </Link>
          )}
        </nav>
      </article>
      <ReadingMenu marks={marks} />
      {zoom && <Lightbox zoom={zoom} onClose={() => setZoom(null)} />}
    </div>
  )
}

const TAKEAWAYS_ID = 'ghi-nho-nhanh'

interface TocMark {
  id: string
  label: string
  num: string
}

function scrollToMark(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Menu đọc bên phải (màn hình rộng): mục lục dính theo màn hình, tự sáng phần đang đọc + % đã đọc của bài.
// Trang cuộn bằng window (sidebar trái dính bằng sticky) nên theo dõi scroll của window.
function ReadingMenu({ marks }: { marks: TocMark[] }) {
  const [active, setActive] = useState(marks[0]?.id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        // Phần đang đọc = phần cuối cùng có tiêu đề đã lên tới 1/3 trên màn hình
        const line = window.innerHeight * 0.33
        let current = marks[0]?.id
        for (const m of marks) {
          const el = document.getElementById(m.id)
          if (el && el.getBoundingClientRect().top <= line) current = m.id
        }
        const max = document.documentElement.scrollHeight - window.innerHeight
        // Cuộn chạm đáy thì sáng mục cuối (mục cuối thường ngắn, tiêu đề không lên tới vạch 1/3 được)
        if (max > 0 && window.scrollY >= max - 2) current = marks[marks.length - 1]?.id
        setActive(current)
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 1)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [marks])

  return (
    <aside className="la-aside" aria-label="Menu đọc">
      <div className="la-aside-inner">
        <p className="la-aside-title">
          Đang đọc <span>{Math.round(progress * 100)}%</span>
        </p>
        <div className="la-aside-bar">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
        <nav>
          {marks.map((m) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className={m.id === active ? 'active' : undefined}
              aria-current={m.id === active ? 'location' : undefined}
              onClick={(e) => (e.preventDefault(), scrollToMark(m.id))}
            >
              <span className="la-aside-num">{m.num}</span>
              {m.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}

// Bỏ cú pháp inline (**đậm**, `code`, [[chữ|thuật ngữ]]) — chú thích trong lightbox chỉ cần chữ thường
function plainText(text: string) {
  return text.replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1').replace(/\*\*|`/g, '')
}

// Xem hình phóng to: bấm nền hoặc nhấn Esc để đóng. Render qua portal ra <body> — khối nội dung bài có
// animation transform (lg-detail-fade) khiến position:fixed bên trong bị giới hạn trong khối đó.
function Lightbox({ zoom, onClose }: { zoom: NonNullable<Zoom>; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div className="la-lightbox" role="dialog" aria-modal="true" aria-label={zoom.caption} onClick={onClose}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={zoom.src} alt={zoom.caption} />
      {zoom.caption && <p>{plainText(zoom.caption)}</p>}
      <button type="button" className="la-lightbox-close" aria-label="Đóng">
        ✕
      </button>
    </div>,
    document.body,
  )
}
