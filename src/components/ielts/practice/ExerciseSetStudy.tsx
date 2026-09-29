'use client'

import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { loadExerciseProgress, saveExerciseProgress, type ExerciseQuestion, type ExerciseWord, type SentenceBuildingSet } from '@/lib/ielts/practice'
import { skillLabel } from '@/lib/ielts/skills'
import { speak } from '@/lib/shared/speech'

// So khớp đáp án: nối value các thẻ đã chọn bằng dấu cách rồi so với từng chuỗi trong correctAnswers,
// không phân biệt hoa/thường, bỏ khoảng trắng thừa đầu/cuối và dấu câu cuối câu (nguồn hay có/thiếu tuỳ ý).
function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?]+$/, '')
}

function isAnswerCorrect(built: string, correctAnswers: string[]): boolean {
  const n = normalize(built)
  return n.length > 0 && correctAnswers.some((a) => normalize(a) === n)
}

// Trộn 1 lần cho mỗi câu (giữ nguyên trong suốt vòng đời component nhờ useMemo khoá theo id câu) — không
// trộn lại giữa các lần render để bấm chọn/bỏ chọn thẻ không làm thẻ nhảy vị trí.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Giải thích: cùng cú pháp **đậm** / *nghiêng* / {ok} ✓ xanh với Explanation.notes ở Reading (xem
// AnswerReview.tsx's inline()) — viết lại cục bộ ở đây vì 2 màn không dùng chung 1 rich-text component.
// Thêm 1 quy ước riêng cho màn này: 1 dòng chỉ có "---" = đường kẻ ngăn (dùng để tách phần "Cách tra"
// khỏi phần giải thích 2 lựa chọn phía trên).
export function renderExplanation(text: string): ReactNode {
  return text.split('\n').map((line, i) => {
    if (line === '---') return <hr key={i} className="ih-sb-exp-divider" />
    return (
      <p key={i} className="ih-sb-exp-line">
        {line.split(/(\*\*[\s\S]+?\*\*|\*[\s\S]+?\*|\{ok\}|\{no\})/g).map((part, j) => {
          if (part.startsWith('**')) return <strong key={j}>{part.slice(2, -2)}</strong>
          if (part.startsWith('*')) return <em key={j}>{part.slice(1, -1)}</em>
          if (part === '{ok}') return (
            <span key={j} className="ih-rv-mark ok" aria-hidden>
              ✓
            </span>
          )
          if (part === '{no}') return (
            <span key={j} className="ih-rv-mark no" aria-hidden>
              ✕
            </span>
          )
          return <Fragment key={j}>{part}</Fragment>
        })}
      </p>
    )
  })
}

// Làm 1 bộ Bài tập ghép câu (/ielts/<skill>/exercise/<id>): mỗi câu hiện 1 câu tiếng Việt + các thẻ từ đã
// trộn (gồm cả thẻ nhiễu) — bấm thẻ theo đúng thứ tự để ghép câu tiếng Anh, "Kiểm tra" để chấm, làm đúng mới
// tính là đã qua câu đó (lưu vào tiến độ), sai thì được sửa lại rồi kiểm tra tiếp, không tự chuyển câu.
export function ExerciseSetStudy({ set }: { set: SentenceBuildingSet }) {
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const [cur, setCur] = useState(0)
  const [selected, setSelected] = useState<string[]>([]) // danh sách key đã bấm, theo đúng thứ tự
  const [checked, setChecked] = useState<'idle' | 'correct' | 'incorrect'>('idle')
  const [showHint, setShowHint] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSolved(new Set(loadExerciseProgress()[set.id] ?? []))
  }, [set.id])

  const total = set.questions.length
  const q: ExerciseQuestion | undefined = set.questions[cur]
  const pool = useMemo(() => (q ? shuffle(q.words) : []), [q])
  const byKey = useMemo(() => new Map(pool.map((w) => [w.key, w] as const)), [pool])
  const usedKeys = new Set(selected)

  function resetQuestionState() {
    setSelected([])
    setChecked('idle')
    setShowHint(false)
    setShowExplanation(false)
  }

  function goTo(idx: number) {
    setCur(idx)
    resetQuestionState()
  }

  function tapPool(w: ExerciseWord) {
    if (checked === 'correct') return
    setSelected((prev) => [...prev, w.key])
  }

  function tapSelected(key: string) {
    if (checked === 'correct') return
    setSelected((prev) => prev.filter((k) => k !== key))
  }

  function check() {
    if (!q) return
    const built = selected.map((k) => byKey.get(k)?.value ?? '').join(' ')
    const ok = isAnswerCorrect(built, q.correctAnswers)
    setChecked(ok ? 'correct' : 'incorrect')
    if (ok) {
      const next = new Set(solved)
      next.add(q.id)
      setSolved(next)
      saveExerciseProgress(set.id, [...next])
    }
  }

  if (!q) {
    return (
      <div className="ih-pr">
        <Link href={`/ielts/${set.skill}/exercise`} className="ih-pr-back">
          ← Danh sách Bài tập
        </Link>
        <p className="ih-pr-empty">Bài này chưa có câu nào.</p>
      </div>
    )
  }

  const solvedCount = Math.min(solved.size, total)

  return (
    <div className="ih-pr ih-sb">
      <Link href={`/ielts/${set.skill}/exercise`} className="ih-pr-back">
        ← Danh sách Bài tập
      </Link>
      <p className="ih-pr-dialog-cap">
        {skillLabel(set.skill)} - Bài tập · {set.part}
      </p>
      <h1 className="ih-font-hand ih-pr-dialog-title">{set.title}</h1>

      <div className="ih-pr-filters">
        <span className="ih-pr-chip ih-pr-chip-score">
          Đã đúng {solvedCount}/{total} câu
        </span>
        <span className="ih-sb-qnav">
          {set.questions.map((qq, i) => (
            <button
              key={qq.id}
              type="button"
              className={`ih-sb-dot${i === cur ? ' active' : ''}${solved.has(qq.id) ? ' solved' : ''}`}
              aria-label={`Câu ${i + 1}${solved.has(qq.id) ? ', đã đúng' : ''}`}
              aria-current={i === cur ? 'step' : undefined}
              onClick={() => goTo(i)}
            >
              {i + 1}
            </button>
          ))}
        </span>
      </div>

      <div className="ih-sb-card">
        <div className="ih-sb-topbar">
          {set.instruction && <h2 className="ih-sb-instruction">{set.instruction}</h2>}
          {q.hint && (
            <button type="button" className="ih-sb-hint-btn" aria-label="Xem gợi ý" aria-pressed={showHint} onClick={() => setShowHint((v) => !v)}>
              💡
            </button>
          )}
        </div>
        {showHint && q.hint && <p className="ih-sb-hint">💡 {q.hint}</p>}

        <div className="ih-sb-qrow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ielts/images/cat.png" alt="" className="ih-sb-mascot" />
          <p className="ih-sb-sentence">{q.sentenceVi}</p>
        </div>

        <hr className="ih-sb-divider" />

        <div className={`ih-sb-answer${checked === 'correct' ? ' correct' : checked === 'incorrect' ? ' incorrect' : ''}`}>
          {selected.length === 0 && <span className="ih-sb-answer-placeholder">Bấm các thẻ bên dưới theo đúng thứ tự…</span>}
          {selected.map((key, i) => {
            const w = byKey.get(key)
            if (!w) return null
            return (
              <button key={`${key}-${i}`} type="button" className="ih-sb-tag ih-sb-tag-picked" onClick={() => tapSelected(key)} disabled={checked === 'correct'}>
                {w.value}
              </button>
            )
          })}
        </div>

        <hr className="ih-sb-divider" />

        <div className="ih-sb-pool">
          {pool
            .filter((w) => !usedKeys.has(w.key))
            .map((w) => (
              <button key={w.key} type="button" className="ih-sb-tag" onClick={() => tapPool(w)} disabled={checked === 'correct'}>
                {w.value}
              </button>
            ))}
        </div>

        <div className="ih-pr-filters ih-sb-actions">
          <button type="button" className="ih-btn-outline" onClick={() => speak(selected.map((k) => byKey.get(k)?.value ?? '').join(' '), 'en-US')} disabled={selected.length === 0}>
            🔊 Đọc câu đã ghép
          </button>
          {checked === 'idle' && (
            <button type="button" className="ih-btn-solid ih-pr-push" onClick={check} disabled={selected.length === 0}>
              Kiểm tra
            </button>
          )}
          {checked === 'correct' && cur < total - 1 && (
            <button type="button" className="ih-btn-solid ih-pr-push" onClick={() => goTo(cur + 1)}>
              Câu tiếp →
            </button>
          )}
          {checked === 'incorrect' && (
            <button
              type="button"
              className="ih-btn-solid ih-pr-push"
              onClick={() => {
                setSelected([])
                setChecked('idle')
              }}
            >
              ↺ Làm lại
            </button>
          )}
        </div>

        {checked !== 'idle' && (
          <div className={`ih-sb-result${checked === 'correct' ? ' correct' : ' incorrect'}`}>
            <p className="ih-sb-result-title">{checked === 'correct' ? 'Chính xác!' : 'Chưa đúng — anh chị xem giải thích rồi thử lại nhé'}</p>
            {checked === 'incorrect' && (
              <p className="ih-sb-result-answer">
                Đáp án đúng: <strong>{q.correctAnswers[0]}</strong>
                {q.correctAnswers.length > 1 && <span className="ih-sb-result-alt"> (hoặc: {q.correctAnswers.slice(1).join(' / ')})</span>}
              </p>
            )}
            {q.explanation && (
              <button type="button" className="ih-vocab-expand" onClick={() => setShowExplanation((v) => !v)}>
                {showExplanation ? 'Ẩn giải thích ▴' : 'Xem giải thích ▾'}
              </button>
            )}
            {showExplanation && q.explanation && <div className="ih-sb-explanation">{renderExplanation(q.explanation)}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
