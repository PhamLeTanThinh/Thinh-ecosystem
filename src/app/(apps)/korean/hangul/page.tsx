import { Suspense } from 'react'
import { KoreanApp } from '@/components/korean/KoreanApp'

// Bảng chữ cái — 4 bài vỡ lòng 한글 배우기 (sách 1A) (KoreanApp nhận ra route này qua pathname).
export default function Page() {
  return (
    <Suspense>
      <KoreanApp />
    </Suspense>
  )
}
