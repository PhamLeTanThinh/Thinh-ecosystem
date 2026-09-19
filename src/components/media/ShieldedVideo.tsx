'use client'

import { useEffect, useState } from 'react'

interface Props {
  // Key trong VIDEO_MAP của /api/media/[key] — KHÔNG phải đường dẫn .mp4 thật, xem route.ts.
  mediaKey: string
  className?: string
}

// Video nền trang trí (mascot) mà không lộ URL/MIME video/* trên network — né IDM và các trình quản
// lý tải khác tự chèn nút "Download this video" đè lên trang. Tải bytes qua fetch() (route trả
// application/octet-stream, không phải video/*, URL không có đuôi .mp4), tự đóng gói lại thành Blob
// video/mp4 rồi gán qua URL.createObjectURL — <video> chỉ thấy 1 địa chỉ blob: nội bộ.
export function ShieldedVideo({ mediaKey, className }: Props) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
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
  }, [mediaKey])

  if (!blobUrl) return null

  return (
    <video className={className} src={blobUrl} autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
  )
}
