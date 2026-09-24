'use client'

import { useEffect, useState } from 'react'
import { syncPractice } from '@/lib/ielts/practiceSync'

// Chặn hiển thị nội dung /ielts cho tới khi dữ liệu luyện đề từ database đã được trộn về localStorage —
// các màn luyện đọc localStorage ngay lúc mount nên phải có dữ liệu mới nhất trước đó. Quá 4 giây (mạng/DB
// chậm) thì cứ hiển thị bằng dữ liệu đang có ở máy.
const MAX_WAIT_MS = 4000

export function PracticeSyncGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let done = false
    const finish = () => {
      if (!done) {
        done = true
        setReady(true)
      }
    }
    const t = setTimeout(finish, MAX_WAIT_MS)
    syncPractice().finally(() => {
      clearTimeout(t)
      finish()
    })
    return () => clearTimeout(t)
  }, [])

  return ready ? <>{children}</> : null
}
