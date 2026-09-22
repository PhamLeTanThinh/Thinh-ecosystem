import { Suspense } from 'react'
import { ChineseApp } from '@/components/chinese/ChineseApp'

// Bài ngữ âm cơ bản giờ có URL riêng (/chinese/phonetics/<n>) — cùng cách với /chinese/lessons/<n>.
export default function Page() {
  return (
    <Suspense>
      <ChineseApp />
    </Suspense>
  )
}
