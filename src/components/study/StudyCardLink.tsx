'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppLoading } from '@/components/loading/AppLoading'
import { APP_LOADING_BY_HREF } from '@/lib/loading/apps'
import type { LoadingTracker } from '@/lib/loading/tracker'

// Loading ở /study không bám theo request API nào mà bật cố định từ lúc bấm cho tới khi trang đích
// thay thế trang này (component bị gỡ cùng trang) — nên tracker luôn báo "đang hiện".
const alwaysOn: LoadingTracker = { subscribe: () => () => {}, getVisible: () => true }

// Nếu điều hướng kẹt/lỗi mà đường dẫn không đổi thì tự tắt loading sau chừng này, tránh treo mãi.
const GIVE_UP_MS = 15_000

interface Props {
  href: string
  accent: string
  className?: string
  children: ReactNode
}

// Thẻ app ở /study: bấm vào thì hiện ngay loading của đúng app đó (video/màu/câu chữ theo
// lib/loading/apps.ts) trong lúc trình duyệt chuyển sang trang đích. App chưa có cấu hình loading
// thì vẫn điều hướng bình thường, chỉ không có loading.
export function StudyCardLink({ href, accent, className, children }: Props) {
  const pathname = usePathname()
  const [going, setGoing] = useState(false)
  const [prevPath, setPrevPath] = useState(pathname)
  // Đường dẫn đổi (đã sang trang đích, hoặc quay lại /study) thì xoá cờ — phòng khi Next giữ nguyên
  // state của trang này lúc bấm Back, khiến loading cũ hiện lại.
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setGoing(false)
  }
  const config = APP_LOADING_BY_HREF[href]

  useEffect(() => {
    if (!going) return
    const timer = window.setTimeout(() => setGoing(false), GIVE_UP_MS)
    return () => window.clearTimeout(timer)
  }, [going])

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    // Ctrl/Cmd/Shift/Alt + click hoặc chuột giữa = mở tab/cửa sổ khác, trang này vẫn ở lại → không loading.
    if (!config || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    setGoing(true)
  }

  return (
    <>
      <Link href={href} className={className} style={{ '--accent': accent } as CSSProperties} onClick={onClick}>
        {children}
      </Link>
      {/* Portal ra body: .sd-card có backdrop-filter nên nếu đặt loading (position: fixed) bên trong
          thẻ, nó sẽ bị định vị theo thẻ chứ không phủ toàn màn hình. */}
      {going &&
        config &&
        createPortal(
          <AppLoading tracker={alwaysOn} videoSrc={config.videoSrc} accent={config.accent} message={config.message} />,
          document.body,
        )}
    </>
  )
}
