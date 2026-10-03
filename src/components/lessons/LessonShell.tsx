'use client'

import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LessonArticle } from '@/components/lessons/LessonArticle'
import type { Lesson, LessonMeta, LessonTerm } from '@/lib/lessons/types'
import { AppBreadcrumb, type AppHref, type Crumb } from '@/components/study/Breadcrumb'
import { withViewTransition } from '@/lib/viewTransition'
import './lessons.css'
import { SidebarToggle } from '@/components/shared/SidebarToggle'

interface Props {
  app: AppHref
  trail: Crumb[]
  accent: string
  topicLabel: string
  topicIcon: string
  count: number
  // Card chủ đề tương ứng ở TopicChoice cùng view-transition-name này bay vào icon màn chọn bài của
  // trang này — bỏ trống nếu trang này không phải đích của TopicChoice nào.
  levelTransitionName?: string
  // Tiền tố view-transition-name riêng cho lưới "Bài n" ↔ dòng sidebar — không trùng hub khác.
  transitionPrefix: string
  // Có nội dung thật: mỗi bài 1 URL riêng `${basePath}/${slug}`. Trang lưới truyền lessonList (không có
  // current); trang bài truyền thêm current (bài đang xem, đã parse sẵn ở server). Không truyền → chỉ là
  // khung "Bài 1..count" chờ nội dung, chọn bài chỉ đổi state.
  basePath?: string
  lessonList?: LessonMeta[]
  current?: Lesson
  glossary?: Record<string, LessonTerm>
}

// 2 chế độ, cùng 1 cơ chế card→sidebar của Korean/Chinese (lib/viewTransition.ts):
// - Có lessonList + basePath: card "Bài n" ở lưới điều hướng SANG URL của bài (kèm View Transition, như
//   TopicChoice) — card bay sang dòng cùng tên trong sidebar của trang bài. Sidebar là link thường.
// - Không có: chọn bài KHÔNG đổi URL (vd /pm/pmfsoft), chỉ đổi state trong cùng 1 trang.
export function LessonShell(props: Props) {
  const { app, trail, accent, topicLabel, topicIcon, count: countProp, levelTransitionName, transitionPrefix, basePath, lessonList, current, glossary } = props
  const router = useRouter()
  const routed = !!(basePath && lessonList)
  const [picked, setPicked] = useState<number | null>(null)
  const count = lessonList?.length ?? countProp
  const selected = routed ? (current ? lessonList!.findIndex((l) => l.slug === current.slug) + 1 : null) : picked
  const label = (n: number) => lessonList?.[n - 1]?.short ?? `Bài ${n}`
  const href = (n: number) => `${basePath}/${lessonList![n - 1].slug}`

  // startViewTransition cần DOM trang đích sẵn sàng ngay khi callback trả về — prefetch sẵn mọi bài,
  // không thì hiệu ứng bay bị đứt (cùng lý do với TopicChoice).
  useEffect(() => {
    if (routed && selected === null) lessonList!.forEach((l) => router.prefetch(`${basePath}/${l.slug}`))
  }, [routed, selected, lessonList, basePath, router])

  function pickFromGrid(n: number) {
    withViewTransition(() => (routed ? router.push(href(n)) : setPicked(n)))
  }

  if (selected === null) {
    return (
      <div className="lg-root" style={{ '--lg-accent': accent } as CSSProperties}>
        <AppBreadcrumb app={app} trail={trail} />

        <div className="lg-head">
          {levelTransitionName && (
            <span className="lg-page-icon" style={{ viewTransitionName: levelTransitionName } as CSSProperties}>
              {topicIcon}
            </span>
          )}
          <div>
            <h1 className="lg-title">{topicLabel}</h1>
            <p className="lg-subtitle">{count} bài — bấm vào để xem nội dung.</p>
          </div>
        </div>

        <div className="lg-grid">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={`lg-card${lessonList ? ' lg-card--titled' : ''}`}
              style={{ viewTransitionName: `${transitionPrefix}-lesson-${n}` } as CSSProperties}
              onClick={() => pickFromGrid(n)}
            >
              <span className="lg-card-num">{n}</span>
              {lessonList?.[n - 1] && <span className="lg-card-icon">{lessonList[n - 1].icon}</span>}
              <span className="lg-card-label">{label(n)}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Ở trang bài: crumb chủ đề thành link về lưới, thêm crumb tên bài
  const shellTrail: Crumb[] =
    routed && current ? [...trail.slice(0, -1), { ...trail[trail.length - 1], href: basePath }, { label: current.short }] : trail
  const neighbour = (n: number) => (n >= 1 && n <= count ? { href: href(n), title: `${n}. ${label(n)}` } : undefined)

  return (
    <div className={`lg-shell${routed && current ? ' lg-shell--doc' : ''}`} style={{ '--lg-accent': accent } as CSSProperties}>
      <aside data-app-sidebar className="lg-sidebar" style={{ viewTransitionName: 'lg-sidebar' } as CSSProperties}>
        <SidebarToggle />
        <AppBreadcrumb app={app} trail={shellTrail} className="lg-sidebar-crumb" />

        <div className="lg-sidebar-list">
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => {
            const cls = `lg-sidebar-row${n === selected ? ' active' : ''}`
            const style = { viewTransitionName: `${transitionPrefix}-lesson-${n}` } as CSSProperties
            const inner = (
              <>
                <span className="lg-sidebar-row-num">{n}</span>
                {label(n)}
              </>
            )
            return routed ? (
              <Link key={n} href={href(n)} className={cls} style={style} aria-current={n === selected ? 'page' : undefined}>
                {inner}
              </Link>
            ) : (
              <button key={n} type="button" className={cls} style={style} onClick={() => setPicked(n)}>
                {inner}
              </button>
            )
          })}
        </div>
      </aside>

      <div className="lg-main">
        {routed && current ? (
          <div key={current.slug} className="lg-detail-fade">
            <LessonArticle
              lesson={current}
              index={selected}
              total={count}
              topicLabel={topicLabel}
              glossary={glossary ?? {}}
              prev={neighbour(selected - 1)}
              next={neighbour(selected + 1)}
            />
          </div>
        ) : (
          <>
            <div key={selected} className="lg-detail-meta lg-detail-fade">
              <span className="lg-detail-topic">{topicLabel}</span>
              <h1 className="lg-detail-title">Bài {selected}</h1>
            </div>
            <p className="lg-detail-body">Nội dung đang cập nhật.</p>
          </>
        )}
      </div>
    </div>
  )
}
