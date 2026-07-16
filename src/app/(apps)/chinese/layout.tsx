import type { Metadata } from 'next'
import { ChineseHydrator } from '@/components/chinese/ChineseHydrator'
import { AddCardModal } from '@/components/chinese/modals/AddCardModal'
import './chinese.css'

export const metadata: Metadata = {
  title: 'Học Từ Vựng Tiếng Trung',
  description: 'Ôn từ vựng tiếng Trung bằng flashcard, pinyin có thể hiện cùng mặt Hán tự hoặc mặt tiếng Việt.',
}

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="chinese-root min-h-dvh">
      <ChineseHydrator />
      <main className="mx-auto w-full max-w-xl px-4 py-6">{children}</main>
      <AddCardModal />
    </div>
  )
}
