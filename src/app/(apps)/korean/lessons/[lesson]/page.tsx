import { Suspense } from 'react'
import { KoreanApp } from '@/components/korean/KoreanApp'

// Mỗi bài học TOPIK giờ có URL riêng (/korean/lessons/<n>) thay vì chỉ đổi state trong trang — KoreanApp
// tự đọc số bài từ URL (useParams), route này chỉ cần render nó.
export default function Page() {
  return (
    <Suspense>
      <KoreanApp />
    </Suspense>
  )
}
