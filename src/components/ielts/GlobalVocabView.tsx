'use client'

import { useRouter } from 'next/navigation'
import { beginIeltsNavigation } from '@/lib/ielts/navigationLoading'
import { useIeltsStore } from '@/lib/ielts/store'
import { VocabView } from './VocabView'

// Kho từ vựng chung (không thuộc kỹ năng nào) tại /ielts/vocab. Từ có liên kết trang thì nhảy tới bài
// học của đúng kỹ năng chứa trang đó.
export function GlobalVocabView() {
  const router = useRouter()
  return (
    <VocabView
      onNavigateToPage={(id) => {
        const page = useIeltsStore.getState().pages.find((p) => p.id === id)
        if (page) {
          const destination = `/ielts/${page.skill}/lessons/${page.id}`
          beginIeltsNavigation(destination)
          router.push(destination)
        }
      }}
    />
  )
}
