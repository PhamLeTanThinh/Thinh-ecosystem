import { Suspense } from 'react'
import { ChineseApp } from '@/components/chinese/ChineseApp'

// Tổng quan "Tất cả từ vựng" — trước đây chỉ là 1 state trong trang, giờ có URL riêng để chia sẻ/back-forward.
export default function Page() {
  return (
    <Suspense>
      <ChineseApp />
    </Suspense>
  )
}
