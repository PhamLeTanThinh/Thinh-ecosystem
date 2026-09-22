import { Suspense } from 'react'
import { ChineseApp } from '@/components/chinese/ChineseApp'

// Bộ từ tự tạo giờ có URL riêng (/chinese/decks/<id>) — cùng cách với /chinese/lessons/<n>.
export default function Page() {
  return (
    <Suspense>
      <ChineseApp />
    </Suspense>
  )
}
