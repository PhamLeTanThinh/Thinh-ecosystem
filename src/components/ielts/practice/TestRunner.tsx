'use client'

import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { navigateIelts } from '@/lib/ielts/navigationLoading'
import { nanoid } from 'nanoid'
import {
  clearDraft,
  DEFAULT_PREFS,
  flatQuestions,
  isCorrect,
  loadDrafts,
  loadHighlights,
  loadPrefs,
  FIXED_CHOICES,
  saveAttempt,
  saveDraft,
  saveHighlights,
  savePrefs,
  type Highlight,
  type PracticeMode,
  type TableLayout,
  type PracticeQuestion,
  type PracticeTest,
  type RunPrefs,
} from '@/lib/ielts/practice'
import { ColumnDivider, useColumnSplit } from './columnSplit'
import { ConfirmDialog } from './ConfirmDialog'
import { LookupPopover, NotePopover, ToolsLeft, ToolsRight } from './RunTools'
import { HL_COLORS, rawSelection, segmentsFor, selectionParts, subtractRange, type Part, type Tool } from './passageSelection'

interface Props {
  test: PracticeTest
  mode: PracticeMode
}

interface Start {
  answers: Record<string, string>
  flags: string[]
  highlights: Highlight[]
  prefs: RunPrefs
  deadline: number | null // epoch ms, chỉ thi thật
  secondsLeft: number
}

type Pop =
  | { kind: 'note'; rect: DOMRect; parts: Part[]; hlId: string | null; initial: string }
  | { kind: 'lookup'; rect: DOMRect; text: string }

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Vỏ ngoài: đọc bài làm dở + highlight/ghi chú + tuỳ chọn hiển thị (localStorage chỉ có ở client) rồi mới
// dựng màn làm bài, để mọi thứ khôi phục đúng ngay từ lần render đầu của TestRunnerBody — không nháy trạng
// thái rỗng. Bài nháp khác chế độ với chế độ đang mở thì bỏ (chọn chế độ khác = làm lại từ đầu).
export function TestRunner({ test, mode }: Props) {
  const [start, setStart] = useState<Start | null>(null)

  useEffect(() => {
    const draft = loadDrafts()[test.id]
    const usable = draft && draft.mode === mode ? draft : null
    if (draft && !usable) clearDraft(test.id)
    const now = Date.now()
    // Thi thật: đồng hồ bắt đầu từ lúc mở đề lần đầu; mở lại thì tiếp tục theo mốc đã lưu.
    const deadline = mode === 'real' ? (usable?.deadline ?? now + test.durationMin * 60_000) : null
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStart({
      answers: usable?.answers ?? {},
      flags: usable?.flags ?? [],
      highlights: loadHighlights(test.id),
      prefs: loadPrefs(),
      deadline,
      secondsLeft: deadline === null ? 0 : Math.max(0, Math.ceil((deadline - now) / 1000)),
    })
  }, [test, mode])

  if (!start) {
    return (
      <div className="ih-run">
        <div className="ih-loading-state">
          <span className="ih-spinner" aria-hidden />
          <span>Đang mở đề…</span>
        </div>
      </div>
    )
  }
  return <TestRunnerBody test={test} mode={mode} start={start} />
}

// Màn làm bài toàn màn hình (đè lên cả sidebar): thanh công cụ trên cùng, bài đọc bên trái, câu hỏi bên
// phải, thanh số câu ở đáy. Mobile chuyển thành 2 tab vì không đủ chỗ chia đôi.
// Luyện tập: không tính giờ, có nút "Kiểm tra" chấm ngay. Thi thật: đếm ngược, không hỗ trợ (kể cả tra
// nghĩa), hết giờ tự nộp. Cả hai đều tự lưu nháp: thoát hoặc F5 rồi vào lại vẫn còn đáp án, đồng hồ chạy tiếp.
// Trên bài đọc: bôi đen để highlight (nhiều màu), ghi chú, xoá highlight — lưu theo đề.
function TestRunnerBody({ test, mode, start }: Props & { start: Start }) {
  const router = useRouter()
  const listHref = `/ielts/${test.skill}/practice`
  const resultHref = `/ielts/${test.skill}/practice/${test.id}/result`
  const questions = useMemo(() => flatQuestions(test), [test])
  const numberOf = useMemo(() => new Map(questions.map((q, i) => [q.id, i + 1])), [questions])
  const [answers, setAnswers] = useState<Record<string, string>>(start.answers)
  const [checked, setChecked] = useState(false) // practice: hiện đúng/sai ngay
  const [submitted, setSubmitted] = useState(false)
  const [tab, setTab] = useState<'passage' | 'questions'>('passage')
  const [secondsLeft, setSecondsLeft] = useState(start.secondsLeft)

  const [tool, setTool] = useState<Tool>('select')
  const [color, setColor] = useState(HL_COLORS[0].color)
  const [highlights, setHighlights] = useState<Highlight[]>(start.highlights)
  const [prefs, setPrefs] = useState<RunPrefs>(start.prefs ?? DEFAULT_PREFS)
  const [flags, setFlags] = useState<string[]>(start.flags)
  const [activeQ, setActiveQ] = useState<string | null>(null)
  const [pop, setPop] = useState<Pop | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  // Hộp thoại xác nhận (thay window.confirm): nộp bài / thoát khỏi bài thi đang tính giờ.
  const [confirm, setConfirm] = useState<'submit' | 'exit' | null>(null)
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const passageRef = useRef<HTMLElement>(null)
  // Kéo thanh giữa để đổi độ rộng 2 cột; bodyRef cũng dùng cho nút nổi Tra nghĩa.
  const { bodyRef, style: splitStyle, divider } = useColumnSplit(start.prefs?.split ?? DEFAULT_PREFS.split, (v) => setPrefs((p) => ({ ...p, split: v })))
  // Nút nổi "TRA NGHĨA" hiện ngay trên đoạn vừa bôi đen (ở bài đọc lẫn phần câu hỏi).
  const [floatSel, setFloatSel] = useState<{ rect: DOMRect; text: string } | null>(null)

  const answered = questions.filter((q) => answers[q.id]?.trim()).length
  const score = questions.filter((q) => isCorrect(q, answers[q.id])).length
  // Chỉ lộ đáp án khi người dùng bấm "Check" (luyện tập). Nộp bài thì KHÔNG lộ trên màn làm bài — trang chuyển
  // sang màn kết quả ngay, lộ ở đây chỉ làm đáp án nháy lên trong lúc chờ chuyển trang.
  const reveal = checked

  // Các nhóm câu hỏi (đầu–cuối) cho chip điều hướng nhóm ở đáy màn hình.
  const groupRanges = useMemo(
    () =>
      test.groups.map((g) => ({
        first: numberOf.get(g.questions[0].id) ?? 0,
        last: numberOf.get(g.questions[g.questions.length - 1].id) ?? 0,
        ids: g.questions.map((q) => q.id),
      })),
    [test, numberOf],
  )
  // Trang câu hỏi đang xem = 1 nhóm (group) trong đề — bấm số ở palette hoặc chip nhóm sẽ CHUYỂN TRANG
  // (chỉ nhóm đang chọn hiện ra), không phải cuộn qua 1 trang dài gồm mọi nhóm.
  const [page, setPage] = useState(0)
  const curGroup = page

  function finish() {
    setSubmitted(true)
    setTab('questions')
    clearDraft(test.id)
    saveAttempt(test.id, { score, total: questions.length, mode, answers })
    // Sang màn kết quả riêng (tổng điểm, thống kê, answer key). replace để Back không quay lại bài đã nộp.
    navigateIelts(router, resultHref, true)
  }

  // Tự lưu nháp mỗi khi đáp án / cờ đổi. Luyện tập chưa trả lời câu nào thì không tạo nháp (mở đề xem rồi
  // thoát không nên bị tính là "đang làm"); thi thật thì có nháp ngay vì đồng hồ đã chạy.
  useEffect(() => {
    if (submitted) return
    if (mode === 'practice' && answered === 0) {
      clearDraft(test.id)
      return
    }
    saveDraft(test.id, { mode, answers, deadline: start.deadline, flags })
  }, [answers, flags, submitted, mode, answered, start.deadline, test.id])

  useEffect(() => saveHighlights(test.id, highlights), [highlights, test.id])
  useEffect(() => savePrefs(prefs), [prefs])

  // Vùng chọn biến mất (bấm ra chỗ khác) thì bỏ nút nổi Tra nghĩa.
  useEffect(() => {
    const onChange = () => {
      const s = window.getSelection()
      if (!s || s.isCollapsed) setFloatSel(null)
    }
    document.addEventListener('selectionchange', onChange)
    return () => document.removeEventListener('selectionchange', onChange)
  }, [])

  // Đếm ngược (chỉ thi thật, đến khi nộp). Tính lại từ mốc kết thúc mỗi nhịp thay vì trừ dần từng giây,
  // để tab bị trình duyệt làm chậm khi ở nền vẫn hiện đúng giờ.
  useEffect(() => {
    if (mode !== 'real' || submitted || start.deadline === null) return
    const deadline = start.deadline
    const id = setInterval(() => setSecondsLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))), 1000)
    return () => clearInterval(id)
  }, [mode, submitted, start.deadline])

  // Hết giờ thì tự nộp (kể cả khi mở lại đề đã quá hạn). Chạy lại khi đáp án đổi là vô hại vì đã chặn
  // bằng `submitted`.
  useEffect(() => {
    if (mode === 'real' && secondsLeft === 0 && !submitted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      finish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, secondsLeft, submitted])

  // Khoá cuộn của trang phía sau khi runner mở.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  function showHint(text: string) {
    setHint(text)
    if (hintTimer.current) clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setHint(null), 2600)
  }

  function setAnswer(id: string, value: string) {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  // ── Highlight / ghi chú ────────────────────────────────────────────
  function addHighlights(parts: Part[], note?: string) {
    setHighlights((prev) => [...prev, ...parts.map((p, i) => ({ id: nanoid(), ...p, color, note: i === 0 ? note : undefined }))])
    window.getSelection()?.removeAllRanges()
  }

  function eraseParts(parts: Part[]) {
    setHighlights((prev) =>
      prev.flatMap((h) => parts.filter((p) => p.para === h.para).reduce<Highlight[]>((pieces, p) => pieces.flatMap((pc) => subtractRange(pc, p.start, p.end)), [h])),
    )
    window.getSelection()?.removeAllRanges()
  }

  // Bấm nút Highlight / Xoá: có vùng bôi đen thì áp dụng ngay và bật luôn chế độ đó (các lần bôi đen sau tự
  // áp dụng); chưa có vùng chọn thì chỉ bật/tắt chế độ.
  function onTool(next: Tool) {
    const sel = passageRef.current ? selectionParts(passageRef.current) : null
    if (sel && next === 'highlight') addHighlights(sel.parts)
    if (sel && next === 'erase') eraseParts(sel.parts)
    setTool((t) => (sel || next === 'select' ? next : t === next ? 'select' : next))
  }

  // Thả chuột sau khi bôi đen: đang ở chế độ Highlight / Xoá thì áp dụng luôn.
  function onPassageMouseUp() {
    if (tool === 'select' || !passageRef.current) return
    const sel = selectionParts(passageRef.current)
    if (!sel) return
    if (tool === 'highlight') addHighlights(sel.parts)
    else eraseParts(sel.parts)
  }

  function onNote() {
    const sel = passageRef.current ? selectionParts(passageRef.current) : null
    if (!sel) return showHint('Bôi đen đoạn văn cần ghi chú trước, rồi bấm “Ghi chú”.')
    setPop({ kind: 'note', rect: sel.rect, parts: sel.parts, hlId: null, initial: '' })
  }

  function onLookup() {
    const sel = passageRef.current ? selectionParts(passageRef.current) : null
    const raw = sel ?? (bodyRef.current ? rawSelection(bodyRef.current) : null)
    if (!raw) return showHint('Bôi đen một từ trước, rồi bấm “Tra nghĩa”.')
    setPop({ kind: 'lookup', rect: raw.rect, text: raw.text })
  }

  // Thả chuột sau khi bôi đen (chế độ thường, không phải Thi thật): hiện nút nổi Tra nghĩa trên vùng chọn.
  function onBodyMouseUp() {
    if (mode === 'real' || tool !== 'select' || !bodyRef.current) return
    const sel = rawSelection(bodyRef.current)
    setFloatSel(sel && sel.text.length <= 80 ? sel : null)
  }

  // Bấm vào đoạn đã highlight: chế độ Xoá → xoá nó; ngược lại nếu có ghi chú → mở ghi chú.
  function onMarkClick(h: Highlight, el: HTMLElement) {
    if (!window.getSelection()?.isCollapsed) return
    if (tool === 'erase') return setHighlights((prev) => prev.filter((x) => x.id !== h.id))
    if (h.note !== undefined) setPop({ kind: 'note', rect: el.getBoundingClientRect(), parts: [], hlId: h.id, initial: h.note })
  }

  function saveNote(text: string) {
    if (pop?.kind !== 'note') return
    if (pop.hlId) {
      setHighlights((prev) => prev.map((h) => (h.id === pop.hlId ? { ...h, note: text || undefined } : h)))
    } else if (text) {
      addHighlights(pop.parts, text)
    }
    setPop(null)
  }

  function deleteNoteHighlight() {
    if (pop?.kind === 'note' && pop.hlId) setHighlights((prev) => prev.filter((h) => h.id !== pop.hlId))
    setPop(null)
  }

  // ── Điều hướng / nộp bài ───────────────────────────────────────────
  function requestClose() {
    // Bài làm dở đã được tự lưu nên thoát không mất đáp án; riêng thi thật đồng hồ vẫn chạy nên báo rõ.
    if (mode === 'real' && !submitted) return setConfirm('exit')
    navigateIelts(router, listHref)
  }

  // Bấm "Nộp bài": luôn hỏi lại (hộp thoại liệt kê câu chưa trả lời + câu đã đánh dấu cờ).
  function requestSubmit() {
    if (!submitted) setConfirm('submit')
  }

  function jumpTo(id: string) {
    const gi = groupRanges.findIndex((g) => g.ids.includes(id))
    if (gi !== -1) setPage(gi)
    setActiveQ(id)
    setTab('questions')
    // Đợi trang/tab chuyển xong rồi mới cuộn tới câu (nếu câu không nằm ở nhóm khác thì DOM đã có sẵn).
    requestAnimationFrame(() => document.getElementById(`ih-q-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  function toggleFlag(target?: string) {
    const id = target ?? activeQ ?? questions[0]?.id
    if (!id) return
    setActiveQ(id)
    setFlags((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const lowTime = mode === 'real' && !submitted && secondsLeft <= 60
  const scale = 1 + prefs.fontStep * 0.12
  const flaggedActive = activeQ ? flags.includes(activeQ) : false

  return (
    <div className={`ih-run${prefs.dark ? ' dark' : ''}`} style={{ '--run-scale': scale } as React.CSSProperties} role="dialog" aria-modal="true" aria-label={test.title}>
      <header className="ih-run-top">
        <ToolsLeft tool={tool} color={color} lookupDisabled={mode === 'real'} onTool={onTool} onColor={setColor} onNote={onNote} onLookup={onLookup} onClose={requestClose} />

        <div className="ih-run-center">
          <span className={`ih-run-mode ih-run-mode-${mode}`}>{mode === 'real' ? 'Thi thật' : 'Luyện tập'}</span>
          <span className="ih-run-name">{test.title}</span>
          <span className={`ih-run-timer${lowTime ? ' low' : ''}`} title={mode === 'real' ? `Thời gian làm bài: ${test.durationMin} phút` : 'Chế độ luyện tập không tính giờ'}>
            {mode === 'real' ? `⏱ ${formatTime(secondsLeft)}` : 'Không tính giờ'}
          </span>
        </div>

        <ToolsRight prefs={prefs} flagged={flaggedActive} onPrefs={setPrefs} onFlag={() => toggleFlag()} />

        <div className="ih-run-actions">
          {mode === 'practice' && !submitted && (
            <button type="button" className="ih-btn-outline" onClick={() => setChecked((v) => !v)}>
              {checked ? 'Ẩn đáp án' : 'Kiểm tra'}
            </button>
          )}
          {!submitted && (
            <button type="button" className="ih-btn-solid" onClick={requestSubmit}>
              Nộp bài
            </button>
          )}
        </div>
      </header>

      {hint && <div className="ih-run-hint" role="status">{hint}</div>}

      <div className="ih-run-tabs">
        <button type="button" className={tab === 'passage' ? 'active' : ''} onClick={() => setTab('passage')}>
          Bài đọc
        </button>
        <button type="button" className={tab === 'questions' ? 'active' : ''} onClick={() => setTab('questions')}>
          Câu hỏi
        </button>
      </div>

      <div ref={bodyRef} className={`ih-run-body tab-${tab}${prefs.stack ? ' stack' : ''}`} onMouseUp={onBodyMouseUp} onScrollCapture={() => setFloatSel(null)} style={splitStyle}>
        <section ref={passageRef} className={`ih-run-passage tool-${tool}`} onMouseUp={onPassageMouseUp}>
          <h2 className="ih-run-passage-title">{test.passageTitle}</h2>
          {test.passage.map((p, pi) => (
            <div key={pi} className="ih-run-para">
              {/* Nhãn đoạn nằm NGOÀI <p data-para> để không làm lệch vị trí ký tự của highlight. */}
              {test.paragraphLabels?.[pi] && <span className="ih-run-plabel">{test.paragraphLabels[pi]}</span>}
              <p data-para={pi}>
              {segmentsFor(
                p,
                highlights.filter((h) => h.para === pi),
              ).map((seg, si) =>
                seg.hl ? (
                  <mark
                    key={si}
                    className={`ih-hl${seg.hl.note !== undefined ? ' has-note' : ''}`}
                    style={{ background: seg.hl.color }}
                    onClick={(e) => onMarkClick(seg.hl!, e.currentTarget)}
                  >
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

        <section className="ih-run-questions">
          {(() => {
            const g = test.groups[page]
            const gi = page
            return (
              <div key={g.id} className="ih-run-group">
                <div className="ih-run-group-head">
                  <span className="ih-run-group-range">
                    Question {groupRanges[gi].first}
                    {groupRanges[gi].last > groupRanges[gi].first ? ` - ${groupRanges[gi].last}` : ''}
                  </span>
                  <span>{richText(g.instruction)}</span>
                </div>
                <div className={`ih-run-group-body${g.table ? ' table' : g.matchLegend ? ' match' : g.optionBank ? ' bank' : g.questions.every((q) => q.type === 'tfng' || q.type === 'ynng' || q.type === 'mcq' || q.type === 'multi') ? ' cards' : ''}`}>
                  {(() => {
                    const renderQ = (q: PracticeQuestion, inline = false) => (
                      <QuestionRow
                        key={q.id}
                        q={q}
                        num={numberOf.get(q.id) ?? 0}
                        value={answers[q.id] ?? ''}
                        onChange={(v) => setAnswer(q.id, v)}
                        reveal={reveal}
                        locked={submitted}
                        flagged={flags.includes(q.id)}
                        inline={inline}
                        onActive={() => setActiveQ(q.id)}
                        onFlag={() => toggleFlag(q.id)}
                      />
                    )
                    if (g.table) return <TableGroup table={g.table} questions={g.questions} renderQ={(q) => renderQ(q, true)} />
                    if (g.matchLegend)
                      return (
                        <MatchGroup
                          legend={g.matchLegend}
                          questions={g.questions}
                          numberOf={numberOf}
                          answers={answers}
                          onChange={setAnswer}
                          reveal={reveal}
                          locked={submitted}
                          flags={flags}
                          onFlag={toggleFlag}
                          onActive={setActiveQ}
                        />
                      )
                    if (g.optionBank)
                      return (
                        <BankGroup
                          bank={g.optionBank}
                          questions={g.questions}
                          numberOf={numberOf}
                          answers={answers}
                          onChange={setAnswer}
                          reveal={reveal}
                          locked={submitted}
                          flags={flags}
                          onFlag={toggleFlag}
                          onActive={setActiveQ}
                        />
                      )
                    if (g.questions.every((q) => q.type === 'multi'))
                      return (
                        <MultiGroup
                          questions={g.questions}
                          numberOf={numberOf}
                          answers={answers}
                          onChange={setAnswer}
                          reveal={reveal}
                          locked={submitted}
                          flags={flags}
                          onFlag={toggleFlag}
                          onActive={setActiveQ}
                        />
                      )
                    return g.questions.map((q) => renderQ(q))
                  })()}
                </div>
                {g.matchLegend && (
                  <div className="ih-run-match-legend">
                    {g.matchLegend.map((m) => (
                      <span key={m.key} className="ih-run-match-legend-item">
                        <b>{m.key}</b> {m.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}
        </section>
      </div>

      <footer className="ih-run-bottom">
        <div className="ih-run-progress">
          <strong>{mode === 'real' ? 'Thi thật' : 'Luyện tập'}</strong>
          <span>
            Đã làm {answered} / {questions.length}
          </span>
        </div>
        <div className="ih-run-palette">
          {questions.map((q, i) => {
            const state = reveal ? (isCorrect(q, answers[q.id]) ? ' correct' : ' wrong') : answers[q.id]?.trim() ? ' answered' : ''
            return (
              <button key={q.id} type="button" className={`ih-run-num${state}${flags.includes(q.id) ? ' flagged' : ''}${activeQ === q.id ? ' current' : ''}`} onClick={() => jumpTo(q.id)}>
                {i + 1}
              </button>
            )
          })}
        </div>
        {/* Chip nhóm câu hỏi đang xem; bấm để nhảy sang nhóm kế tiếp (vòng lại nhóm đầu). */}
        <button
          type="button"
          className="ih-run-bottom-skill"
          title="Chuyển sang nhóm câu hỏi kế tiếp"
          onClick={() => jumpTo(groupRanges[(curGroup + 1) % groupRanges.length].ids[0])}
        >
          {groupRanges[curGroup]?.first === groupRanges[curGroup]?.last ? groupRanges[curGroup]?.first : `${groupRanges[curGroup]?.first} - ${groupRanges[curGroup]?.last}`}
        </button>
      </footer>

      {confirm === 'submit' && !submitted && (
        <ConfirmDialog
          title="Nộp bài?"
          confirmLabel="Nộp bài"
          cancelLabel="Làm tiếp"
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            setConfirm(null)
            finish()
          }}
        >
          {(() => {
            const blank = questions.filter((q) => !answers[q.id]?.trim())
            const flagged = questions.filter((q) => flags.includes(q.id))
            const goto = (id: string) => {
              setConfirm(null)
              jumpTo(id)
            }
            return (
              <>
                {blank.length > 0 ? (
                  <>
                    <p className="ih-cf-warn">
                      Bạn còn <strong>{blank.length}</strong> câu chưa có đáp án:
                    </p>
                    <div className="ih-cf-nums">
                      {blank.map((q) => (
                        <button key={q.id} type="button" title="Về câu này" onClick={() => goto(q.id)}>
                          {numberOf.get(q.id)}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p>Bạn đã trả lời tất cả {questions.length} câu hỏi.</p>
                )}
                {flagged.length > 0 && (
                  <>
                    <p className="ih-cf-flag">
                      Có <strong>{flagged.length}</strong> câu bạn đã đánh dấu cờ để xem lại:
                    </p>
                    <div className="ih-cf-nums">
                      {flagged.map((q) => (
                        <button key={q.id} type="button" className="flag" title="Về câu này" onClick={() => goto(q.id)}>
                          {numberOf.get(q.id)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <p className="ih-cf-ask">Bạn có chắc chắn muốn nộp bài không? Sau khi nộp sẽ không sửa được đáp án.</p>
              </>
            )
          })()}
        </ConfirmDialog>
      )}

      {confirm === 'exit' && !submitted && (
        <ConfirmDialog
          title="Thoát khỏi bài thi?"
          confirmLabel="Thoát"
          cancelLabel="Ở lại làm bài"
          tone="danger"
          onCancel={() => setConfirm(null)}
          onConfirm={() => navigateIelts(router, listHref)}
        >
          <p>Đồng hồ vẫn tiếp tục chạy khi bạn thoát. Bạn có thể vào lại để làm tiếp nếu còn giờ, đáp án đã được tự lưu.</p>
        </ConfirmDialog>
      )}

      {pop?.kind === 'note' && <NotePopover rect={pop.rect} initial={pop.initial} isNew={!pop.hlId} onSave={saveNote} onDelete={deleteNoteHighlight} onClose={() => setPop(null)} />}
      {pop?.kind === 'lookup' && <LookupPopover rect={pop.rect} text={pop.text} onClose={() => setPop(null)} />}

      {floatSel && !pop && (
        <button
          type="button"
          className="ih-float-lookup"
          style={floatStyle(floatSel.rect)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setPop({ kind: 'lookup', rect: floatSel.rect, text: floatSel.text })
            setFloatSel(null)
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h10M4 11h7M4 16h5" />
            <path d="M17 8l1.2 2.8L21 12l-2.8 1.2L17 16l-1.2-2.8L13 12l2.8-1.2z" />
          </svg>
          TRA NGHĨA
        </button>
      )}
    </div>
  )
}

// Vị trí nút nổi Tra nghĩa: giữa phía trên vùng chọn (không đủ chỗ thì đặt phía dưới), kẹp trong màn hình.
function floatStyle(rect: DOMRect): React.CSSProperties {
  const left = Math.max(8, Math.min(rect.left + rect.width / 2 - 68, window.innerWidth - 148))
  const top = rect.top >= 64 ? rect.top - 48 : rect.bottom + 8
  return { left, top }
}

// **đậm** trong đề bài (vd "Choose **ONE WORD ONLY**") → <strong>.
function richText(text: string) {
  return text.split('**').map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>))
}

// Dạng Table Completion: thẻ có tiêu đề + bảng nhãn | nội dung; dòng {q} hiện câu hỏi (ô điền) tại chỗ.
// table.bullets = dạng Note Completion: cùng dữ liệu nhưng hiện thành danh sách gạch đầu dòng, không có bảng.
function TableGroup({ table, questions, renderQ }: { table: TableLayout; questions: PracticeQuestion[]; renderQ: (q: PracticeQuestion) => React.ReactNode }) {
  const byId = new Map(questions.map((q) => [q.id, q]))
  const renderLine = (line: string | { q: string }, i: number) => {
    if (typeof line === 'string') {
      return (
        <p key={i} className="ih-run-q-text">
          {line}
        </p>
      )
    }
    const q = byId.get(line.q)
    return q ? <Fragment key={line.q}>{renderQ(q)}</Fragment> : null
  }
  return (
    <div className="ih-run-table-card">
      {table.title && <h3 className="ih-run-table-title">{table.title}</h3>}
      {table.summary ? (
        table.rows.map((row, ri) => (
          <div key={ri} className="ih-run-summary">
            {row.lines.map(renderLine)}
          </div>
        ))
      ) : table.bullets ? (
        table.rows.map((row, ri) => (
          <Fragment key={ri}>
            {row.label && <h4 className="ih-run-notes-sub">{row.label}</h4>}
            <ul className="ih-run-notes">
              {row.lines.map((line, i) => (
                <li key={i}>{renderLine(line, i)}</li>
              ))}
            </ul>
          </Fragment>
        ))
      ) : (
        <table className="ih-run-table">
          {table.headers && (
            <thead>
              <tr>
                {table.headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri}>
                <th scope="row" className={row.labelLines ? 'rich' : undefined}>
                  {row.labelLines ? row.labelLines.map(renderLine) : row.label}
                </th>
                <td>{row.lines.map(renderLine)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// Dạng "match" (nối câu ↔ lựa chọn A/B/C/D): ma trận — 1 hàng tiêu đề chữ cái dùng chung, mỗi câu là 1
// hàng với ô check tròn ở đúng cột lựa chọn (giống bảng gốc), thay vì hàng nút tròn lặp lại từng câu.
function MatchGroup({
  legend,
  questions,
  numberOf,
  answers,
  onChange,
  reveal,
  locked,
  flags,
  onFlag,
  onActive,
}: {
  legend: { key: string; label: string }[]
  questions: PracticeQuestion[]
  numberOf: Map<string, number>
  answers: Record<string, string>
  onChange: (id: string, v: string) => void
  reveal: boolean
  locked: boolean
  flags: string[]
  onFlag: (id: string) => void
  onActive: (id: string) => void
}) {
  return (
    <div className="ih-match-table" style={{ gridTemplateColumns: `minmax(0, 1fr) repeat(${legend.length}, 56px)` }}>
      <div className="ih-match-head-cell" />
      {legend.map((m) => (
        <div key={m.key} className="ih-match-head-cell ih-match-col-head">
          {m.key}
        </div>
      ))}
      {questions.map((q) => {
        const value = answers[q.id] ?? ''
        const ok = reveal ? isCorrect(q, value) : null
        const num = numberOf.get(q.id) ?? 0
        const flagged = flags.includes(q.id)
        return (
          <Fragment key={q.id}>
            <div id={`ih-q-${q.id}`} className={`ih-match-stmt${flagged ? ' flagged' : ''}`} onClick={() => onActive(q.id)}>
              <span className="ih-run-q-num">{num}.</span>
              {q.prompt}
              <button
                type="button"
                className={`ih-run-bookmark${flagged ? ' on' : ''}`}
                title="Đánh dấu câu này để xem lại"
                aria-label="Đánh dấu câu này"
                aria-pressed={flagged}
                onClick={(e) => {
                  e.stopPropagation()
                  onFlag(q.id)
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill={flagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 4h10v17l-5-4-5 4z" />
                </svg>
              </button>
            </div>
            {legend.map((m) => {
              const selected = value === m.key
              const isAnswer = m.key === q.answer
              const cellState = reveal ? (isAnswer ? ' right' : selected ? ' wrong' : '') : selected ? ' selected' : ''
              return (
                <button
                  key={m.key}
                  type="button"
                  disabled={locked}
                  className={`ih-match-cell${cellState}`}
                  aria-label={`Câu ${num}: chọn ${m.key} — ${m.label}`}
                  onClick={() => {
                    onActive(q.id)
                    onChange(q.id, m.key)
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )
            })}
          </Fragment>
        )
      })}
    </div>
  )
}

// Dạng "bank" (chọn đáp án từ 1 danh sách dùng chung, kiểu kéo-thả trong đề gốc) — mỗi câu chỉ hiện 1 ô
// "Drop or Select"; bấm vào ô đó mở dropdown ngay tại chỗ để chọn nhanh. Danh sách đầy đủ (word bank)
// vẫn hiện 1 lần bên dưới, dùng làm cách chọn thay thế (bấm ô câu để "chọn nó đang active" rồi bấm 1
// mục trong bank) — không cần kéo-thả thật, chỉ mô phỏng lại tương tác bằng click.
// Dạng "Choose TWO letters" (type 'multi'): các câu trong nhóm dùng chung prompt + options, hiện thành 1 thẻ với
// các ô chọn (tối đa = số câu). Ô đã chọn được sắp theo thứ tự options rồi gán lần lượt cho từng câu — mỗi câu
// chấp nhận mọi đáp án đúng (answer + alt) nên điểm = số ô chọn đúng, không phụ thuộc thứ tự.
function MultiGroup({
  questions,
  numberOf,
  answers,
  onChange,
  reveal,
  locked,
  flags,
  onFlag,
  onActive,
}: {
  questions: PracticeQuestion[]
  numberOf: Map<string, number>
  answers: Record<string, string>
  onChange: (id: string, v: string) => void
  reveal: boolean
  locked: boolean
  flags: string[]
  onFlag: (id: string) => void
  onActive: (id: string) => void
}) {
  const q0 = questions[0]
  const opts = q0.options ?? []
  const picked = questions.map((q) => answers[q.id]).filter(Boolean)
  const correct = new Set([q0.answer, ...(q0.alt ?? [])])
  const flagged = flags.includes(q0.id)
  const first = numberOf.get(q0.id) ?? 0
  const last = numberOf.get(questions[questions.length - 1].id) ?? first

  function toggle(opt: string) {
    if (locked) return
    onActive(q0.id)
    const next = picked.includes(opt) ? picked.filter((p) => p !== opt) : picked.length < questions.length ? [...picked, opt] : picked
    const sorted = [...next].sort((a, b) => opts.indexOf(a) - opts.indexOf(b))
    questions.forEach((q, i) => onChange(q.id, sorted[i] ?? ''))
  }

  return (
    <div id={`ih-q-${q0.id}`} className={`ih-run-q${flagged ? ' flagged' : ''}`}>
      <p className="ih-run-q-text choice">
        <span className="ih-run-q-num">
          {first}-{last}.
        </span>
        {q0.prompt}
      </p>
      <div className="ih-run-radios" role="group" aria-label={`Câu ${first}-${last}`}>
        {opts.map((opt) => {
          const on = picked.includes(opt)
          const mark = reveal ? (correct.has(opt) ? ' right' : on ? ' wrong' : '') : ''
          return (
            <button key={opt} type="button" role="checkbox" aria-checked={on} disabled={locked} className={`ih-run-radio check${on ? ' selected' : ''}${mark}`} onClick={() => toggle(opt)}>
              <span className="ih-run-radio-dot" aria-hidden />
              {opt}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        className={`ih-run-bookmark${flagged ? ' on' : ''}`}
        title="Đánh dấu câu này để xem lại"
        aria-label="Đánh dấu câu này"
        aria-pressed={flagged}
        onClick={() => onFlag(q0.id)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill={flagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 4h10v17l-5-4-5 4z" />
        </svg>
      </button>
    </div>
  )
}

function BankGroup({
  bank,
  questions,
  numberOf,
  answers,
  onChange,
  reveal,
  locked,
  flags,
  onFlag,
  onActive,
}: {
  bank: string[]
  questions: PracticeQuestion[]
  numberOf: Map<string, number>
  answers: Record<string, string>
  onChange: (id: string, v: string) => void
  reveal: boolean
  locked: boolean
  flags: string[]
  onFlag: (id: string) => void
  onActive: (id: string) => void
}) {
  // openId = câu đang "active": vừa là câu có dropdown đang mở, vừa là đích gán khi bấm 1 mục trong
  // word bank bên dưới — 2 cách chọn (dropdown tại chỗ / bấm list bên dưới) dùng chung 1 trạng thái này.
  const [openId, setOpenId] = useState<string | null>(null)

  function toggle(id: string) {
    if (locked) return
    setOpenId((cur) => (cur === id ? null : id))
    onActive(id)
  }

  function assign(text: string) {
    if (locked) return
    const target = openId ?? questions.find((q) => !answers[q.id]?.trim())?.id ?? questions[0]?.id
    if (!target) return
    onChange(target, text)
    setOpenId(null)
  }

  return (
    <div className="ih-bank-group">
      {openId && <div className="ih-bank-backdrop" onClick={() => setOpenId(null)} />}
      {questions.map((q) => {
        const value = answers[q.id] ?? ''
        const ok = reveal ? isCorrect(q, value) : null
        const num = numberOf.get(q.id) ?? 0
        const flagged = flags.includes(q.id)
        const open = openId === q.id
        return (
          <div
            id={`ih-q-${q.id}`}
            key={q.id}
            className={`ih-bank-stmt${flagged ? ' flagged' : ''}${open ? ' picking' : ''}${ok === true ? ' correct' : ok === false ? ' wrong' : ''}`}
          >
            <div className="ih-run-q-text">
              <span className="ih-run-q-num">{num}.</span>
              {q.prompt}
              <span className="ih-bank-target-wrap">
                <button type="button" className={`ih-bank-target${value ? ' filled' : ''}`} disabled={locked} onClick={() => toggle(q.id)}>
                  {value || 'Drop or Select'}
                  <span className="ih-bank-target-caret" aria-hidden>
                    ▾
                  </span>
                </button>
                {open && (
                  <div className="ih-bank-dropdown" role="listbox">
                    {bank.map((text) => (
                      <button key={text} type="button" className={`ih-bank-dropdown-opt${text === value ? ' selected' : ''}`} onClick={() => assign(text)}>
                        {text}
                      </button>
                    ))}
                  </div>
                )}
              </span>
            </div>
            <button
              type="button"
              className={`ih-run-bookmark${flagged ? ' on' : ''}`}
              title="Đánh dấu câu này để xem lại"
              aria-label="Đánh dấu câu này"
              aria-pressed={flagged}
              onClick={(e) => {
                e.stopPropagation()
                onFlag(q.id)
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill={flagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 4h10v17l-5-4-5 4z" />
              </svg>
            </button>
          </div>
        )
      })}
      <p className="ih-bank-list-label">List of options{openId ? ' — bấm 1 mục để gán cho câu đang chọn' : ''}</p>
      <div className="ih-bank-list">
        {bank.map((text) => (
          <button key={text} type="button" className="ih-bank-opt" disabled={locked} onClick={() => assign(text)}>
            <span className="ih-bank-opt-handle" aria-hidden>
              ⋮⋮
            </span>
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

function QuestionRow({
  q,
  num,
  value,
  onChange,
  reveal,
  locked,
  flagged,
  inline,
  onActive,
  onFlag,
}: {
  q: PracticeQuestion
  num: number
  value: string
  onChange: (v: string) => void
  reveal: boolean
  locked: boolean
  flagged: boolean
  inline: boolean // nằm trong ô của bảng: gọn hơn, không viền
  onActive: () => void
  onFlag: () => void
}) {
  const ok = reveal ? isCorrect(q, value) : null
  const cls = `ih-run-q${ok === true ? ' correct' : ok === false ? ' wrong' : ''}${flagged ? ' flagged' : ''}${inline ? ' inline' : ''}`
  const isGap = q.type === 'gap-fill' || q.type === 'table'

  return (
    <div id={`ih-q-${q.id}`} className={cls} onFocusCapture={onActive} onClick={onActive}>
      {isGap ? (
        <p className="ih-run-q-text">
          {q.prompt.split('___').map((part, i, arr) => (
            <Fragment key={i}>
              {part}
              {i < arr.length - 1 && (
                <>
                  <span className="ih-run-q-num">{num}.</span>
                  <input className="ih-run-blank" value={value} disabled={locked} onChange={(e) => onChange(e.target.value)} aria-label={`Câu ${num}`} />
                </>
              )}
            </Fragment>
          ))}
        </p>
      ) : (
        <>
          <p className="ih-run-q-text choice">
            <span className="ih-run-q-num">{num}.</span>
            {q.prompt}
          </p>
          <div className="ih-run-radios" role="radiogroup" aria-label={`Câu ${num}`}>
            {(FIXED_CHOICES[q.type] ?? q.options ?? []).map((opt) => (
              <button key={opt} type="button" role="radio" aria-checked={value === opt} disabled={locked} className={`ih-run-radio${value === opt ? ' selected' : ''}`} onClick={() => onChange(opt)}>
                <span className="ih-run-radio-dot" aria-hidden />
                {opt === 'Not Given' ? 'Not given' : opt}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`ih-run-bookmark${flagged ? ' on' : ''}`}
            title="Đánh dấu câu này để xem lại"
            aria-label="Đánh dấu câu này"
            aria-pressed={flagged}
            onClick={(e) => {
              e.stopPropagation()
              onFlag()
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill={flagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 4h10v17l-5-4-5 4z" />
            </svg>
          </button>
        </>
      )}
      {ok === false && <p className="ih-run-answer">Đáp án: {q.answer}</p>}
    </div>
  )
}
