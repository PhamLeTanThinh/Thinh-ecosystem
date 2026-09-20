'use client'

import { AppLoading } from '@/components/loading/AppLoading'
import { CERTS_LOADING as config } from '@/lib/loading/apps'
import { createLoadingTracker } from '@/lib/loading/tracker'

// Tạo ở cấp module (không trong component) để patch fetch xong trước mọi effect — xem tracker.ts.
const tracker = createLoadingTracker(config.apiPrefix)

export function CertsLoading() {
  return <AppLoading tracker={tracker} videoKey={config.videoKey} accent={config.accent} message={config.message} />
}
