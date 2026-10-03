'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import type { LoadingTracker } from '@/lib/loading/tracker'

// Sự kiện để code điều hướng bằng router.push (không qua thẻ <a>) cũng bật được loading — xem announceNavigation.
const NAVIGATE_EVENT = 'app:navigate'

// Gọi ngay trước router.push(path) khi muốn overlay loading hiện lúc chuyển trang.
export function announceNavigation(path: string) {
  window.dispatchEvent(new CustomEvent<string>(NAVIGATE_EVENT, { detail: path }))
}

// Bắt click vào Link nội bộ (và announceNavigation) để loading hiện NGAY lúc bấm thay vì đứng im chờ server
// render trang đích; tới đúng đích thì nhả, tracker vẫn giữ overlay nếu trang mới còn request API đang bay.
// Dùng chung cho các app (Certs, IT…) — mỗi app truyền tracker của mình. Cần bọc Suspense (useSearchParams).
export function NavigationWatcher({ tracker }: { tracker: LoadingTracker }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)

  useEffect(() => {
    function begin(destination: string) {
      // Link mục lục (#heading) hoặc bấm lại đúng trang đang mở thì không điều hướng gì.
      if (destination === `${window.location.pathname}${window.location.search}`) return
      tracker.setNavigationPending(true)
      setNavigatingTo(destination)
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      begin(`${url.pathname}${url.search}`)
    }

    function handleAnnounce(event: Event) {
      const url = new URL((event as CustomEvent<string>).detail, window.location.href)
      begin(`${url.pathname}${url.search}`)
    }

    document.addEventListener('click', handleClick, true)
    window.addEventListener(NAVIGATE_EVENT, handleAnnounce)
    return () => {
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener(NAVIGATE_EVENT, handleAnnounce)
      // Rời hẳn app: không để cờ điều hướng cũ còn lại nếu người dùng quay lại sớm.
      tracker.setNavigationPending(false)
    }
  }, [tracker])

  useEffect(() => {
    if (navigatingTo === null) return
    const target = new URL(navigatingTo, window.location.origin)
    const currentSearch = new URLSearchParams(searchParams.toString())
    target.searchParams.sort()
    currentSearch.sort()
    if (target.pathname !== pathname || target.searchParams.toString() !== currentSearch.toString()) return
    tracker.setNavigationPending(false)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- nhả cờ khi route đã tới đích
    setNavigatingTo(null)
  }, [navigatingTo, pathname, searchParams, tracker])

  return null
}
