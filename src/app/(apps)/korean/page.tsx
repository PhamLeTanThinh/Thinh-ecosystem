import { Suspense } from 'react'
import { KoreanApp } from '@/components/korean/KoreanApp'

// Màn hình chọn cấp độ TOPIK (/korean) — mọi bài giờ có route riêng dưới đây (vocab, lessons/[lesson]);
// KoreanApp tự đọc URL hiện tại (usePathname/useParams) để biết đang ở màn nào, nên page.tsx chỉ cần
// render nó ở mọi route con.
export default function Page() {
  return (
    <Suspense>
      <KoreanApp />
    </Suspense>
  )
}
