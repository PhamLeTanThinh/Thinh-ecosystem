'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AppLoading } from '@/components/loading/AppLoading'
import { CERTS_LOADING as config } from '@/lib/loading/apps'
import { createLoadingTracker } from '@/lib/loading/tracker'

// Tạo ở cấp module (không trong component) để patch fetch xong trước mọi effect — xem tracker.ts.
const tracker = createLoadingTracker(config.apiPrefix)

// Cùng cơ chế với IeltsLoading: bắt click vào Link nội bộ để loading hiện NGAY lúc bấm (chuyển chủ đề lý
// thuyết, đổi cert…) thay vì đứng im chờ server render trang đích; tới đúng đích thì nhả, tracker vẫn giữ
// overlay nếu trang mới còn request /api/certs đang bay (vd CertQuiz tải tiến độ).
function NavigationWatcher() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      const destination = `${url.pathname}${url.search}`
      // Link mục lục (#heading) hoặc bấm lại đúng trang đang mở thì không điều hướng gì.
      if (destination === `${window.location.pathname}${window.location.search}`) return
      tracker.setNavigationPending(true)
      setNavigatingTo(destination)
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      // Rời hẳn khu Certs: không để cờ điều hướng cũ còn lại nếu người dùng quay lại sớm.
      tracker.setNavigationPending(false)
    }
  }, [])

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
  }, [navigatingTo, pathname, searchParams])

  return null
}

export function CertsLoading() {
  return (
    <>
      <AppLoading tracker={tracker} videoKey={config.videoKey} accent={config.accent} message={config.message} />
      {/* useSearchParams cần Suspense để trang tĩnh (/certs/login) vẫn prerender được. */}
      <Suspense fallback={null}>
        <NavigationWatcher />
      </Suspense>
    </>
  )
}
