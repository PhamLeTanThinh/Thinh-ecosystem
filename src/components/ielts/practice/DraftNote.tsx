'use client'

import { useEffect, useState } from 'react'
import { loadDrafts, type Draft } from '@/lib/ielts/practice'

// Ghi chú ở trang chọn chế độ khi đề đang làm dở (chỉ có ở client vì bài nháp nằm trong localStorage).
export function DraftNote({ testId }: { testId: string }) {
  const [draft, setDraft] = useState<Draft | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(loadDrafts()[testId] ?? null)
  }, [testId])

  if (!draft) return null
  const answered = Object.values(draft.answers).filter((v) => v.trim()).length
  const modeName = draft.mode === 'real' ? 'Thi thật' : 'Luyện tập'
  return (
    <p className="ih-pr-note">
      Bạn đang làm dở đề này ở chế độ <strong>{modeName}</strong> ({answered} câu đã trả lời). Chọn lại đúng chế độ đó để làm tiếp; chọn chế độ khác sẽ bắt đầu lại từ đầu.
    </p>
  )
}
