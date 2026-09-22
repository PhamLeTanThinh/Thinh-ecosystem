import { Suspense } from 'react'
import { ChineseApp } from '@/components/chinese/ChineseApp'

// Màn hình chọn cấp độ HSK (/chinese) — mọi bài/bộ từ/ngữ âm giờ có route riêng dưới đây
// (vocab, lessons/[lesson], phonetics/[lesson], decks/[deckId]); ChineseApp tự đọc URL hiện tại
// (usePathname/useParams) để biết đang ở màn nào, nên page.tsx chỉ cần render nó ở mọi route con.
export default function Page() {
  return (
    <Suspense>
      <ChineseApp />
    </Suspense>
  )
}
