'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { SpeakButton } from '@/components/shared/SpeakButton'
import { LessonSection } from '@/components/shared/LessonSection'
import './reading.css'

export interface Reading {
  title: string
  titleVi?: string
  note?: string
  // `ko`/câu gốc: từ vựng của bài bọc trong {{…}} để tô màu; xuống dòng bằng \n
  paragraphs: { ko: string; vi: string }[]
}

const VOCAB = /\{\{([^}]+)\}\}/g
const plain = (text: string) => text.replace(VOCAB, '$1')

function Highlighted({ text }: { text: string }) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(VOCAB)) {
    const i = m.index ?? 0
    if (i > last) out.push(text.slice(last, i))
    out.push(
      <mark key={i} className="rd-vocab">
        {m[1]}
      </mark>,
    )
    last = i + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

// Mục "Bài đọc" cuối bài học: 1 đoạn văn dùng lại từ vựng của bài, từ vựng tô màu, mỗi đoạn có nút đọc to. Bản dịch
// ẩn mặc định — bấm "Bấm để xem nghĩa" của từng đoạn hoặc nút "Hiện bản dịch" của cả bài (cùng cách với Hội thoại).
// Dùng chung cho Korean/Chinese: `lang` là giọng đọc, `prefix` là tiền tố class tiêu đề mục / kính mờ của từng app.
export function ReadingSection({ reading, lang, prefix }: { reading: Reading; lang: string; prefix: 'kr' | 'cn' }) {
  const [shown, setShown] = useState<Set<number>>(new Set())
  const allShown = shown.size === reading.paragraphs.length

  function toggle(i: number) {
    setShown((prev) => {
      const next = new Set(prev)
      if (!next.delete(i)) next.add(i)
      return next
    })
  }

  return (
    <LessonSection sectionKey="reading" prefix={prefix} title="📖 Bài đọc" count={reading.paragraphs.length}>
      <article id={`${prefix}-reading`} className={`${prefix}-glass rd-card`}>
        <header className="rd-head">
          <div>
            <h3 className="rd-title">{reading.title}</h3>
            {reading.titleVi && <p className="rd-title-vi">{reading.titleVi}</p>}
          </div>
          <button type="button" className="rd-toggle-all" onClick={() => setShown(allShown ? new Set() : new Set(reading.paragraphs.map((_, i) => i)))}>
            {allShown ? 'Ẩn bản dịch' : 'Hiện bản dịch'}
          </button>
        </header>
        {reading.note && <p className="rd-note">{reading.note}</p>}

        <div className="rd-body">
          {reading.paragraphs.map((p, i) => (
            <div key={i} className="rd-para">
              <div className="rd-para-row">
                <p className="rd-ko">
                  <Highlighted text={p.ko} />
                </p>
                <SpeakButton text={plain(p.ko)} lang={lang} className="rd-speak shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
              </div>
              {shown.has(i) ? (
                <button type="button" className="rd-vi" onClick={() => toggle(i)} title="Bấm để ẩn">
                  {p.vi}
                </button>
              ) : (
                <button type="button" className="rd-reveal" onClick={() => toggle(i)}>
                  Bấm để xem nghĩa
                </button>
              )}
            </div>
          ))}
        </div>
      </article>
    </LessonSection>
  )
}
