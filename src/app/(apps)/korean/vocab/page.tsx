import { Suspense } from 'react'
import { KoreanApp } from '@/components/korean/KoreanApp'

// Tổng quan "Tất cả bài học" — trước đây chỉ là 1 state trong trang, giờ có URL riêng để chia sẻ/back-forward.
export default function Page() {
  return (
    <Suspense>
      <KoreanApp />
    </Suspense>
  )
}
