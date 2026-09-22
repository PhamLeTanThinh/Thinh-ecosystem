'use client'

import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { DEFAULT_PREFS, flatQuestions, isCorrect, loadAttempts, loadPrefs, savePrefs, type AttemptRecord, type ExBreakdown, type ExChip, type ExParaphrase, type Explanation, type PracticeGroup, type PracticeQuestion, type PracticeTest } from '@/lib/ielts/practice'
import { ColumnDivider, useColumnSplit } from './columnSplit'
import { locateHits } from './locateHits'
import { segmentsFor } from './passageSelection'

type Status = 'correct' | 'wrong' | 'missed' | 'none' // none = chưa có lần nộp nào để đối chiếu

// Định dạng giải thích: **đậm**, {ok} ✓ xanh, {no} ✗ đỏ, [[3]] huy hiệu số câu. Mỗi dòng (\n) là 1 đoạn.
function inline(line: string): ReactNode[] {
  return line.split(/(\*\*[^*]+\*\*|\{ok\}|\{no\}|\[\[\d+\]\])/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part === '{ok}') return <span key={i} className="ih-rv-mark ok" aria-label="đúng">✓</span>
    if (part === '{no}') return <span key={i} className="ih-rv-mark no" aria-label="sai">✕</span>
    if (part.startsWith('[[')) return <span key={i} className="ih-rv-qnum">{part.slice(2, -2)}</span>
    return <Fragment key={i}>{part}</Fragment>
  })
}

function formatAttempt(r: AttemptRecord, n: number): string {
  const d = new Date(r.at)
  return `Lần ${n}: ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}, ${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
}

// Màn "Xem giải thích": toàn màn hình, xem TỪNG CÂU — bài đọc bên trái; bên phải là ngữ cảnh câu hỏi (đáp án
// của bạn + đáp án đúng), giải thích chi tiết và công tắc Locate (tô sáng câu chứng cứ trong bài). Chọn lần làm
// ở góc phải để đối chiếu với đáp án của lần đó. Nhận cả đề (có đáp án) nên chỉ được render sau assertIeltsAccess.
export function AnswerReview({ test }: { test: PracticeTest }) {
  const router = useRouter()
  const questions = useMemo(() => flatQuestions(test), [test])
  const [history, setHistory] = useState<AttemptRecord[] | null>(null) // null = chưa đọc localStorage
  const [sel, setSel] = useState(0) // chỉ số lần làm đang xem trong history
  const [cur, setCur] = useState(0) // chỉ số câu đang xem
  const [locate, setLocate] = useState(false)
  // Độ rộng 2 cột: kéo thanh giữa; được nhớ chung với màn làm bài.
  const { bodyRef, style: splitStyle, divider, apply: applySplit } = useColumnSplit(DEFAULT_PREFS.split, (v) => savePrefs({ ...loadPrefs(), split: v }))

  useEffect(() => {
    const h = loadAttempts()[test.id]?.history ?? []
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(h)
    setSel(Math.max(0, h.length - 1))
    applySplit(loadPrefs().split)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test.id])

  const rec = history && history.length > 0 ? history[Math.min(sel, history.length - 1)] : null
  const statusOf = (q: PracticeQuestion): Status => {
    if (!rec) return 'none'
    const given = rec.answers[q.id]
    return !given?.trim() ? 'missed' : isCorrect(q, given) ? 'correct' : 'wrong'
  }

  const q = questions[cur]
  const group = test.groups.find((g) => g.questions.some((x) => x.id === q.id)) as PracticeGroup
  const numberOf = useMemo(() => new Map(questions.map((x, i) => [x.id, i + 1])), [questions])
  const first = numberOf.get(group.questions[0].id) ?? 0
  const last = numberOf.get(group.questions[group.questions.length - 1].id) ?? first
  const correctCount = questions.filter((x) => statusOf(x) === 'correct').length
  const base = `/ielts/${test.skill}/practice/${test.id}`

  // Vị trí cần tô khi Locate: từ khoá của đề bài (cam) + chứng cứ của đáp án (xanh lá)… lấy từ các cặp Paraphrasing.
  const hits = useMemo(() => locateHits(q.id, typeof q.explanation === 'string' ? undefined : q.explanation, q.locate, test.passage), [q, test.passage])
  const locHighlights = locate ? hits : []

  // Bật Locate / đổi câu: cuộn tới đoạn chứng cứ đầu tiên.
  useEffect(() => {
    if (!locate) return
    document.querySelector('.ih-rv .ih-loc')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [locate, cur])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const given = rec?.answers[q.id]
  // explanation là chuỗi (chỉ có phần diễn giải) hoặc đối tượng có cấu trúc (Paraphrasing + phân tích câu + diễn giải).
  const ex: Explanation | undefined = typeof q.explanation === 'string' ? { notes: q.explanation } : q.explanation
  const status = statusOf(q)
  const isTable = Boolean(group.table)

  return (
    <div className="ih-run ih-rv" role="dialog" aria-modal="true" aria-label="Giải thích">
      <header className="ih-run-top">
        <button type="button" className="ih-run-close" aria-label="Thoát" onClick={() => router.push(rec ? `${base}/result` : `/ielts/${test.skill}/practice`)}>
          ✕
        </button>
        <div className="ih-rv-title">
          <strong>Giải thích</strong>
          <span>{test.title}</span>
        </div>
        <span className="ih-rv-spacer" />
        {history && history.length > 0 ? (
          <select className="ih-rv-attempt" value={sel} onChange={(e) => setSel(Number(e.target.value))} aria-label="Chọn lần làm">
            {history
              .map((r, i) => ({ r, i }))
              .reverse()
              .map(({ r, i }) => (
                <option key={r.at} value={i}>
                  {formatAttempt(r, i + 1)}
                </option>
              ))}
          </select>
        ) : (
          history && <span className="ih-rv-noattempt">Chưa có lần nộp — hiển thị đáp án đúng</span>
        )}
      </header>

      <div ref={bodyRef} className="ih-run-body" style={splitStyle}>
        <section className="ih-run-passage">
          <h2 className="ih-run-passage-title">{test.passageTitle}</h2>
          {test.passage.map((p, pi) => (
            <div key={pi} className="ih-run-para">
              {test.paragraphLabels?.[pi] && <span className="ih-run-plabel">{test.paragraphLabels[pi]}</span>}
              <p>
                {segmentsFor(
                  p,
                  locHighlights.filter((h) => h.para === pi),
                ).map((seg, si) =>
                  seg.hl ? (
                    <mark key={si} className="ih-loc" style={{ background: seg.hl.color, boxShadow: `0 0 0 2px ${seg.hl.color}` }}>
                      {seg.text}
                    </mark>
                  ) : (
                    <Fragment key={si}>{seg.text}</Fragment>
                  ),
                )}
              </p>
            </div>
          ))}
        </section>

        <ColumnDivider divider={divider} />

        <section className="ih-run-questions ih-rv-panel">
          <div className="ih-run-group-head">
            <span className="ih-run-group-range">
              Question {first}
              {last > first ? ` - ${last}` : ''}
            </span>
            <span>{group.instruction.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>))}</span>
          </div>

          {isTable && group.table ? (
            <div className="ih-run-table-card">
              <h3 className="ih-run-table-title">{group.table.title}</h3>
              <table className="ih-run-table">
                <tbody>
                  {group.table.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>
                        {row.lines.map((line, li) => {
                          if (typeof line === 'string') return <p key={li} className="ih-run-q-text">{line}</p>
                          const gq = group.questions.find((x) => x.id === line.q)
                          if (!gq) return null
                          const idx = questions.indexOf(gq)
                          const st = statusOf(gq)
                          const g = rec?.answers[gq.id]
                          const parts = gq.prompt.split('___')
                          return (
                            <p key={li} className="ih-run-q-text">
                              {parts[0]}
                              <button type="button" className={`ih-rv-chip ${st}${idx === cur ? ' active' : ''}`} onClick={() => setCur(idx)}>
                                <span className="n">{idx + 1}</span>
                                {st === 'correct' && g}
                                {st === 'wrong' && (
                                  <>
                                    <s>{g}</s> → <b>{gq.answer}</b>
                                  </>
                                )}
                                {st === 'missed' && (
                                  <>
                                    <em>Bỏ trống</em> → <b>{gq.answer}</b>
                                  </>
                                )}
                                {st === 'none' && <b>{gq.answer}</b>}
                              </button>
                              {parts.slice(1).join('___')}
                            </p>
                          )
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`ih-rv-card ${status}`}>
              <p className="ih-rv-prompt">
                <span className="ih-run-q-num">{cur + 1}.</span>
                {q.prompt}
              </p>
              <div className="ih-rv-opts">
                {q.type === 'match'
                  ? (group.matchLegend ?? []).map(({ key, label }) => {
                      const right = key === q.answer
                      const picked = given === key
                      return (
                        <span key={key} className={`ih-rv-opt${right ? ' right' : ''}${picked && !right ? ' wrong' : ''}${picked ? ' picked' : ''}`}>
                          <b>{key}</b> {label}
                          {right && <span className="ih-rv-mark ok">✓</span>}
                          {picked && !right && <span className="ih-rv-mark no">✕</span>}
                        </span>
                      )
                    })
                  : (q.type === 'tfng' ? ['True', 'False', 'Not Given'] : q.type === 'bank' ? (group.optionBank ?? [q.answer]) : (q.options ?? [q.answer])).map((opt) => {
                      const right = opt === q.answer
                      const picked = given === opt
                      return (
                        <span key={opt} className={`ih-rv-opt${right ? ' right' : ''}${picked && !right ? ' wrong' : ''}${picked ? ' picked' : ''}`}>
                          {opt === 'Not Given' ? 'Not given' : opt}
                          {right && <span className="ih-rv-mark ok">✓</span>}
                          {picked && !right && <span className="ih-rv-mark no">✕</span>}
                        </span>
                      )
                    })}
              </div>
              {status === 'missed' && <p className="ih-rv-missed">Bạn đã bỏ trống câu này.</p>}
              {status === 'wrong' && q.type !== 'tfng' && q.type !== 'mcq' && q.type !== 'match' && q.type !== 'bank' && (
                <p className="ih-rv-missed">
                  Bạn trả lời: <s>{given}</s> · Đáp án: <b>{q.answer}</b>
                </p>
              )}
            </div>
          )}

          <div className="ih-rv-exp-head">
            <span>GIẢI THÍCH CÂU {cur + 1}</span>
            <label className={`ih-rv-locate${locate ? ' on' : ''}${hits.length === 0 ? ' off' : ''}`} title={hits.length === 0 ? 'Câu này chưa có vị trí chứng cứ' : 'Tô sáng từ khoá của đề bài và chứng cứ của đáp án trong bài đọc'}>
              Locate
              <input type="checkbox" checked={locate} disabled={hits.length === 0} onChange={(e) => setLocate(e.target.checked)} />
              <span className="ih-rv-switch" aria-hidden />
            </label>
          </div>

          {ex?.paraphrase && <ParaphraseCard p={ex.paraphrase} />}

          <div className="ih-rv-exp">
            <div className="ih-rv-exp-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
              </svg>
              Giải thích chi tiết
            </div>
            <div className="ih-rv-exp-body">
              {ex?.breakdown && <BreakdownView b={ex.breakdown} />}
              {ex?.notes ? ex.notes.split('\n').map((line, i) => <p key={i}>{inline(line)}</p>) : !ex?.breakdown && <p className="ih-rv-empty">Chưa có giải thích cho câu này.</p>}
            </div>
          </div>
        </section>
      </div>

      <footer className="ih-run-bottom">
        <div className="ih-run-progress">
          <strong>Practice</strong>
          <span>{rec ? `Làm đúng ${correctCount} / ${questions.length}` : 'Đáp án đúng'}</span>
        </div>
        <div className="ih-run-palette">
          {questions.map((x, i) => (
            <button key={x.id} type="button" className={`ih-run-num${statusOf(x) === 'correct' ? ' correct' : statusOf(x) === 'wrong' ? ' wrong' : ''}${i === cur ? ' current' : ''}`} onClick={() => setCur(i)}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="ih-rv-nav">
          <button type="button" disabled={cur === 0} onClick={() => setCur((c) => Math.max(0, c - 1))}>
            Trước
          </button>
          <button type="button" disabled={cur === questions.length - 1} onClick={() => setCur((c) => Math.min(questions.length - 1, c + 1))}>
            Tiếp
          </button>
        </div>
      </footer>
    </div>
  )
}

// **đậm** trong chữ của cụm / câu hỏi.
function bold(text: string): ReactNode[] {
  return text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>))
}

// 1 cụm viền màu, nhãn nhỏ (nếu có) nằm phía trên và cùng màu với viền.
function Chip({ chip }: { chip: ExChip }) {
  const c = chip.color ?? 'blue'
  return (
    <span className="ih-ex-cw">
      {chip.label && <span className={`ih-ex-label c-${c}`}>{chip.label}</span>}
      <span className={`ih-ex-chip c-${c}`}>{bold(chip.text)}</span>
    </span>
  )
}

// Khối "Paraphrasing": câu hỏi tô màu từng cụm + các cặp cụm "câu hỏi = bài đọc".
function ParaphraseCard({ p }: { p: ExParaphrase }) {
  return (
    <div className="ih-rv-exp">
      <div className="ih-rv-exp-title">Paraphrasing</div>
      <div className="ih-rv-exp-body">
        <p>
          <strong>Question: </strong>
          {p.question.map((seg, i) => (seg.color ? <span key={i} className={`ih-ex-hl c-${seg.color}`}>{bold(seg.text)}</span> : <Fragment key={i}>{bold(seg.text)}</Fragment>))}
        </p>
        <p>
          <strong>So sánh các cụm từ bên câu hỏi và bài đọc</strong>, ta có:
        </p>
        {p.pairs.map((pair, i) => (
          <div key={i} className="ih-ex-row">
            <Chip chip={pair.left} />
            {pair.right && (
              <>
                <span className="ih-ex-rel">{pair.rel ?? '='}</span>
                <Chip chip={pair.right} />
              </>
            )}
            {pair.note && <span className="ih-ex-rel">→ {pair.note}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// Câu của bài đọc tách thành các cụm có nhãn vai trò (S, V, mục đích…).
function BreakdownView({ b }: { b: ExBreakdown }) {
  return (
    <div className="ih-ex-break">
      <p className="ih-ex-break-title">{b.title ?? 'Phân tích cấu trúc câu'} 🤩</p>
      {b.sentences.map((sent, i) => (
        <div key={i} className="ih-ex-sent">
          {sent.n !== undefined && <span className="ih-rv-qnum big">{sent.n}</span>}
          {sent.prefix && <span className="ih-ex-prefix">{sent.prefix}</span>}
          {sent.chips.map((c, ci) => (typeof c === 'string' ? <span key={ci} className="ih-ex-punct">{c}</span> : <Chip key={ci} chip={c} />))}
        </div>
      ))}
    </div>
  )
}
