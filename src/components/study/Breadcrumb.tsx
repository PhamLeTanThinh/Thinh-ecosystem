import { Fragment } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { STUDY_TOOLS } from '@/lib/apps/tools'
import './breadcrumb.css'

type CrumbIcon = 'study' | 'cards' | 'quiz' | 'note' | 'star' | 'users' | 'key'

export interface Crumb {
  label: string
  href?: string
  icon?: CrumbIcon
  // Ký tự đại diện của app (한 / 中 / EN / ♪ — lấy từ STUDY_TOOLS), dùng thay icon nét cho mục app.
  glyph?: string
}

// Icon nét mảnh 24x24, đổi màu theo currentColor — không phụ thuộc font/emoji của hệ điều hành.
const ICON_PATHS: Record<CrumbIcon, ReactNode> = {
  study: <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5v-15Zm16 0A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5v-15Z" />,
  cards: (
    <>
      <rect x="3" y="6" width="13" height="14" rx="2" />
      <path d="M8 3h11a2 2 0 0 1 2 2v11" />
    </>
  ),
  quiz: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 17h.01" />
    </>
  ),
  note: (
    <>
      <path d="M10 18V4l8 2" />
      <circle cx="7.5" cy="18" r="2.5" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.7c2 .6 3.5 2.2 3.5 5.3" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9M16 7l3 3" />
    </>
  ),
}

function CrumbIconSvg({ name }: { name: CrumbIcon }) {
  return (
    <svg className="sb-crumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  )
}

interface BreadcrumbProps {
  items: Crumb[]
  // Màu chủ đạo của app đang xem (lấy từ APP_BRAND qua STUDY_TOOLS) — tô viên "trang hiện tại" và hover.
  accent: string
  className?: string
}

// Điều hướng phân cấp kiểu web dùng chung cho mọi trang trong hệ thống Study: viên thuốc chứa chuỗi
// "Study › App › Trang hiện tại". Mục cha là link (hover nổi lên theo màu app), mục cuối là viên màu app
// đánh dấu trang đang xem (aria-current, không bấm được). Tự chứa style (breadcrumb.css), không phụ
// thuộc token CSS của từng app nên đặt được ở bất kỳ đâu.
export function Breadcrumb({ items, accent, className }: BreadcrumbProps) {
  return (
    <nav className={`sb-breadcrumb${className ? ` ${className}` : ''}`} aria-label="Breadcrumb" style={{ '--sb-accent': accent } as CSSProperties}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1
          const content = (
            <>
              {item.glyph ? (
                <span className="sb-crumb-glyph" aria-hidden="true">
                  {item.glyph}
                </span>
              ) : (
                item.icon && <CrumbIconSvg name={item.icon} />
              )}
              <span>{item.label}</span>
            </>
          )
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {last || !item.href ? (
                  <span className="sb-crumb sb-crumb--current" aria-current="page">
                    {content}
                  </span>
                ) : (
                  <Link href={item.href} className="sb-crumb">
                    {content}
                  </Link>
                )}
              </li>
              {!last && (
                <li className="sb-crumb-sep" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

type AppHref = '/korean' | '/chinese' | '/ielts' | '/music'

// Breadcrumb của 1 app học: "Study › <App>" rồi tới `trail` (các trang con). Tên, ký tự và màu của app lấy
// từ STUDY_TOOLS — cùng nguồn với thẻ ở /study — nên luôn khớp với thẻ mà người dùng đã bấm vào.
export function AppBreadcrumb({ app, trail = [], className }: { app: AppHref; trail?: Crumb[]; className?: string }) {
  const tool = STUDY_TOOLS.find((t) => t.href === app)
  if (!tool) return null
  const items: Crumb[] = [
    { label: 'Study', href: '/study', icon: 'study' },
    // Tên Korean/Chinese đã bắt đầu bằng chính ký tự đại diện (한국어 Hub / 中文 Hub) — bỏ glyph để khỏi lặp chữ.
    { label: tool.title, href: app, glyph: tool.title.startsWith(tool.icon) ? undefined : tool.icon },
    ...trail,
  ]
  return <Breadcrumb items={items} accent={tool.accent} className={className} />
}
