import type { Metadata } from 'next'
import { KoreanHydrator } from '@/components/korean/KoreanHydrator'
import { AddCardModal } from '@/components/korean/modals/AddCardModal'
import './korean.css'

export const metadata: Metadata = {
  title: 'Học Từ Vựng & Ngữ Pháp Tiếng Hàn',
  description: 'Ôn từ vựng và ngữ pháp tiếng Hàn theo từng bài (Seoul Korean 2) bằng flashcard và trắc nghiệm.',
}

export default function KoreanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="korean-root min-h-dvh">
      <KoreanHydrator />
      <main className="mx-auto w-full max-w-xl px-4 py-6">{children}</main>
      <AddCardModal />
    </div>
  )
}
