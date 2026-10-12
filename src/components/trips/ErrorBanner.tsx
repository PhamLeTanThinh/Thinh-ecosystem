'use client'

import { useEffect, useRef } from 'react'

// Lỗi của form (thiếu tên, lỗi lưu...) — đặt ở ĐẦU form và tự cuộn tới khi xuất hiện. Trước đây lỗi nằm cuối form dài,
// bấm "Lưu" ở thanh tiêu đề thấy như không có gì xảy ra vì thông báo nằm ngoài khung nhìn.
export function ErrorBanner({ error }: { error: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  useEffect(() => {
    if (error) ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [error])
  if (!error) return null
  return (
    <p ref={ref} role="alert" className="flex items-start gap-2 rounded-xl bg-danger-soft px-3 py-2.5 text-sm font-medium text-danger">
      <span aria-hidden="true">⚠️</span>
      {error}
    </p>
  )
}
