'use client'

import { Suspense } from 'react'
import { AppLoading } from '@/components/loading/AppLoading'
import { NavigationWatcher } from '@/components/loading/NavigationWatcher'
import { CERTS_LOADING as config } from '@/lib/loading/apps'
import { createLoadingTracker } from '@/lib/loading/tracker'

// Tạo ở cấp module (không trong component) để patch fetch xong trước mọi effect — xem tracker.ts.
const tracker = createLoadingTracker(config.apiPrefix)

// Cùng cơ chế với IeltsLoading: loading hiện NGAY lúc bấm link (chuyển chủ đề lý thuyết, đổi cert…), xem
// NavigationWatcher; tracker vẫn giữ overlay nếu trang mới còn request /api/certs đang bay (vd CertQuiz tải tiến độ).
export function CertsLoading() {
  return (
    <>
      <AppLoading tracker={tracker} videoKey={config.videoKey} accent={config.accent} message={config.message} />
      {/* useSearchParams cần Suspense để trang tĩnh (/certs/login) vẫn prerender được. */}
      <Suspense fallback={null}>
        <NavigationWatcher tracker={tracker} />
      </Suspense>
    </>
  )
}
