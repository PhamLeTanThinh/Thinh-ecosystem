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
  // `ko` là câu gốc (tiếng Hàn hoặc chữ Hán — tên trường giữ từ khi chỉ có Korean). `py` = pinyin của bài tiếng Trung,
  // cùng số dòng (\n) với `ko`. Từ vựng của bài bọc trong {{…}} để tô màu.
  paragraphs: { ko: string; py?: string; vi: string }[]
}

const VOCAB = /\{\{([^}]+)\}\}/g
const plain = (text: string) => text.replace(VOCAB, '$1')

// Nghĩa của 1 từ được tô — mỗi app tự tra từ danh sách từ vựng của bài (Chinese: khớp đúng chữ; Korean: khớp theo gốc
// từ vì từ trong bài đã chia đuôi). undefined = không tra được → chỉ tô màu, không có tooltip.
export interface Gloss {
  reading?: string // pinyin
  meaning: string
}
export type GlossLookup = (word: string) => Gloss | undefined

function Highlighted({ text, gloss }: { text: string; gloss?: GlossLookup }) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(VOCAB)) {
    const i = m.index ?? 0
    if (i > last) out.push(text.slice(last, i))
    const g = gloss?.(m[1])
    out.push(
      g ? (
        // Rê chuột (desktop) hoặc chạm (điện thoại — tabIndex cho nhận focus) để hiện tooltip CSS lấy từ data-gloss
        <mark key={i} className="rd-vocab rd-has-gloss" tabIndex={0} data-gloss={g.reading ? `${g.reading}\n${g.meaning}` : g.meaning}>
          {m[1]}
        </mark>
      ) : (
        <mark key={i} className="rd-vocab">
          {m[1]}
        </mark>
      ),
    )
    last = i + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

// Mục "Bài đọc" cuối bài học: 1 đoạn văn dùng lại từ vựng của bài, từ vựng tô màu, mỗi đoạn có nút đọc to. Bản dịch
// ẩn mặc định — bấm "Bấm để xem nghĩa" của từng đoạn hoặc nút "Hiện bản dịch" của cả bài (cùng cách với Hội thoại).
// Dùng chung cho Korean/Chinese: `lang` là giọng đọc, `prefix` là tiền tố class tiêu đề mục / kính mờ của từng app.
export function ReadingSection({ reading, lang, prefix, gloss }: { reading: Reading; lang: string; prefix: 'kr' | 'cn'; gloss?: GlossLookup }) {
  const [shown, setShown] = useState<Set<number>>(new Set())
  const allShown = shown.size === reading.paragraphs.length
  // Pinyin (bài tiếng Trung) ẩn mặc định giống bản dịch — tự đọc chữ Hán trước, bí thì bấm "Bấm để xem pinyin" của
  // từng đoạn, hoặc "Hiện pinyin" để mở cả bài.
  const pyIdx = reading.paragraphs.flatMap((p, i) => (p.py ? [i] : []))
  const [pyShown, setPyShown] = useState<Set<number>>(new Set())
  const allPyShown = pyIdx.length > 0 && pyIdx.every((i) => pyShown.has(i))

  const toggleIn = (set: typeof setShown) => (i: number) =>
    set((prev) => {
      const next = new Set(prev)
      if (!next.delete(i)) next.add(i)
      return next
    })
  const toggle = toggleIn(setShown)
  const togglePy = toggleIn(setPyShown)

  return (
    <LessonSection sectionKey="reading" prefix={prefix} title="📖 Bài đọc" count={reading.paragraphs.length}>
      <article id={`${prefix}-reading`} className={`${prefix}-glass rd-card`}>
        <header className="rd-head">
          <div>
            <h3 className="rd-title">{reading.title}</h3>
            {reading.titleVi && <p className="rd-title-vi">{reading.titleVi}</p>}
          </div>
          <div className="rd-toggles">
            {pyIdx.length > 0 && (
              <button type="button" className="rd-toggle-all" onClick={() => setPyShown(allPyShown ? new Set() : new Set(pyIdx))}>
                {allPyShown ? 'Ẩn pinyin' : 'Hiện pinyin'}
              </button>
            )}
            <button type="button" className="rd-toggle-all" onClick={() => setShown(allShown ? new Set() : new Set(reading.paragraphs.map((_, i) => i)))}>
              {allShown ? 'Ẩn bản dịch' : 'Hiện bản dịch'}
            </button>
          </div>
        </header>
        {reading.note && <p className="rd-note">{reading.note}</p>}

        <div className="rd-body">
          {reading.paragraphs.map((p, i) => (
            <div key={i} className="rd-para">
              <div className="rd-para-row">
                <div className="rd-text">
                  <p className="rd-ko" lang={lang}>
                    <Highlighted text={p.ko} gloss={gloss} />
                  </p>
                  {p.py && pyShown.has(i) && (
                    <button type="button" className="rd-py" onClick={() => togglePy(i)} title="Bấm để ẩn">
                      {p.py}
                    </button>
                  )}
                </div>
                <SpeakButton text={plain(p.ko)} lang={lang} className="rd-speak shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand" />
              </div>
              {shown.has(i) && (
                <button type="button" className="rd-vi" onClick={() => toggle(i)} title="Bấm để ẩn">
                  {p.vi}
                </button>
              )}
              {((p.py && !pyShown.has(i)) || !shown.has(i)) && (
                <div className="rd-reveals">
                  {p.py && !pyShown.has(i) && (
                    <button type="button" className="rd-reveal" onClick={() => togglePy(i)}>
                      Bấm để xem pinyin
                    </button>
                  )}
                  {!shown.has(i) && (
                    <button type="button" className="rd-reveal" onClick={() => toggle(i)}>
                      Bấm để xem nghĩa
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </article>
    </LessonSection>
  )
}
