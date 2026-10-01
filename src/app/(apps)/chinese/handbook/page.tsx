import { Suspense } from 'react'
import { ChineseApp } from '@/components/chinese/ChineseApp'

// Cẩm nang ngữ pháp — ngữ pháp HSK gom theo nghĩa (ChineseApp nhận ra route này qua pathname).
export default function Page() {
  return (
    <Suspense>
      <ChineseApp />
    </Suspense>
  )
}
