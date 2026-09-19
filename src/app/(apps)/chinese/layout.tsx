import type { Metadata } from 'next'
import { ChineseHydrator } from '@/components/chinese/ChineseHydrator'
import { ChineseLoading } from '@/components/chinese/ChineseLoading'
import { AddCardModal } from '@/components/chinese/modals/AddCardModal'
import { LearnerGate } from '@/components/learner/LearnerProfile'
import './chinese.css'

export const metadata: Metadata = {
  title: 'Chinese Hub',
  description: 'Ôn từ vựng tiếng Trung bằng flashcard, pinyin có thể hiện cùng mặt Hán tự hoặc mặt tiếng Việt.',
}

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="chinese-root min-h-dvh">
      <ChineseHydrator />
      <ChineseLoading />
      {children}
      <AddCardModal />
      <LearnerGate />
    </div>
  )
}
