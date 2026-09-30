import { Suspense } from 'react'
import { KoreanApp } from '@/components/korean/KoreanApp'

// Cẩm nang ngữ pháp — ngữ pháp TOPIK I + II gom theo nghĩa (KoreanApp nhận ra route này qua pathname).
export default function Page() {
  return (
    <Suspense>
      <KoreanApp />
    </Suspense>
  )
}
