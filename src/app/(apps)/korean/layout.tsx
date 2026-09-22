import type { Metadata } from 'next'
import { KoreanHydrator } from '@/components/korean/KoreanHydrator'
import { KoreanLoading } from '@/components/korean/KoreanLoading'
import { AddCardModal } from '@/components/korean/modals/AddCardModal'
import { LearnerGate } from '@/components/learner/LearnerProfile'
import { bodyFont } from '../ielts/fonts'
import './korean.css'

export const metadata: Metadata = {
  title: 'Korean Hub',
  description: 'Ôn từ vựng và ngữ pháp tiếng Hàn theo từng bài (Seoul Korean 2) bằng flashcard và trắc nghiệm.',
}

export default function KoreanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bodyFont.variable} korean-root min-h-dvh`}>
      <KoreanHydrator />
      <KoreanLoading />
      {children}
      <AddCardModal />
      <LearnerGate />
    </div>
  )
}
