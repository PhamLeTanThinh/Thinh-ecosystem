'use client'

import { AppLoading } from '@/components/loading/AppLoading'
import { MUSIC_LOADING as config } from '@/lib/loading/apps'
import { createLoadingTracker } from '@/lib/loading/tracker'

// Tạo ở cấp module (không trong component) để patch fetch xong trước mọi effect — xem tracker.ts.
const tracker = createLoadingTracker(config.apiPrefix)

export function MusicLoading() {
  return <AppLoading tracker={tracker} videoSrc={config.videoSrc} accent={config.accent} message={config.message} />
}
