'use client'

import { useEffect, useState } from 'react'

interface QA {
  q: string
  a: string
}
interface Topic {
  name: string
  questions: QA[]
}
interface BankData {
  topics: Topic[]
}

interface Props {
  title: string
  data: string
  onClose: () => void
}

function decodeData(b64: string): BankData | null {
  if (!b64) return null
  try {
    const json = decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

// Popup toàn màn hình cho ngân hàng câu hỏi — mỗi câu tự ẩn/hiện câu trả lời mẫu độc lập (cùng kiểu
// tương tác "bấm cả khung" như AnswerBlock trong bài, nhưng đây là state React thường vì nội dung
// nằm ngoài schema TipTap, không cần lưu lại được trạng thái mở/đóng).
export function QuestionBankModal({ title, data, onClose }: Props) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const parsed = decodeData(data)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  function toggle(key: number) {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (!parsed) return null

  let counter = 0

  return (
    <div className="ih-bank-overlay" onClick={onClose}>
      <div className="ih-bank-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ih-bank-header">
          <h2 className="ih-font-hand">{title}</h2>
          <button type="button" className="ih-bank-close" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </div>
        <div className="ih-bank-body">
          {parsed.topics.map((topic) => (
            <div key={topic.name} className="ih-bank-topic">
              <h3>{topic.name}</h3>
              {topic.questions.map((qa) => {
                counter += 1
                const key = counter
                const open = revealed.has(key)
                return (
                  <div key={key} className="ih-bank-qa">
                    <p className="ih-bank-question">
                      <strong>{key}.</strong> {qa.q}
                    </p>
                    <div
                      className={`ih-bank-answer${open ? ' open' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(key)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(key))}
                    >
                      {open ? qa.a : 'Bấm để xem câu trả lời mẫu'}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
