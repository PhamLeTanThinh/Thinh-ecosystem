'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import type { CSSProperties } from 'react'
import type { LoadingTracker } from '@/lib/loading/tracker'
import './app-loading.css'

interface Props {
  tracker: LoadingTracker
  videoSrc: string
  // Màu vòng xoay và font của dòng chữ — theo token của từng app; bỏ trống thì dùng mặc định trong CSS.
  accent?: string
  fontFamily?: string
  message?: string
}

// Chỉ hiển thị — toàn bộ logic hiện/ẩn (trang load xong, request API của app đang bay, độ trễ chống
// nháy) nằm trong tracker (lib/loading/tracker.ts). Server snapshot = true để loading có mặt từ HTML
// đầu tiên.
export function AppLoading({ tracker, videoSrc, accent, fontFamily, message = 'Wait for Diên xíu nha!' }: Props) {
  const visible = useSyncExternalStore(tracker.subscribe, tracker.getVisible, () => true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Video luôn được mount (để đã tải sẵn, hiện lên là chạy ngay) nhưng dừng lại khi đang ẩn.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (visible) video.play().catch(() => {})
    else video.pause()
  }, [visible])

  return (
    <div
      className={`app-loader${visible ? ' app-loader--on' : ''}`}
      style={{ '--loader-accent': accent, '--loader-font': fontFamily } as CSSProperties}
      role="status"
      aria-label="Đang tải"
      aria-hidden={!visible}
    >
      <div className="app-loader-circle">
        <video
          ref={videoRef}
          className="app-loader-video"
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
        />
        <p className="app-loader-text" aria-hidden="true">
          {message}
        </p>
      </div>
    </div>
  )
}
