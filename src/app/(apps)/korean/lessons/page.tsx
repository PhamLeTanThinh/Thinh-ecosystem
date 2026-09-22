import { Suspense } from 'react'
import { KoreanApp } from '@/components/korean/KoreanApp'

// Trang danh sách kiến thức của cấp TOPIK đang chọn; bài cụ thể vẫn nằm tại lessons/[lesson].
export default function Page() {
  return (
    <Suspense>
      <KoreanApp />
    </Suspense>
  )
}
