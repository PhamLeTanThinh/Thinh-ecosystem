'use client'

import { useState } from 'react'
import Link from 'next/link'
import { REVIEW_QUESTIONS, SELF_CHECK } from '@/data/ielts/grammar/handbook'
import { getGrammarLesson } from '@/lib/ielts/grammar'

// Chuẩn hoá để so khớp đáp án gõ tay: chữ thường, dấu nháy cong → thẳng, bỏ "/", ",", "…" ngăn cách nhiều chỗ trống.
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[\/,….]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// 50 câu ôn tập: gõ đáp án vào từng ô, bấm Chấm điểm → hiện đúng/sai, đáp án, giải thích và link bài cần ôn.
export function ReviewQuiz() {
  const [values, setValues] = useState<string[]>(() => REVIEW_QUESTIONS.map(() => ''))
  const [checked, setChecked] = useState(false)

  const correct = REVIEW_QUESTIONS.map((q, i) => q.answers.some((a) => norm(a) === norm(values[i])))
  const score = correct.filter(Boolean).length
  const band = SELF_CHECK.find((b) => score >= b.min)!

  return (
    <div className="ih-gr-quiz">
      <ol className="ih-gr-quiz-list">
        {REVIEW_QUESTIONS.map((q, i) => {
          const lesson = getGrammarLesson(q.lesson)
          const state = checked ? (correct[i] ? 'ok' : 'bad') : ''
          return (
            <li key={i} className={`ih-glass ih-gr-q ${state && `is-${state}`}`}>
              <span className="ih-gr-q-no">{i + 1}</span>
              <div className="ih-gr-q-body">
                <p className="ih-gr-q-text">{q.q}</p>
                <input
                  className="ih-gr-q-input"
                  value={values[i]}
                  placeholder="Đáp án…"
                  aria-label={`Đáp án câu ${i + 1}`}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(e) => {
                    const next = [...values]
                    next[i] = e.target.value
                    setValues(next)
                  }}
                />
                {checked && (
                  <div className="ih-gr-q-result">
                    <span className="ih-gr-q-mark">{correct[i] ? '✓ Đúng' : `✗ Đáp án: ${q.display}`}</span>
                    <span className="ih-gr-q-why">{q.why}</span>
                    {!correct[i] && lesson && (
                      <Link href={`/ielts/grammar/${lesson.id}`} className="ih-gr-lesson-link">
                        Ôn lại Bài {lesson.no}: {lesson.vi}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="ih-glass ih-gr-quiz-bar">
        {checked ? (
          <>
            <div className="ih-gr-score">
              <b>
                {score}/{REVIEW_QUESTIONS.length}
              </b>{' '}
              — {band.label}
              <p className="ih-gr-muted">{band.advice}</p>
            </div>
            <button
              type="button"
              className="ih-btn-outline"
              onClick={() => {
                setValues(REVIEW_QUESTIONS.map(() => ''))
                setChecked(false)
              }}
            >
              Làm lại
            </button>
          </>
        ) : (
          <>
            <span className="ih-gr-muted">Đã điền {values.filter((v) => v.trim()).length}/{REVIEW_QUESTIONS.length} câu</span>
            <button type="button" className="ih-gr-btn" onClick={() => setChecked(true)}>
              Chấm điểm
            </button>
          </>
        )}
      </div>
    </div>
  )
}
