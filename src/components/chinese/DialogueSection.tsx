'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Dialogue } from '@/lib/chinese/dialogues'
import { SpeakButton } from '@/components/shared/SpeakButton'

const MARK = /\[(\d):([^\]]+)\]/g

// Câu thoại gốc chứa mã đánh dấu ngữ pháp [n:chữ] (xem Marked bên dưới) — bóc mã, chỉ giữ lại chữ Hán
// thật để đọc, nếu không giọng đọc sẽ phát ra luôn cả chuỗi "[1:...]" vô nghĩa.
function stripMarks(text: string): string {
  return text.replace(MARK, '$2')
}

// Chuỗi có thể chứa [n:chữ] — từ thuộc điểm ngữ pháp thứ n của hội thoại — thì tô màu theo n (xem .cn-hl-n).
function Marked({ text }: { text: string }) {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(MARK)) {
    const i = m.index ?? 0
    if (i > last) out.push(text.slice(last, i))
    out.push(
      <mark key={i} className={`cn-hl cn-hl-${m[1]}`}>
        {m[2]}
      </mark>,
    )
    last = i + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return <>{out}</>
}

// Mục "Nói như người bản xứ" của 1 bài: các hội thoại theo giáo trình, từ thuộc ngữ pháp được tô màu như trong
// sách. Pinyin và nghĩa tiếng Việt ẩn mặc định — bấm "Bấm để xem …" của từng câu (hoặc nút "Hiện …" của cả hội thoại)
// để hiện, bấm lại để ẩn; cùng cách hoạt động với khối đáp án bên IELTS.
export function DialogueSection({ dialogues }: { dialogues: Dialogue[] }) {
  return (
    <>
      <p className="cn-section-title" id="cn-section-dialogue">
        🗣️ Nói như người bản xứ <span className="cn-section-count">({dialogues.length})</span>
      </p>
      <div className="cn-dlg-list">
        {dialogues.map((d, i) => (
          <DialogueCard key={i} dialogue={d} />
        ))}
      </div>
    </>
  )
}

type Kind = 'py' | 'vi'

const KIND_LABEL: Record<Kind, string> = { py: 'pinyin', vi: 'nghĩa' }

function DialogueCard({ dialogue }: { dialogue: Dialogue }) {
  // Pinyin và nghĩa tiếng Việt đều ẩn mặc định để tự đọc chữ Hán / tự đoán nghĩa trước; mỗi loại có trạng thái riêng:
  // bật cho cả hội thoại (nút ở đầu thẻ) hoặc từng câu (bấm vào nút nhỏ / bấm lại vào chữ đang hiện để ẩn).
  const [all, setAll] = useState<Record<Kind, boolean>>({ py: false, vi: false })
  const [shown, setShown] = useState<Record<Kind, Set<number>>>({ py: new Set(), vi: new Set() })
  const bilingual = dialogue.variant === 'bilingual'
  const has: Record<Kind, boolean> = { py: dialogue.lines.some((l) => l.py), vi: dialogue.lines.some((l) => l.vi) }
  const kinds = (['py', 'vi'] as Kind[]).filter((k) => has[k])

  function toggleAll(k: Kind) {
    setAll((prev) => ({ ...prev, [k]: !prev[k] }))
    setShown((prev) => ({ ...prev, [k]: new Set() }))
  }

  function toggleLine(k: Kind, i: number) {
    setShown((prev) => {
      const next = new Set(prev[k])
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return { ...prev, [k]: next }
    })
  }

  function isVisible(k: Kind, i: number) {
    return all[k] || shown[k].has(i)
  }

  return (
    <div className="cn-glass cn-dlg-card">
      {(dialogue.title || kinds.length > 0) && (
        <div className="cn-dlg-head">
          {dialogue.title && <span className="cn-dlg-title">{dialogue.title}</span>}
          <div className="cn-dlg-toggles">
            {kinds.map((k) => (
              <button key={k} type="button" className="cn-dlg-toggle" onClick={() => toggleAll(k)} aria-pressed={all[k]}>
                {all[k] ? '🙈 Ẩn' : '👁️ Hiện'} {KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="cn-dlg-lines">
        {dialogue.lines.map((line, i) => {
          const hidden = kinds.filter((k) => line[k] && !isVisible(k, i))
          return (
            <div key={i} className="cn-dlg-line">
              {line.who && <span className={`cn-dlg-who cn-dlg-who-${line.who.toLowerCase()}`}>{line.who}</span>}
              <div className="cn-dlg-body">
                <div className="flex items-center gap-1.5">
                  <p className={`cn-dlg-zh${bilingual ? ' cn-dlg-zh-mixed' : ''}`}>
                    <Marked text={line.zh} />
                  </p>
                  <SpeakButton
                    text={stripMarks(line.zh)}
                    lang="zh-CN"
                    className="shrink-0 rounded-full p-1 text-muted hover:bg-brand-soft hover:text-brand"
                  />
                </div>

                {hidden.length > 0 && (
                  <div className="cn-dlg-hides">
                    {hidden.map((k) => (
                      <button key={k} type="button" className="cn-dlg-py-hidden" onClick={() => toggleLine(k, i)}>
                        Bấm để xem {KIND_LABEL[k]}
                      </button>
                    ))}
                  </div>
                )}

                {kinds.map((k) => {
                  const text = line[k]
                  if (!text || !isVisible(k, i)) return null
                  return (
                    <p
                      key={k}
                      className={k === 'py' ? 'cn-dlg-py' : 'cn-dlg-vi'}
                      onClick={(e) => {
                        // Vừa bôi đen chữ TRONG dòng này (để copy) thì không đóng lại; bôi đen ở chỗ khác không ảnh hưởng.
                        const sel = window.getSelection()
                        if (sel && !sel.isCollapsed && e.currentTarget.contains(sel.anchorNode)) return
                        if (!all[k]) toggleLine(k, i)
                      }}
                    >
                      <Marked text={text} />
                    </p>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {dialogue.legend && dialogue.legend.length > 0 && (
        <div className="cn-dlg-legend" aria-label="Ngữ pháp được tô màu">
          {dialogue.legend.map((g) => (
            <span key={g.n} className={`cn-dlg-chip cn-hl cn-hl-${g.n}`}>
              <b>{g.n}</b> {g.label} <span className="cn-dlg-chip-np">{g.np}</span>
            </span>
          ))}
        </div>
      )}

      {dialogue.note && (
        <div className="cn-dlg-note">
          <p className="cn-dlg-note-title">{dialogue.note.title}</p>
          <p className="cn-dlg-note-text">{dialogue.note.text}</p>
        </div>
      )}
    </div>
  )
}
