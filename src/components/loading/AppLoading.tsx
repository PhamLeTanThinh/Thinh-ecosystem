'use client'

import { useSyncExternalStore } from 'react'
import type { CSSProperties } from 'react'
import type { LoadingTracker } from '@/lib/loading/tracker'
import { ShieldedVideo } from '@/components/media/ShieldedVideo'
import './app-loading.css'

interface Props {
  tracker: LoadingTracker
  // Key trong VIDEO_MAP của /api/media/[key] (không phải đường dẫn .mp4) — xem ShieldedVideo.
  videoKey: string
  // Màu vòng xoay và font của dòng chữ — theo token của từng app; bỏ trống thì dùng mặc định trong CSS.
  accent?: string
  fontFamily?: string
  message?: string
}

// Chỉ hiển thị — toàn bộ logic hiện/ẩn (trang load xong, request API của app đang bay, độ trễ chống
// nháy) nằm trong tracker (lib/loading/tracker.ts). Server snapshot = true để loading có mặt từ HTML
// đầu tiên.
export function AppLoading({ tracker, videoKey, accent, fontFamily, message = 'Wait for Diên xíu nha!' }: Props) {
  const visible = useSyncExternalStore(tracker.subscribe, tracker.getVisible, () => true)
  return (
    <div
      className={`app-loader${visible ? ' app-loader--on' : ''}`}
      style={{ '--loader-accent': accent, '--loader-font': fontFamily } as CSSProperties}
      role="status"
      aria-label="Đang tải"
      aria-hidden={!visible}
    >
      <div className="app-loader-circle">
        {/* Luôn mount để tải sẵn (hiện lên là chạy ngay), nhưng dừng khi đang ẩn. */}
        <ShieldedVideo className="app-loader-video" mediaKey={videoKey} playing={visible} />
        <p className="app-loader-text" aria-hidden="true">
          {message}
        </p>
      </div>
    </div>
  )
}
