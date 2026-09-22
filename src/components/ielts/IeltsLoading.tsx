'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { AppLoading } from '@/components/loading/AppLoading'
import { IELTS_LOADING as config } from '@/lib/loading/apps'
import { beginIeltsNavigation, ieltsLoadingTracker, useIeltsNavigationStore } from '@/lib/ielts/navigationLoading'

export function IeltsLoading() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const navigatingTo = useIeltsNavigationStore((state) => state.navigatingTo)
  const endNavigation = useIeltsNavigationStore((state) => state.end)

  // Bắt mọi Link nội bộ trong IELTS, kể cả các màn practice/vocab, để loading xuất hiện ngay từ click.
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
      if (destination === `${window.location.pathname}${window.location.search}` && !url.hash) return
      beginIeltsNavigation(destination)
    }

    document.addEventListener('click', handleClick, true)
    return () => {
      document.removeEventListener('click', handleClick, true)
      // Khi rời hẳn khu IELTS, không để cờ điều hướng cũ tồn tại nếu người dùng quay lại sớm.
      ieltsLoadingTracker.setNavigationPending(false)
      useIeltsNavigationStore.getState().end()
    }
  }, [])

  // Route đã tới đích thì nhả phần điều hướng; tracker vẫn giữ overlay nếu API IELTS còn pending.
  useEffect(() => {
    if (navigatingTo === null) return
    const target = new URL(navigatingTo, window.location.origin)
    const currentSearch = new URLSearchParams(searchParams.toString())
    target.searchParams.sort()
    currentSearch.sort()
    if (target.pathname !== pathname || target.searchParams.toString() !== currentSearch.toString()) return
    ieltsLoadingTracker.setNavigationPending(false)
    endNavigation()
  }, [navigatingTo, pathname, searchParams, endNavigation])

  return (
    <AppLoading
      tracker={ieltsLoadingTracker}
      videoKey={config.videoKey}
      accent={config.accent}
      message={config.message}
      fontFamily="var(--font-ih-hand), 'Shantell Sans', cursive"
    />
  )
}
