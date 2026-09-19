'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { MusicStaff } from '@/components/music/MusicStaff'
import { ACCIDENTAL_SYMBOL, SOLFEGE, answerChoicesForMode, noteLabel, randomNote, type Accidental, type AccidentalMode, type Clef, type Note, type NoteLetter } from '@/lib/music/notes'

// Nốt mở màn CỐ ĐỊNH (Đô giữa, tự nhiên) thay vì random ngay từ đầu: random bằng Math.random() lúc
// khởi tạo state sẽ chạy khác nhau giữa server và client, gây lỗi "Hydration failed". Mọi nốt SAU đó
// (bấm đổi tay, đổi chế độ dấu hoá hoặc "Nốt tiếp theo") đều random bình thường vì diễn ra trong sự
// kiện click, không phải lúc render/hydrate.
const INITIAL_NOTE: Note = { letter: 'C', octave: 4, accidental: 'natural' }

const ACCIDENTAL_MODE_OPTIONS: { value: AccidentalMode; label: string }[] = [
  { value: 'off', label: 'Không' },
  { value: 'sharp', label: 'Thăng (♯)' },
  { value: 'flat', label: 'Giáng (♭)' },
  { value: 'mixed', label: 'Gộp chung' },
]

interface Answer {
  letter: NoteLetter
  accidental: Accidental
}

function isSameAnswer(a: Answer, b: { letter: NoteLetter; accidental: Accidental }) {
  return a.letter === b.letter && a.accidental === b.accidental
}

export default function MusicLearnPage() {
  const [clef, setClef] = useState<Clef>('treble')
  const [accidentalMode, setAccidentalMode] = useState<AccidentalMode>('off')
  const [current, setCurrent] = useState<Note>(INITIAL_NOTE)
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })

  function handleHandChange(next: Clef) {
    if (next === clef) return
    setClef(next)
    setCurrent(randomNote(next, { accidentalMode }))
    setAnswer(null)
  }

  function handleModeChange(next: AccidentalMode) {
    if (next === accidentalMode) return
    setAccidentalMode(next)
    setCurrent(randomNote(clef, { accidentalMode: next }))
    setAnswer(null)
  }

  function handleAnswer(choice: Answer) {
    if (answer !== null) return
    setAnswer(choice)
    setScore((s) => (isSameAnswer(choice, current) ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 }))
  }

  function handleNext() {
    setCurrent((prev) => randomNote(clef, { exclude: prev, accidentalMode }))
    setAnswer(null)
  }

  const answerCorrect = answer !== null && isSameAnswer(answer, current)
  const tone = answer === null ? 'default' : answerCorrect ? 'correct' : 'wrong'
  const choices = answerChoicesForMode(accidentalMode)
  // Chế độ 'mixed' liệt kê đủ 3 hàng (tự nhiên/thăng/giáng) — tách riêng theo từng hàng để có nhãn
  // dẫn; các chế độ còn lại chỉ có 1 hàng duy nhất nên không cần nhãn.
  const choiceRows: { label: string | null; items: Answer[] }[] =
    accidentalMode === 'mixed'
      ? [
          { label: 'Tự nhiên', items: choices.slice(0, 7) },
          { label: 'Thăng (♯)', items: choices.slice(7, 14) },
          { label: 'Giáng (♭)', items: choices.slice(14, 21) },
        ]
      : [{ label: null, items: choices }]

  return (
    <div className="ms-content ms-learn-page">
      <AppBreadcrumb app="/music" trail={[{ label: 'Học nốt nhạc', icon: 'note' }]} />

      <div className="ms-learn-head-title">
        <span className="ms-page-icon" style={{ viewTransitionName: 'ms-level-learn' } as CSSProperties}>
          ♪
        </span>
        <div>
          <p className="ms-kicker">Học nốt nhạc</p>
          <h1 className="ms-title">Nốt này là nốt gì?</h1>
        </div>
      </div>

      <div className="ms-learn-body">
        <aside className="ms-settings" aria-label="Tuỳ chọn">
          <div className="ms-setting">
            <span className="ms-option-label">Tay chơi</span>
            <div className="ms-hand-toggle ms-hand-toggle--stack">
              <button type="button" className={clef === 'treble' ? 'active' : ''} onClick={() => handleHandChange('treble')}>
                Tay phải
              </button>
              <button type="button" className={clef === 'bass' ? 'active' : ''} onClick={() => handleHandChange('bass')}>
                Tay trái
              </button>
            </div>
          </div>

          <div className="ms-setting">
            <span className="ms-option-label">Dấu thăng / giáng</span>
            <div className="ms-hand-toggle ms-hand-toggle--stack">
              {ACCIDENTAL_MODE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" className={accidentalMode === opt.value ? 'active' : ''} onClick={() => handleModeChange(opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ms-setting">
            <span className="ms-option-label">Kết quả</span>
            <div className="ms-score-row">
              <span className="ms-score ms-score-correct">✓ {score.correct}</span>
              <span className="ms-score ms-score-wrong">✕ {score.wrong}</span>
            </div>
          </div>
        </aside>

        <section className="ms-stage">
          <div className="ms-staff-card">
            <MusicStaff clef={clef} note={current} tone={tone} />
          </div>

          <div className="ms-feedback">
            {answer !== null &&
              (answerCorrect ? (
                <p className="ms-feedback-correct">✓ Chính xác! Đây là nốt {noteLabel(current.letter, current.accidental)}.</p>
              ) : (
                <p className="ms-feedback-wrong">
                  ✕ Chưa đúng — đây là nốt {noteLabel(current.letter, current.accidental)}, không phải {noteLabel(answer.letter, answer.accidental)}.
                </p>
              ))}
          </div>

          {choiceRows.map((row) => (
            <div key={row.label ?? 'single'} className="ms-answer-section">
              {row.label && <p className="ms-answer-row-label">{row.label}</p>}
              <div className="ms-answer-grid">
                {row.items.map((choice) => {
                  // Nút vừa bấm tô theo đúng/sai; nếu bấm sai, tô thêm nút đáp án đúng màu xanh để lộ ra.
                  let state = ''
                  if (answer !== null) {
                    if (isSameAnswer(answer, choice)) state = answerCorrect ? ' correct' : ' wrong'
                    else if (isSameAnswer(current, choice)) state = ' correct'
                  }
                  return (
                    <button
                      key={`${choice.letter}-${choice.accidental}`}
                      type="button"
                      className={`ms-answer-btn${state}`}
                      disabled={answer !== null}
                      onClick={() => handleAnswer(choice)}
                    >
                      <span className="ms-answer-letter">
                        {choice.letter}
                        {ACCIDENTAL_SYMBOL[choice.accidental]}
                      </span>
                      <span className="ms-answer-solfege">{SOLFEGE[choice.letter]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <button type="button" className="ms-next-btn" onClick={handleNext} disabled={answer === null}>
            Nốt tiếp theo →
          </button>
        </section>
      </div>
    </div>
  )
}
