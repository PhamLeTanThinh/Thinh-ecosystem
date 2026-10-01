import { Suspense } from 'react'
import { KoreanApp } from '@/components/korean/KoreanApp'

// Bài bảng chữ cái /korean/hangul/<n> (0 = Tổng quan, 1–3 = 한글 1–3) (KoreanApp nhận ra route này qua pathname).
export default function Page() {
  return (
    <Suspense>
      <KoreanApp />
    </Suspense>
  )
}
