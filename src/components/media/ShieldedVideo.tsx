'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  // Key trong VIDEO_MAP của /api/media/[key] — KHÔNG phải đường dẫn .mp4 thật, xem route.ts.
  mediaKey: string
  className?: string
  // Chỉ bắt đầu tải khi video sắp vào khung nhìn (thẻ ở dưới màn hình không tranh băng thông với thẻ đang thấy).
  lazy?: boolean
}

// Video nền trang trí (mascot) mà không lộ URL/MIME video/* trên network — né IDM và các trình quản
// lý tải khác tự chèn nút "Download this video" đè lên trang. Tải bytes qua fetch() (route trả
// application/octet-stream, không phải video/*, URL không có đuôi .mp4), tự đóng gói lại thành Blob
// video/mp4 rồi gán qua URL.createObjectURL — <video> chỉ thấy 1 địa chỉ blob: nội bộ.
// Khi khung hình đầu đã giải mã xong, thêm class "is-ready" để CSS làm hiệu ứng hiện dần.
export function ShieldedVideo({ mediaKey, className, lazy = false }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [near, setNear] = useState(!lazy)
  const sentinel = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (near) return
    const el = sentinel.current
    if (!el || !('IntersectionObserver' in window)) {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  useEffect(() => {
    if (!near) return
    let cancelled = false
    let objectUrl: string | null = null

    fetch(`/api/media/${mediaKey}`)
      .then((res) => res.blob())
      .then((raw) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(new Blob([raw], { type: 'video/mp4' }))
        setBlobUrl(objectUrl)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [mediaKey, near])

  if (!blobUrl) {
    return lazy ? <span ref={sentinel} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} /> : null
  }

  return (
    <video
      className={`${className ?? ''}${ready ? ' is-ready' : ''}`}
      src={blobUrl}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      onLoadedData={() => setReady(true)}
    />
  )
}
