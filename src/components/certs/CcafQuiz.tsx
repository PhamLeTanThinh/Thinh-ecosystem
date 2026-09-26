'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export interface CcafQuestion {
  id: number
  question: string
  options: Record<string, string>
  answer: string
  explanation: string
  vn: { question: string; options: Record<string, string>; explanation: string }
  // Sơ đồ minh hoạ (đường dẫn trong /public), một số câu dựa vào hình để trả lời.
  image?: string
}

type Mode = 'all' | 'random20' | 'random50' | 'custom' | 'wrong' | 'unseen'

interface Progress {
  id: number
  correctCount: number
  wrongCount: number
  lastResult: 'correct' | 'wrong' | null
}

interface Attempt {
  id: string
  mode: string
  total: number
  correct: number
  wrongIds: number[]
  createdAt: string
}

const CERT_ID = 'ccaf'
const MODE_LABEL: Record<string, string> = {
  all: 'Tất cả',
  random20: 'Ngẫu nhiên 20',
  random50: 'Ngẫu nhiên 50',
  custom: 'Theo khoảng',
  wrong: 'Ôn câu sai',
  unseen: 'Câu chưa làm',
  retry: 'Luyện lại câu sai',
  topic: 'Theo chủ đề lý thuyết',
}
type Item = CcafQuestion & { letters: string[] }

const MODES: { id: Mode; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'random20', label: 'Ngẫu nhiên 20' },
  { id: 'random50', label: 'Ngẫu nhiên 50' },
  { id: 'custom', label: 'Theo khoảng' },
  { id: 'wrong', label: 'Ôn câu sai' },
  { id: 'unseen', label: 'Câu chưa làm' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Xáo thứ tự đáp án, gán lại nhãn A–D và map đáp án đúng theo nội dung.
function prepare(q: CcafQuestion): Item {
  const entries = shuffle(Object.entries(q.options))
  const options: Record<string, string> = {}
  const optionsVn: Record<string, string> = {}
  let answer = q.answer
  entries.forEach(([orig, text], i) => {
    const l = String.fromCharCode(65 + i)
    options[l] = text
    optionsVn[l] = q.vn.options[orig] ?? ''
    if (orig === q.answer) answer = l
  })
  return { ...q, options, answer, vn: { ...q.vn, options: optionsVn }, letters: Object.keys(options) }
}

export interface TheoryLink {
  id: string
  title: string
}

interface Props {
  questions: CcafQuestion[]
  // Chủ đề lý thuyết đang luyện (từ ?topic=): tự bắt đầu ngay với đúng các câu của chủ đề đó.
  initialTopic?: { id: string; title: string; ids: number[] }
  // Câu hỏi → chủ đề lý thuyết liên quan, để hiện link "Xem lý thuyết" sau khi chấm.
  theoryByQuestion?: Record<number, TheoryLink[]>
}

export function CcafQuiz({ questions, initialTopic, theoryByQuestion = {} }: Props) {
  const [mode, setMode] = useState<Mode>('all')
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(questions.length)
  const [vi, setVi] = useState(true)
  const [set, setSet] = useState<Item[] | null>(null)
  const [idx, setIdx] = useState(0)
  // picked = đáp án ĐÃ nộp (đã chấm, đã lưu DB); choice = đáp án đang chọn nhưng chưa bấm "Kiểm tra", đổi được thoải mái.
  const [picked, setPicked] = useState<Record<number, string>>({})
  const [choice, setChoice] = useState<Record<number, string>>({})
  const [done, setDone] = useState(false)
  const [emptyNote, setEmptyNote] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  // Bộ câu của lượt đang làm (để "Làm lại" chạy đúng bộ đó) + cờ tránh lưu trùng 1 lượt.
  const [runIds, setRunIds] = useState<number[]>([])
  const [runMode, setRunMode] = useState('all')
  const [saved, setSaved] = useState(false)
  // Tiến độ theo hồ sơ học (cookie learner_id). Chưa có hồ sơ thì rỗng và không lưu — vẫn làm bài bình thường.
  const [progress, setProgress] = useState<Map<number, Progress>>(new Map())

  useEffect(() => {
    // Vào từ nút "Luyện các câu về chủ đề" ở trang lý thuyết: bắt đầu luôn, khỏi qua màn chọn chế độ.
    if (initialTopic) start(initialTopic.ids, 'topic')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetch(`/api/certs/progress?cert=${CERT_ID}`)
      .then((r) => r.json() as Promise<Progress[]>)
      .then((rows) => setProgress(new Map(rows.map((p) => [p.id, p]))))
      .catch(() => {})
    fetch(`/api/certs/attempts?cert=${CERT_ID}`)
      .then((r) => r.json() as Promise<Attempt[]>)
      .then(setAttempts)
      .catch(() => {})
  }, [])

  function finish(items: Item[]) {
    setDone(true)
    if (saved) return
    setSaved(true)
    const wrongIds = items.filter((q, i) => picked[i] && picked[i] !== q.answer).map((q) => q.id)
    const correct = items.filter((q, i) => picked[i] === q.answer).length
    fetch('/api/certs/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Background': '1' },
      body: JSON.stringify({ cert: CERT_ID, mode: runMode, total: items.length, correct, wrongIds }),
    })
      .then((r) => (r.ok ? (r.json() as Promise<Attempt>) : null))
      .then((a) => a && setAttempts((prev) => [a, ...prev]))
      .catch(() => {})
  }

  function record(questionId: number, correct: boolean) {
    setProgress((prev) => {
      const next = new Map(prev)
      const cur = prev.get(questionId)
      next.set(questionId, {
        id: questionId,
        correctCount: (cur?.correctCount ?? 0) + (correct ? 1 : 0),
        wrongCount: (cur?.wrongCount ?? 0) + (correct ? 0 : 1),
        lastResult: correct ? 'correct' : 'wrong',
      })
      return next
    })
    fetch('/api/certs/progress', {
      method: 'POST',
      // X-Background: lưu nền, không bật màn hình loading (xem lib/loading/tracker.ts).
      headers: { 'Content-Type': 'application/json', 'X-Background': '1' },
      body: JSON.stringify({ cert: CERT_ID, questionId, correct }),
    }).catch(() => {})
  }

  const mastered = questions.filter((q) => progress.get(q.id)?.lastResult === 'correct').length
  const wrongNow = questions.filter((q) => progress.get(q.id)?.lastResult === 'wrong').length
  // Đếm theo bộ câu hiện có: progress có thể còn bản ghi của câu đã bị xoá khỏi đề.
  const unseen = questions.filter((q) => !progress.has(q.id)).length

  // ids: chạy đúng bộ câu này (luyện lại câu sai / làm lại); không có thì chọn theo `mode` đang chọn.
  function start(ids?: number[], modeOverride?: string) {
    let pool = questions
    if (ids) pool = questions.filter((q) => ids.includes(q.id))
    else {
    if (mode === 'wrong') pool = questions.filter((q) => progress.get(q.id)?.lastResult === 'wrong')
    else if (mode === 'unseen') pool = questions.filter((q) => !progress.has(q.id))
    if (mode === 'random20') pool = shuffle(questions).slice(0, 20)
    else if (mode === 'random50') pool = shuffle(questions).slice(0, 50)
    else if (mode === 'custom') {
      const lo = Math.min(from, to)
      const hi = Math.max(from, to)
      pool = questions.filter((q) => q.id >= lo && q.id <= hi)
      if (!pool.length) pool = questions
    }
    }
    if (!pool.length) {
      setEmptyNote(true)
      return
    }
    setEmptyNote(false)
    setRunIds(pool.map((q) => q.id))
    setRunMode(modeOverride ?? mode)
    setSaved(false)
    setSet(pool.map(prepare))
    setIdx(0)
    setPicked({})
    setChoice({})
    setDone(false)
    setConfirmExit(false)
  }

  const btn = 'rounded-pill border border-border px-4 py-2 text-sm font-semibold transition disabled:opacity-40'
  const primary = `${btn} border-accent bg-accent text-white`

  if (!set) {
    const N = questions.length
    const RING_C = 2 * Math.PI * 40
    const greenLen = (mastered / N) * RING_C
    const redLen = (wrongNow / N) * RING_C
    const donePct = Math.round((mastered / N) * 100)
    const inRange = questions.filter((q) => q.id >= Math.min(from, to) && q.id <= Math.max(from, to)).length
    const poolSize =
      mode === 'all' ? N
      : mode === 'random20' ? Math.min(20, N)
      : mode === 'random50' ? Math.min(50, N)
      : mode === 'custom' ? inRange || N
      : mode === 'wrong' ? wrongNow
      : unseen

    const MODE_INFO: Record<Mode, { icon: string; tile: string; desc: string }> = {
      all: { icon: '📚', tile: 'from-indigo-500/20 to-card-soft', desc: `Toàn bộ ${N} câu theo thứ tự` },
      random20: { icon: '🎲', tile: 'from-gold/25 to-card-soft', desc: '20 câu ngẫu nhiên, ôn nhanh' },
      random50: { icon: '🎯', tile: 'from-plum/20 to-card-soft', desc: '50 câu ngẫu nhiên, như một bài thi' },
      custom: { icon: '🔢', tile: 'from-violet-500/20 to-card-soft', desc: 'Chọn khoảng câu muốn luyện' },
      wrong: { icon: '🔁', tile: 'from-rose-500/20 to-card-soft', desc: `${wrongNow} câu đang sai ở lần gần nhất` },
      unseen: { icon: '✨', tile: 'from-teal-500/20 to-card-soft', desc: `${unseen} câu bạn chưa làm lần nào` },
    }

    return (
      <div className="grid gap-4 lg:h-full lg:grid-cols-5 lg:grid-rows-1">
        <div className="flex min-h-0 flex-col gap-4 rounded-card border border-border bg-card p-5 shadow-sm lg:col-span-3 lg:overflow-y-auto">
          {/* Tiến độ tổng: vòng tròn + 3 ô thống kê */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative h-24 w-24 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="11" className="stroke-card-soft" />
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="11" strokeLinecap="round" stroke="#f07aa0" strokeDasharray={`${redLen} ${RING_C}`} strokeDashoffset={-greenLen} />
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="11" strokeLinecap="round" stroke="#3f8a70" strokeDasharray={`${greenLen} ${RING_C}`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold leading-none">{donePct}%</span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">đã thuộc</span>
              </div>
            </div>
            <div className="grid w-full flex-1 grid-cols-3 gap-3">
              {[
                { n: mastered, label: 'Đã đúng', icon: '✓', box: 'bg-jade/10 border-jade/25', num: 'text-jade', chip: 'bg-jade text-white' },
                { n: wrongNow, label: 'Đang sai', icon: '✕', box: 'bg-rose-400/10 border-rose-400/25', num: 'text-rose-600', chip: 'bg-rose-400 text-white' },
                { n: unseen, label: 'Chưa làm', icon: '○', box: 'bg-accent-soft border-accent/25', num: 'text-accent', chip: 'bg-accent text-white' },
              ].map((s) => (
                <div key={s.label} className={`rounded-2xl border px-3 py-2.5 text-center ${s.box}`}>
                  <div className="flex items-center justify-center gap-2">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${s.chip}`}>{s.icon}</span>
                    <span className={`text-2xl font-extrabold leading-none ${s.num}`}>{s.n}</span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold">
              <span className="h-4 w-1 rounded-full bg-plum" /> Chọn chế độ luyện
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
              {MODES.map((m) => {
                const active = mode === m.id
                const info = MODE_INFO[m.id]
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`group relative flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      active ? 'border-accent bg-gradient-to-br from-accent-soft to-card shadow-sm ring-1 ring-accent/30' : 'border-border bg-card'
                    }`}
                  >
                    {active && <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">✓</span>}
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg ${info.tile}`}>{info.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-tight">{m.label}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted">{info.desc}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {mode === 'custom' && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-card-soft p-4 text-sm">
              <span className="font-semibold">Từ câu</span>
              <input type="number" min={1} max={N} value={from} onChange={(e) => setFrom(+e.target.value || 1)} className="w-24 rounded-xl border border-border bg-card px-3 py-2 text-center font-semibold" />
              <span className="font-semibold">đến</span>
              <input type="number" min={1} max={N} value={to} onChange={(e) => setTo(+e.target.value || N)} className="w-24 rounded-xl border border-border bg-card px-3 py-2 text-center font-semibold" />
              <span className="text-xs text-muted">({inRange || N} câu)</span>
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-gradient-to-r from-card-soft/60 to-transparent px-4 py-3">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <input type="checkbox" checked={vi} onChange={(e) => setVi(e.target.checked)} className="peer sr-only" />
              <span className="relative h-6 w-11 shrink-0 rounded-pill bg-border transition peer-checked:bg-plum after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
              Hiện bản dịch tiếng Việt
            </label>
            <button
              onClick={() => start()}
              disabled={poolSize === 0}
              className={`${primary} flex items-center gap-2 px-6 py-2.5 text-sm shadow-md shadow-midnight/20 hover:-translate-y-0.5 hover:shadow-lg`}
            >
              Bắt đầu luyện
              <span className="rounded-pill bg-white/25 px-2.5 py-0.5 text-xs font-bold">{poolSize} câu</span>
              <span>→</span>
            </button>
          </div>
          {emptyNote && <p className="-mt-3 text-sm font-medium text-rose-600">Không có câu nào thuộc chế độ này.</p>}
        </div>

        {/* Lịch sử luyện tập */}
        <div className="flex min-h-0 flex-col rounded-card border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="flex shrink-0 items-center justify-between text-sm font-bold">
            <span className="flex items-center gap-2"><span className="h-4 w-1 rounded-full bg-plum" /> Lịch sử luyện tập</span>
            <span className="rounded-pill bg-plum-soft px-3 py-1 text-xs font-bold text-plum">{attempts.length} lần</span>
          </h3>
          {attempts.length === 0 ? (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border px-4 py-8 text-center">
              <span className="text-4xl">🗂️</span>
              <p className="font-semibold">Chưa có lần luyện nào</p>
              <p className="text-xs leading-relaxed text-muted">Hoàn thành một lượt (bấm Kết thúc) để lưu điểm và các câu sai vào đây.</p>
            </div>
          ) : (
            <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto pr-1">
              {attempts.map((a, i) => {
                const rate = Math.round((a.correct / a.total) * 100)
                const good = rate >= 70
                return (
                  <div key={a.id} className={`relative shrink-0 overflow-hidden rounded-2xl border border-border p-3 pl-4 text-sm transition hover:shadow-md ${good ? 'bg-jade/5' : 'bg-rose-400/5'}`}>
                    <span className={`absolute inset-y-0 left-0 w-1.5 ${good ? 'bg-jade' : 'bg-rose-400'}`} />
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold">Lần {attempts.length - i}</span>
                      <span className={`rounded-pill px-2.5 py-0.5 text-xs font-bold ${good ? 'bg-jade/15 text-jade' : 'bg-rose-400/15 text-rose-600'}`}>{rate}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-black/10">
                      <div className={`h-full ${good ? 'bg-jade' : 'bg-rose-400'}`} style={{ width: `${rate}%` }} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs text-muted">
                      <span>{a.correct}/{a.total} câu · {MODE_LABEL[a.mode] ?? a.mode}</span>
                      <span>{new Date(a.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    {a.wrongIds.length > 0 && (
                      <button onClick={() => start(a.wrongIds, 'retry')} className={`${btn} mt-2 w-full bg-card px-3 py-1 text-xs hover:border-accent hover:text-accent`}>
                        🔁 Luyện lại {a.wrongIds.length} câu sai
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  const correctCount = set.filter((q, i) => picked[i] === q.answer).length

  if (done) {
    return (
      <div className="rounded-card border border-border bg-card p-5">
        <div className="text-3xl font-bold">{correctCount} / {set.length}</div>
        <div className="text-sm text-muted">{Math.round((correctCount / set.length) * 100)}% đúng</div>
        <div className="mt-4 flex max-h-96 flex-col gap-2 overflow-auto">
          {set.map((q, i) => {
            const ok = picked[i] === q.answer
            return (
              <button
                key={q.id}
                onClick={() => { setIdx(i); setDone(false) }}
                className={`rounded-lg border p-3 text-left text-sm ${ok ? 'border-jade/40 bg-jade/10' : 'border-rose-400/40 bg-rose-400/10'}`}
              >
                <div className="font-semibold">Q{q.id}. {q.question.slice(0, 140)}{q.question.length > 140 ? '…' : ''}</div>
                <div className="text-xs text-muted">{picked[i] ? `Bạn chọn ${picked[i]} — đáp án ${q.answer}` : `Chưa trả lời — đáp án ${q.answer}`}</div>
              </button>
            )
          })}
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={() => start(runIds, runMode)} className={primary}>Làm lại</button>
          {set.some((q, i) => picked[i] && picked[i] !== q.answer) && (
            <button
              onClick={() => start(set.filter((q, i) => picked[i] && picked[i] !== q.answer).map((q) => q.id), 'retry')}
              className={btn}
            >
              Luyện lại câu sai
            </button>
          )}
          <button onClick={() => setSet(null)} className={btn}>Đổi chế độ</button>
        </div>
      </div>
    )
  }

  const q = set[idx]
  const sel = picked[idx]
  const answeredCount = Object.keys(picked).length

  // Thoát về màn chọn chế độ. Chưa chấm câu nào thì thoát luôn; đã chấm rồi thì hỏi có lưu lần luyện này vào lịch sử không
  // (từng câu đã chấm thì luôn được lưu tiến trình, chỉ "lần luyện" là chưa ghi).
  function exit() {
    if (answeredCount === 0) setSet(null)
    else setConfirmExit(true)
  }
  const chosen = choice[idx]

  function submit() {
    if (!chosen || sel) return
    setPicked({ ...picked, [idx]: chosen })
    record(q.id, chosen === q.answer)
  }

  return (
    <div className="rounded-card border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span className="flex flex-wrap items-center gap-2">
          <span className="rounded-pill bg-accent px-3 py-1 text-xs font-bold text-white">Câu {idx + 1}/{set.length}</span>
          <span className="rounded-pill bg-card-soft px-2.5 py-1 font-semibold">#{q.id}</span>
          {progress.get(q.id) && <span className="rounded-pill border border-border px-2.5 py-1">từng: ✓{progress.get(q.id)!.correctCount} ✕{progress.get(q.id)!.wrongCount}</span>}
        </span>
        <span className="flex items-center gap-3">
          <span className="rounded-pill bg-jade/15 px-2.5 py-1 font-bold text-jade">✓ {correctCount}</span>
          <span className="rounded-pill bg-rose-400/15 px-2.5 py-1 font-bold text-rose-600">✕ {answeredCount - correctCount}</span>
          <button onClick={exit} className="rounded-pill border border-border px-3 py-1 text-xs font-semibold text-text transition hover:border-rose-400 hover:text-rose-600">
            ✕ Thoát
          </button>
        </span>
      </div>
      {confirmExit && (
        <div className="mb-4 rounded-lg border border-border bg-card-soft p-3 text-sm">
          <p className="font-semibold">Thoát khỏi lượt luyện này?</p>
          <p className="mt-1 text-xs text-muted">Các câu đã chấm ({answeredCount}) vẫn được lưu tiến trình. Chọn &quot;Lưu &amp; thoát&quot; để ghi cả lượt vào lịch sử luyện tập.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => { finish(set); setConfirmExit(false); setSet(null) }} className={`${primary} px-3 py-1.5 text-xs`}>Lưu &amp; thoát</button>
            <button onClick={() => { setConfirmExit(false); setSet(null) }} className={`${btn} px-3 py-1.5 text-xs`}>Thoát không lưu lượt</button>
            <button onClick={() => setConfirmExit(false)} className={`${btn} px-3 py-1.5 text-xs`}>Ở lại làm tiếp</button>
          </div>
        </div>
      )}
      <div className="mb-6 h-2 overflow-hidden rounded-pill bg-card-soft">
        <div className="h-full rounded-pill bg-gradient-to-r from-accent to-plum transition-all duration-500" style={{ width: `${((idx + 1) / set.length) * 100}%` }} />
      </div>
      <p className="text-lg font-semibold leading-relaxed">{q.question}</p>
      {vi && q.vn.question && <p className="mt-3 rounded-xl bg-card-soft/70 p-3 text-sm italic leading-relaxed text-muted">{q.vn.question}</p>}
      {q.image && (
        <a href={q.image} target="_blank" rel="noreferrer" className="mt-4 block overflow-hidden rounded-xl border border-border" title="Mở ảnh gốc">
          <img src={q.image} alt={`Sơ đồ câu ${q.id}`} className="w-full" />
        </a>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {q.letters.map((l) => {
          let cls = 'border-border bg-card hover:-translate-y-0.5 hover:border-accent hover:shadow-md'
          let badge = 'bg-card-soft text-accent'
          if (sel) {
            if (l === q.answer) {
              cls = 'border-jade/60 bg-jade/10 shadow-sm'
              badge = 'bg-jade text-white'
            } else if (l === sel) {
              cls = 'border-rose-400/60 bg-rose-400/10 shadow-sm'
              badge = 'bg-rose-400 text-white'
            } else cls = 'border-border opacity-50'
          } else if (l === chosen) {
            cls = 'border-accent bg-accent-soft shadow-md ring-1 ring-accent/40'
            badge = 'bg-accent text-white'
          }
          return (
            <button key={l} disabled={!!sel} onClick={() => setChoice({ ...choice, [idx]: l })} className={`flex items-start gap-4 rounded-2xl border p-4 text-left text-sm leading-relaxed transition ${cls}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${badge}`}>{sel && l === q.answer ? '✓' : sel && l === sel ? '✕' : l}</span>
              <span className="pt-1">
                {q.options[l]}
                {vi && q.vn.options[l] && <span className="mt-1 block italic text-muted">{q.vn.options[l]}</span>}
              </span>
            </button>
          )
        })}
      </div>

      {sel && (
        <div className={`mt-6 rounded-2xl border-l-4 p-5 text-sm leading-relaxed ${sel === q.answer ? 'border-jade bg-jade/10' : 'border-rose-400 bg-rose-400/10'}`}>
          <div className={`text-base font-bold ${sel === q.answer ? 'text-jade' : 'text-rose-600'}`}>{sel === q.answer ? '🎉 Chính xác!' : `✗ Chưa đúng — đáp án đúng là ${q.answer}`}</div>
          {q.explanation && <p className="mt-2">{q.explanation}</p>}
          {/* Câu chỉ có giải thích tiếng Việt thì luôn hiện, kể cả khi tắt bản dịch. */}
          {(vi || !q.explanation) && q.vn.explanation && <p className="mt-2 italic text-muted">{q.vn.explanation}</p>}
          {!q.explanation && !q.vn.explanation && <p className="mt-2 text-muted">Câu này chưa có giải thích.</p>}
          {(theoryByQuestion[q.id] ?? []).length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-black/10 pt-3 text-xs">
              <span className="font-semibold">📖 Xem lý thuyết:</span>
              {theoryByQuestion[q.id].map((t) => (
                <Link key={t.id} href={`/certs/ccaf/theory/${t.id}`} target="_blank" className="rounded-pill border border-border bg-card px-2.5 py-1 font-semibold text-accent hover:border-accent">
                  {t.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex justify-between border-t border-border pt-5">
        <button className={btn} disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← Trước</button>
        {sel ? (
          <button className={primary} onClick={() => (idx === set.length - 1 ? finish(set) : setIdx(idx + 1))}>
            {idx === set.length - 1 ? 'Kết thúc' : 'Tiếp →'}
          </button>
        ) : (
          <button className={`${primary} px-6 shadow-md shadow-midnight/20`} disabled={!chosen} onClick={submit}>
            Kiểm tra đáp án
          </button>
        )}
      </div>
    </div>
  )
}
