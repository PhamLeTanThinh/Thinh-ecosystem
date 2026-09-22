import { Suspense } from 'react'
import { ChineseApp } from '@/components/chinese/ChineseApp'

// Trang danh sách kiến thức của cấp HSK đang chọn; bài cụ thể vẫn nằm tại lessons/[lesson].
export default function Page() {
  return (
    <Suspense>
      <ChineseApp />
    </Suspense>
  )
}
