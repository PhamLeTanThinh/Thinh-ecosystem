'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { loadExerciseProgress, saveExerciseProgress, type MatchingRound, type MatchingSet } from '@/lib/ielts/practice'
import { skillLabel } from '@/lib/ielts/skills'
import { speak } from '@/lib/shared/speech'

// Trộn 1 lần cho mỗi vòng (giữ nguyên nhờ useMemo khoá theo id vòng) — không trộn lại giữa các lần render
// để các thẻ trên đầu không nhảy vị trí khi chọn.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Làm 1 bộ Bài tập nối nghĩa (/ielts/<skill>/exercise/<id>): trên đầu là các thẻ collocation tiếng Anh cho
// sẵn (gồm cả vài thẻ nhiễu), dưới là 4 dòng nghĩa tiếng Việt — mỗi dòng có 1 ô "Chọn đáp án" dạng dropdown
// (cùng kiểu với dạng câu hỏi "bank" ở màn làm đề Reading, xem BankGroup trong TestRunner.tsx). Bấm 1 thẻ
// trên đầu HOẶC 1 mục trong dropdown để gán cho dòng đang mở (hoặc dòng trống đầu tiên nếu chưa mở dòng
// nào) — 1 thẻ chỉ gán được cho 1 dòng, gán dòng khác thì tự gỡ khỏi dòng cũ. "Kiểm tra" khi đã gán đủ 4
// dòng — đúng hết mới tính qua vòng (lưu tiến độ), sai thì làm lại. Sau khi kiểm tra, có thể xem lại
// collocation + nghĩa + câu ví dụ thật (recap).
export function MatchingSetStudy({ set }: { set: MatchingSet }) {
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const [cur, setCur] = useState(0)
  const [pairs, setPairs] = useState<Record<string, string>>({}) // promptKey -> optionKey
  const [openPrompt, setOpenPrompt] = useState<string | null>(null)
  const [checked, setChecked] = useState<'idle' | 'correct' | 'incorrect'>('idle')
  const [showRecap, setShowRecap] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSolved(new Set(loadExerciseProgress()[set.id] ?? []))
  }, [set.id])

  const total = set.rounds.length
  const round: MatchingRound | undefined = set.rounds[cur]
  const options = useMemo(() => (round ? shuffle(round.options) : []), [round])

  function resetRoundState() {
    setPairs({})
    setOpenPrompt(null)
    setChecked('idle')
    setShowRecap(false)
  }

  function goTo(idx: number) {
    setCur(idx)
    resetRoundState()
  }

  function toggleOpen(promptKey: string) {
    if (checked === 'correct' || !round) return
    setOpenPrompt((cur) => (cur === promptKey ? null : promptKey))
  }

  function assign(optionKey: string) {
    if (checked === 'correct' || !round) return
    const target = openPrompt ?? round.prompts.find((p) => !pairs[p.key])?.key
    if (!target) return
    setPairs((prev) => {
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(prev)) if (v !== optionKey) next[k] = v // gỡ khỏi dòng cũ nếu thẻ này đã gán chỗ khác
      next[target] = optionKey
      return next
    })
    setOpenPrompt(null)
  }

  function clear(promptKey: string) {
    if (checked === 'correct') return
    setPairs((prev) => {
      const next = { ...prev }
      delete next[promptKey]
      return next
    })
  }

  function check() {
    if (!round) return
    const ok = round.prompts.every((p) => pairs[p.key] === round.correctMap[p.key])
    setChecked(ok ? 'correct' : 'incorrect')
    if (ok) {
      const next = new Set(solved)
      next.add(round.id)
      setSolved(next)
      saveExerciseProgress(set.id, [...next])
    }
  }

  if (!round) {
    return (
      <div className="ih-pr">
        <Link href={`/ielts/${set.skill}/exercise`} className="ih-pr-back">
          ← Danh sách Bài tập
        </Link>
        <p className="ih-pr-empty">Bài này chưa có vòng nào.</p>
      </div>
    )
  }

  const solvedCount = Math.min(solved.size, total)
  const usedOptionKeys = new Set(Object.values(pairs))

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
          Đã đúng {solvedCount}/{total} vòng
        </span>
        <span className="ih-sb-qnav">
          {set.rounds.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className={`ih-sb-dot${i === cur ? ' active' : ''}${solved.has(r.id) ? ' solved' : ''}`}
              aria-label={`Vòng ${i + 1}${solved.has(r.id) ? ', đã đúng' : ''}`}
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
          <h2 className="ih-sb-instruction">{round.instruction}</h2>
        </div>

        <div className="ih-sb-pool">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              className={`ih-sb-tag${usedOptionKeys.has(o.key) ? ' used' : ''}`}
              onClick={() => assign(o.key)}
              disabled={checked === 'correct'}
            >
              {o.value}
            </button>
          ))}
        </div>

        <div className="ih-match-rows">
          {round.prompts.map((p) => {
            const pairedKey = pairs[p.key]
            const pairedOption = pairedKey ? options.find((o) => o.key === pairedKey) : undefined
            const isCorrect = checked !== 'idle' && pairedKey === round.correctMap[p.key]
            const isWrong = checked === 'incorrect' && pairedKey && pairedKey !== round.correctMap[p.key]
            const open = openPrompt === p.key
            return (
              <div key={p.key} className={`ih-match-row2${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}`}>
                <span className="ih-match-row2-vi">{p.value}</span>
                <span className="ih-match-row2-line" aria-hidden />
                <span className="ih-bank-target-wrap">
                  {pairedOption ? (
                    <button
                      type="button"
                      className={`ih-bank-target filled${isCorrect ? ' ih-match-ok' : ''}${isWrong ? ' ih-match-bad' : ''}`}
                      disabled={checked === 'correct'}
                      onClick={() => (checked === 'idle' ? clear(p.key) : toggleOpen(p.key))}
                    >
                      {pairedOption.value}
                      <span className="ih-bank-target-caret" aria-hidden>
                        ▾
                      </span>
                    </button>
                  ) : (
                    <button type="button" className="ih-bank-target" onClick={() => toggleOpen(p.key)}>
                      Chọn đáp án
                      <span className="ih-bank-target-caret" aria-hidden>
                        ▾
                      </span>
                    </button>
                  )}
                  {open && (
                    <div className="ih-bank-dropdown" role="listbox">
                      {options.map((o) => (
                        <button
                          key={o.key}
                          type="button"
                          className={`ih-bank-dropdown-opt${o.key === pairedKey ? ' selected' : ''}`}
                          disabled={usedOptionKeys.has(o.key) && o.key !== pairedKey}
                          onClick={() => assign(o.key)}
                        >
                          {o.value}
                        </button>
                      ))}
                    </div>
                  )}
                </span>
              </div>
            )
          })}
        </div>
        {openPrompt && <div className="ih-bank-backdrop" onClick={() => setOpenPrompt(null)} />}

        <div className="ih-pr-filters ih-sb-actions">
          {checked !== 'correct' && (
            <button type="button" className="ih-btn-solid ih-pr-push" onClick={check} disabled={round.prompts.some((p) => !pairs[p.key])}>
              Kiểm tra
            </button>
          )}
          {checked === 'correct' && cur < total - 1 && (
            <button type="button" className="ih-btn-solid ih-pr-push" onClick={() => goTo(cur + 1)}>
              Vòng tiếp →
            </button>
          )}
          {checked === 'incorrect' && (
            <button type="button" className="ih-pr-push ih-btn-outline" onClick={resetRoundState}>
              ↺ Làm lại
            </button>
          )}
        </div>

        {checked !== 'idle' && (
          <div className={`ih-sb-result${checked === 'correct' ? ' correct' : ' incorrect'}`}>
            <p className="ih-sb-result-title">{checked === 'correct' ? 'Chính xác!' : 'Còn sai vài cặp — anh chị xem lại rồi thử lại nhé'}</p>
            {round.recap && (
              <button type="button" className="ih-vocab-expand" onClick={() => setShowRecap((v) => !v)}>
                {showRecap ? 'Ẩn ôn lại ▴' : 'Xem lại collocation + ví dụ ▾'}
              </button>
            )}
            {showRecap && round.recap && (
              <div className="ih-sb-explanation">
                {round.recap.map((r, i) => (
                  <div key={i} className="ih-match-recap-row">
                    <p className="ih-sb-exp-line">
                      <span className="ih-vocab-lang">VI</span>
                      {r.vi}: <strong>{r.en}</strong>
                    </p>
                    <p className="ih-pr-ctx-en">
                      <button type="button" className="ih-vocab-speak" aria-label="Đọc câu ví dụ" onClick={() => speak(r.example, 'en-US')}>
                        🔊
                      </button>
                      {r.example}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
