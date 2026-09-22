'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { STUDY_TOOLS } from '@/lib/apps/tools'
import { HSK_LEVELS } from '@/lib/chinese/lessons'
import { SKILLS } from '@/lib/ielts/skills'
import './breadcrumb.css'

type CrumbIcon = 'study' | 'cards' | 'quiz' | 'note' | 'star' | 'users' | 'key'

export interface Crumb {
  label: string
  href?: string
  icon?: CrumbIcon
  // Ký tự đại diện của app (한 / 中 / EN / ♪ — lấy từ STUDY_TOOLS), dùng thay icon nét cho mục app.
  glyph?: string
  options?: CrumbOption[]
}

export interface CrumbOption {
  label: string
  href: string
  glyph?: string
  active?: boolean
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

// Điều hướng phân cấp dùng chung cho mọi trang trong hệ thống Study: dãy chip vuông bo góc, mỗi chip chỉ
// hiện icon (hoặc ký tự đại diện / chữ cái đầu nếu mục không có icon); rê chuột / focus vào chip thì chữ
// trượt ra. Mục cuối (trang đang xem, aria-current) luôn hiện sẵn chữ và ngả theo màu app. Thiết bị cảm
// ứng (không có hover) thì hiện chữ của mọi chip. Tự chứa style (breadcrumb.css), không phụ thuộc token
// CSS của từng app nên đặt được ở bất kỳ đâu.
export function Breadcrumb({ items, accent, className }: BreadcrumbProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (openIndex === null) return
    function closeOnOutsideClick(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenIndex(null)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenIndex(null)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openIndex])

  return (
    <nav ref={navRef} className={`sb-breadcrumb${className ? ` ${className}` : ''}`} aria-label="Breadcrumb" style={{ '--sb-accent': accent } as CSSProperties}>
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1
          const content = (
            <>
              <span className="sb-crumb-mark" aria-hidden="true">
                {item.icon ? <CrumbIconSvg name={item.icon} /> : <span className="sb-crumb-glyph">{item.glyph ?? initials(item.label)}</span>}
              </span>
              <span className="sb-crumb-label">{item.label}</span>
            </>
          )
          return (
            <li
              key={`${item.label}-${i}`}
              className={`sb-crumb-item${item.options?.length ? ' sb-crumb-item--switcher' : ''}${openIndex === i ? ' is-open' : ''}`}
            >
              {item.options?.length ? (
                <button
                  type="button"
                  className={`sb-crumb${last ? ' sb-crumb--current' : ''}`}
                  aria-current={last ? 'page' : undefined}
                  aria-haspopup="menu"
                  aria-expanded={openIndex === i}
                  onClick={() => setOpenIndex((current) => (current === i ? null : i))}
                >
                  {content}
                </button>
              ) : last || !item.href ? (
                <span
                  className={`sb-crumb${last ? ' sb-crumb--current' : ''}`}
                  aria-current={last ? 'page' : undefined}
                  tabIndex={0}
                >
                  {content}
                </span>
              ) : (
                <Link href={item.href} className="sb-crumb">
                  {content}
                </Link>
              )}
              {item.options?.length ? (
                <div className="sb-crumb-dropdown" role="menu" aria-label={`Chuyển ${item.label}`}>
                  {item.options.map((option) => (
                    <Link
                      key={option.href}
                      href={option.href}
                      role="menuitem"
                      className={`sb-crumb-option${option.active ? ' active' : ''}`}
                      aria-current={option.active ? 'page' : undefined}
                      onClick={() => setOpenIndex(null)}
                    >
                      <span className="sb-crumb-option-glyph" aria-hidden>
                        {option.glyph ?? initials(option.label)}
                      </span>
                      <span>{option.label}</span>
                      {option.active && <span className="sb-crumb-option-check">✓</span>}
                    </Link>
                  ))}
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Mục không có icon/ký tự riêng thì lấy chữ cái đầu của tối đa 2 từ đầu ("Machine Learning" → "ML").
function initials(label: string): string {
  return label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export type AppHref = '/korean' | '/chinese' | '/ielts' | '/music' | '/pm' | '/it' | '/certs'

// Breadcrumb của 1 app học: "Study › <App>" rồi tới `trail` (các trang con). Tên, ký tự và màu của app lấy
// từ STUDY_TOOLS — cùng nguồn với thẻ ở /study — nên luôn khớp với thẻ mà người dùng đã bấm vào.
export function AppBreadcrumb({ app, trail = [], className }: { app: AppHref; trail?: Crumb[]; className?: string }) {
  const tool = STUDY_TOOLS.find((t) => t.href === app)
  if (!tool) return null
  const hasStudySwitcher = app === '/chinese' || app === '/korean' || app === '/ielts'
  const appOptions: CrumbOption[] = STUDY_TOOLS.filter((candidate) => ['/chinese', '/korean', '/ielts'].includes(candidate.href)).map((candidate) => ({
    label: candidate.shortTitle ?? candidate.title,
    href: candidate.href,
    glyph: candidate.icon,
    active: candidate.href === app,
  }))
  const sectionOptions = getSectionOptions(app)
  const switchableTrail = trail.map((crumb, index) => {
    if (index !== 0 || !sectionOptions.some((option) => option.label === crumb.label)) return crumb
    return {
      ...crumb,
      options: sectionOptions.map((option) => ({ ...option, active: option.label === crumb.label })),
    }
  })
  const items: Crumb[] = [
    {
      label: 'Study',
      href: '/study',
      icon: 'study',
      options: hasStudySwitcher
        ? [
            { label: 'Tất cả ứng dụng', href: '/study', glyph: '⌂' },
            ...STUDY_TOOLS.map((candidate) => ({ label: candidate.shortTitle ?? candidate.title, href: candidate.href, glyph: candidate.icon, active: candidate.href === app })),
          ]
        : undefined,
    },
    // shortTitle (nếu có) thay cho tên đầy đủ — viên "Study › ..." gọn hơn (vd. "Project Manager" → "PM").
    { label: tool.shortTitle ?? tool.title, href: app, glyph: tool.icon, options: hasStudySwitcher ? appOptions : undefined },
    ...switchableTrail,
  ]
  return <Breadcrumb items={items} accent={tool.accent} className={className} />
}

function getSectionOptions(app: AppHref): CrumbOption[] {
  if (app === '/chinese') {
    return [
      { label: 'Ngữ âm cơ bản', href: '/chinese/lessons?open=phonetics', glyph: '音' },
      ...HSK_LEVELS.map((level) => ({ label: level.label, href: `/chinese/lessons?open=${level.key}`, glyph: level.label.replace('HSK ', 'H') })),
    ]
  }
  if (app === '/korean') {
    return [
      { label: 'TOPIK I', href: '/korean/lessons?open=topik1', glyph: 'T1' },
      { label: 'TOPIK II', href: '/korean/lessons?open=topik2', glyph: 'T2' },
    ]
  }
  if (app === '/ielts') {
    return SKILLS.map((skill) => ({ label: skill.label, href: `/ielts/${skill.key}/lessons`, glyph: skill.icon }))
  }
  return []
}
