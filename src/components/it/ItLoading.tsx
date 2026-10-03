'use client'

import { Suspense } from 'react'
import { AppLoading } from '@/components/loading/AppLoading'
import { NavigationWatcher } from '@/components/loading/NavigationWatcher'
import { IT_LOADING as config } from '@/lib/loading/apps'
import { createLoadingTracker } from '@/lib/loading/tracker'

// Tạo ở cấp module (không trong component) để patch fetch xong trước mọi effect — xem tracker.ts.
const tracker = createLoadingTracker(config.apiPrefix)

// Loading hiện cả lúc chuyển trang (vd chuyển giữa các bài Machine Learning) — xem NavigationWatcher.
export function ItLoading() {
  return (
    <>
      <AppLoading tracker={tracker} videoKey={config.videoKey} accent={config.accent} message={config.message} />
      <Suspense fallback={null}>
        <NavigationWatcher tracker={tracker} />
      </Suspense>
    </>
  )
}
