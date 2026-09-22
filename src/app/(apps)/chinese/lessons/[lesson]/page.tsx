import { Suspense } from 'react'
import { ChineseApp } from '@/components/chinese/ChineseApp'

// Mỗi bài học HSK giờ có URL riêng (/chinese/lessons/<n>) thay vì chỉ đổi state trong trang — ChineseApp
// tự đọc số bài từ URL (useParams), route này chỉ cần render nó.
export default function Page() {
  return (
    <Suspense>
      <ChineseApp />
    </Suspense>
  )
}
