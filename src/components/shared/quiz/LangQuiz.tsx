'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { speak } from '@/lib/shared/speech'
import { POS_LABELS } from '@/components/shared/vocab/pos'
import { WordParts } from '@/components/shared/vocab/WordParts'
import type { ReviewCard, ReviewLessonGroup, ReviewProgress } from '@/components/shared/review/types'
import '../vocab/vocab-study.css'
import './quiz.css'

// Kiểm tra trắc nghiệm Korean / Chinese — cùng cách làm với kiểm tra chứng chỉ (components/certs/CertQuiz.tsx):
// - Màn thiết lập: vòng tiến độ + thống kê (đã đúng / đang sai / chưa làm), chọn chế độ (tất cả, ngẫu nhiên 20/50,
//   ôn câu sai, sai nhiều lần, câu chưa làm), dạng câu hỏi, lịch sử các lần làm (luyện lại câu sai của từng lần).
// - Làm bài: 4 đáp án A–D, chọn xong bấm "Kiểm tra đáp án" mới chấm (đổi ý được), chấm xong hiện giải thích (nghĩa,
//   phiên âm, ví dụ, cấu tạo từ); đi lại câu trước / sau; Thoát hỏi có lưu lượt vào lịch sử không.
// - Tổng kết: điểm + danh sách câu (bấm để xem lại), làm lại / luyện lại câu sai / đổi chế độ.
// Phím tắt: 1–4 hoặc A–D chọn · Enter kiểm tra / câu tiếp · ← → chuyển câu.
// Lịch sử lưu trong trình duyệt (localStorage) — tiến độ từng thẻ vẫn lưu theo hồ sơ học như cũ (onResult).

export type QuizType = 'word-meaning' | 'meaning-word' | 'word-reading' | 'mixed'
type Field = 'word' | 'meaning' | 'reading'
type Mode = 'all' | 'random20' | 'random50' | 'wrong' | 'mostWrong' | 'unseen'

interface Settings {
  mode: Mode
  type: QuizType
  kind: 'all' | 'vocab' | 'grammar'
  shuffle: boolean
  autoSpeak: boolean
}

const DEFAULT_SETTINGS: Settings = { mode: 'random20', type: 'word-meaning', kind: 'all', shuffle: true, autoSpeak: false }

interface Attempt {
  id: string
  mode: string
  label: string
  total: number
  correct: number
  wrongIds: string[]
  createdAt: string
}

interface Question {
  card: ReviewCard
  prompt: Field
  answer: Field
  options: string[] // A–D
  key: string // chữ cái đáp án đúng
}

const LETTERS = ['A', 'B', 'C', 'D']

const MODE_LABEL: Record<string, string> = {
  all: 'Tất cả',
  random20: 'Ngẫu nhiên 20',
  random50: 'Ngẫu nhiên 50',
  wrong: 'Ôn câu sai',
  mostWrong: 'Sai nhiều lần',
  unseen: 'Câu chưa làm',
  retry: 'Luyện lại câu sai',
}

const MODES: { id: Mode; icon: string; tone: string }[] = [
  { id: 'all', icon: '📚', tone: 'indigo' },
  { id: 'random20', icon: '🎲', tone: 'gold' },
  { id: 'random50', icon: '🎯', tone: 'plum' },
  { id: 'wrong', icon: '🔁', tone: 'rose' },
  { id: 'mostWrong', icon: '📉', tone: 'amber' },
  { id: 'unseen', icon: '✨', tone: 'teal' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

const valueOf = (c: ReviewCard, f: Field) => (f === 'reading' ? (c.reading ?? '') : c[f])

// 1 câu hỏi: dạng câu (mixed → bốc ngẫu nhiên dạng hợp lệ), 3 đáp án nhiễu cùng loại thẻ, ưu tiên thẻ trong phạm vi
// đang kiểm tra (cùng bài) rồi mới tới các thẻ khác; giá trị đáp án không trùng nhau.
function makeQuestion(card: ReviewCard, type: QuizType, types: QuizType[], scope: ReviewCard[], all: ReviewCard[]): Question {
  const usable = types.filter((t) => t !== 'mixed' && (t !== 'word-reading' || card.reading))
  const t = type === 'mixed' || !usable.includes(type) ? usable[Math.floor(Math.random() * usable.length)] : type
  const [prompt, answer]: [Field, Field] = t === 'meaning-word' ? ['meaning', 'word'] : t === 'word-reading' ? ['word', 'reading'] : ['word', 'meaning']
  const right = valueOf(card, answer)
  const seen = new Set([right, valueOf(card, prompt)])
  const distractors: string[] = []
  const candidates = [
    ...shuffle(scope.filter((c) => c.kind === card.kind)),
    ...shuffle(all.filter((c) => c.kind === card.kind)),
    ...shuffle(all),
  ]
  for (const c of candidates) {
    if (distractors.length >= 3) break
    const v = valueOf(c, answer)
    if (!v || seen.has(v)) continue
    seen.add(v)
    distractors.push(v)
  }
  const options = shuffle([right, ...distractors])
  return { card, prompt, answer, options, key: LETTERS[options.indexOf(right)] }
}

const FIELD_LABEL: Record<Field, string> = { word: 'từ', meaning: 'nghĩa', reading: 'phiên âm' }

export function LangQuiz({
  appHref,
  storageKey,
  lang,
  eyebrow,
  cards,
  lessonGroups,
  preset,
  types,
  progressOf,
  onResult,
}: {
  appHref: string
  storageKey: string
  lang: string
  eyebrow: string
  cards: ReviewCard[]
  lessonGroups: ReviewLessonGroup[]
  preset: { label: string; filter: (c: ReviewCard) => boolean } | null
  types: { id: QuizType; label: string }[]
  progressOf: (id: string) => ReviewProgress | undefined
  onResult: (id: string, result: 'correct' | 'wrong') => void
}) {
  const router = useRouter()
  const counts = useMemo(() => {
    const m = new Map<number, number>()
    for (const c of cards) m.set(c.lesson, (m.get(c.lesson) ?? 0) + 1)
    return m
  }, [cards])

  // Trang chỉ render component này sau khi store đã nạp (client) nên đọc localStorage ngay lúc khởi tạo được
  const [settings, setSettings] = useState<Settings>(() => ({ ...DEFAULT_SETTINGS, ...load<Partial<Settings>>(storageKey, {}) }))
  const [history, setHistory] = useState<Attempt[]>(() => load<Attempt[]>(`${storageKey}-history`, []))
  const [lessons, setLessons] = useState<Set<number>>(
    () => new Set(lessonGroups.flatMap((g) => g.lessons.map((l) => l.lesson)).filter((n) => (counts.get(n) ?? 0) > 0)),
  )
  const [set, setSet] = useState<Question[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [choice, setChoice] = useState<Record<number, string>>({}) // đang chọn, chưa chấm
  const [picked, setPicked] = useState<Record<number, string>>({}) // đã chấm
  const [done, setDone] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)
  const [run, setRun] = useState({ ids: [] as string[], mode: 'all', saved: false })
  const [emptyNote, setEmptyNote] = useState(false)

  const typeIds = types.map((t) => t.id)
  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])
  const scope = useMemo(
    () => cards.filter((c) => (preset ? preset.filter(c) : lessons.has(c.lesson)) && (settings.kind === 'all' || c.kind === settings.kind)),
    [cards, preset, lessons, settings.kind],
  )
  const hasGrammar = useMemo(() => cards.some((c) => c.kind === 'grammar' && (!preset || preset.filter(c))), [cards, preset])

  function update(patch: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      save(storageKey, next)
      return next
    })
  }

  const stats = useMemo(() => {
    let mastered = 0
    let wrong = 0
    let unseen = 0
    let everWrong = 0
    for (const c of scope) {
      const p = progressOf(c.id)
      if (!p || p.lastResult === null) unseen++
      else if (p.lastResult === 'correct') mastered++
      else wrong++
      if ((p?.wrongCount ?? 0) > 0) everWrong++
    }
    return { mastered, wrong, unseen, everWrong }
  }, [scope, progressOf])

  function poolFor(mode: Mode): ReviewCard[] {
    const ordered = [...scope].sort((a, b) => a.lesson - b.lesson || a.sortOrder - b.sortOrder)
    const maybeShuffle = (l: ReviewCard[]) => (settings.shuffle ? shuffle(l) : l)
    if (mode === 'random20') return shuffle(ordered).slice(0, 20)
    if (mode === 'random50') return shuffle(ordered).slice(0, 50)
    if (mode === 'wrong') return maybeShuffle(ordered.filter((c) => progressOf(c.id)?.lastResult === 'wrong'))
    if (mode === 'unseen') return maybeShuffle(ordered.filter((c) => !progressOf(c.id) || progressOf(c.id)?.lastResult === null))
    if (mode === 'mostWrong')
      return ordered.filter((c) => (progressOf(c.id)?.wrongCount ?? 0) > 0).sort((a, b) => (progressOf(b.id)?.wrongCount ?? 0) - (progressOf(a.id)?.wrongCount ?? 0))
    return maybeShuffle(ordered)
  }

  const poolSize = (m: Mode) =>
    m === 'random20' ? Math.min(20, scope.length) : m === 'random50' ? Math.min(50, scope.length) : m === 'wrong' ? stats.wrong : m === 'mostWrong' ? stats.everWrong : m === 'unseen' ? stats.unseen : scope.length

  // ids: chạy đúng bộ thẻ này (làm lại / luyện lại câu sai); không có thì lấy theo chế độ đang chọn
  function start(ids?: string[], modeOverride?: string) {
    const pool = ids ? ids.map((id) => byId.get(id)).filter((c): c is ReviewCard => !!c) : poolFor(settings.mode)
    if (pool.length === 0) {
      setEmptyNote(true)
      return
    }
    setEmptyNote(false)
    setSet(pool.map((c) => makeQuestion(c, settings.type, typeIds, scope.length >= 4 ? scope : cards, cards)))
    setRun({ ids: pool.map((c) => c.id), mode: modeOverride ?? settings.mode, saved: false })
    setIdx(0)
    setChoice({})
    setPicked({})
    setDone(false)
    setConfirmExit(false)
  }

  function finish(items: Question[]) {
    setDone(true)
    if (run.saved) return
    setRun((r) => ({ ...r, saved: true }))
    const attempt: Attempt = {
      id: `${Date.now()}`,
      mode: run.mode,
      label: preset?.label ?? `${lessons.size} bài`,
      total: items.length,
      correct: items.filter((q, i) => picked[i] === q.key).length,
      wrongIds: items.filter((q, i) => picked[i] && picked[i] !== q.key).map((q) => q.card.id),
      createdAt: new Date().toISOString(),
    }
    setHistory((prev) => {
      const next = [attempt, ...prev].slice(0, 50)
      save(`${storageKey}-history`, next)
      return next
    })
  }

  const q = set && !done ? set[idx] : undefined
  const sel = picked[idx]
  const chosen = choice[idx]

  function submit() {
    if (!q || !chosen || sel) return
    setPicked((p) => ({ ...p, [idx]: chosen }))
    onResult(q.card.id, chosen === q.key ? 'correct' : 'wrong')
  }
  function next() {
    if (!set) return
    if (idx === set.length - 1) finish(set)
    else setIdx(idx + 1)
  }

  // Tự phát âm từ khi câu hỏi hiện ra (nếu đề là từ) hoặc khi vừa chấm (đề là nghĩa)
  useEffect(() => {
    if (!q || !settings.autoSpeak) return
    if (q.prompt === 'word' ? !sel : !!sel) speak(q.card.word, lang)
  }, [q, sel, settings.autoSpeak, lang])

  // Phím tắt
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!q || e.ctrlKey || e.metaKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, select')) return
      const k = e.key.toUpperCase()
      const pos = ['1', '2', '3', '4'].indexOf(k) >= 0 ? Number(k) - 1 : LETTERS.indexOf(k)
      if (pos >= 0 && pos < q.options.length && !sel) setChoice((c) => ({ ...c, [idx]: LETTERS[pos] }))
      else if (e.key === 'Enter') {
        e.preventDefault()
        if (sel) next()
        else submit()
      } else if (e.key === 'ArrowLeft' && idx > 0) setIdx(idx - 1)
      else if (e.key === 'ArrowRight' && sel) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  function goBack() {
    if (window.history.length > 1) router.back()
    else router.push(appHref)
  }

  // ── Thiết lập ──
  if (!set) {
    const N = scope.length || 1
    const C = 2 * Math.PI * 40
    const green = (stats.mastered / N) * C
    const red = (stats.wrong / N) * C
    const MODE_DESC: Record<Mode, string> = {
      all: `Toàn bộ ${scope.length} thẻ${settings.shuffle ? ', xáo thứ tự' : ' theo thứ tự bài'}`,
      random20: '20 câu ngẫu nhiên, ôn nhanh',
      random50: '50 câu ngẫu nhiên, như một bài thi',
      wrong: `${stats.wrong} câu đang sai ở lần gần nhất`,
      mostWrong: `${stats.everWrong} câu từng sai, sai nhiều lên đầu`,
      unseen: `${stats.unseen} câu bạn chưa làm lần nào`,
    }
    const size = poolSize(settings.mode)
    return (
      <div className="lq">
        <button type="button" className="lq-link" onClick={goBack}>
          ‹ Quay lại
        </button>
        <p className="lq-eyebrow">{eyebrow}</p>
        <h1 className="lq-title">{preset ? preset.label : 'Kiểm tra trắc nghiệm'}</h1>

        <div className="lq-setup">
          <div className="lq-panel lq-main">
            <div className="lq-overview">
              <div className="lq-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="lq-ring-bg" />
                  <circle cx="50" cy="50" r="40" className="lq-ring-bad" strokeDasharray={`${red} ${C}`} strokeDashoffset={-green} />
                  <circle cx="50" cy="50" r="40" className="lq-ring-ok" strokeDasharray={`${green} ${C}`} />
                </svg>
                <span>
                  <b>{Math.round((stats.mastered / N) * 100)}%</b>
                  <small>đã thuộc</small>
                </span>
              </div>
              <div className="lq-stat-row">
                <div className="lq-stat ok">
                  <b>{stats.mastered}</b>
                  <span>Đã đúng</span>
                </div>
                <div className="lq-stat bad">
                  <b>{stats.wrong}</b>
                  <span>Đang sai</span>
                </div>
                <div className="lq-stat">
                  <b>{stats.unseen}</b>
                  <span>Chưa làm</span>
                </div>
              </div>
            </div>

            <h3 className="lq-h3">Chọn chế độ luyện</h3>
            <div className="lq-modes">
              {MODES.map((m) => (
                <button key={m.id} type="button" className={`lq-mode${settings.mode === m.id ? ' on' : ''}`} onClick={() => update({ mode: m.id })}>
                  <span className={`lq-mode-icon ${m.tone}`}>{m.icon}</span>
                  <span>
                    <b>{MODE_LABEL[m.id]}</b>
                    <small>{MODE_DESC[m.id]}</small>
                  </span>
                </button>
              ))}
            </div>

            <h3 className="lq-h3">Dạng câu hỏi</h3>
            <div className="lq-seg">
              {types.map((t) => (
                <button key={t.id} type="button" className={settings.type === t.id ? 'on' : ''} onClick={() => update({ type: t.id })}>
                  {t.label}
                </button>
              ))}
            </div>
            {hasGrammar && (
              <>
                <h3 className="lq-h3">Loại thẻ</h3>
                <div className="lq-seg">
                  {(
                    [
                      ['all', 'Tất cả'],
                      ['vocab', '📚 Từ vựng'],
                      ['grammar', '✏️ Ngữ pháp'],
                    ] as const
                  ).map(([k, label]) => (
                    <button key={k} type="button" className={settings.kind === k ? 'on' : ''} onClick={() => update({ kind: k })}>
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {!preset && <LessonPicker groups={lessonGroups} counts={counts} selected={lessons} onChange={setLessons} />}

            <div className="lq-start-bar">
              <div className="lq-toggles">
                <Toggle checked={settings.shuffle} onChange={(v) => update({ shuffle: v })} label="Xáo thứ tự câu" />
                <Toggle checked={settings.autoSpeak} onChange={(v) => update({ autoSpeak: v })} label="Tự phát âm" />
              </div>
              <button type="button" className="lq-btn lq-primary lq-start" disabled={size === 0} onClick={() => start()}>
                Bắt đầu luyện <span className="lq-count">{size} câu</span> →
              </button>
            </div>
            {emptyNote && <p className="lq-empty">Không có câu nào thuộc chế độ này.</p>}
          </div>

          {/* Lịch sử luyện tập */}
          <div className="lq-panel lq-history">
            <h3 className="lq-h3 lq-history-head">
              Lịch sử luyện tập <span className="lq-pill">{history.length} lần</span>
            </h3>
            {history.length === 0 ? (
              <div className="lq-history-empty">
                <span>🗂️</span>
                <b>Chưa có lần luyện nào</b>
                <small>Hoàn thành một lượt (bấm Kết thúc) để lưu điểm và các câu sai vào đây.</small>
              </div>
            ) : (
              <div className="lq-history-list">
                {history.map((a, i) => {
                  const rate = Math.round((a.correct / a.total) * 100)
                  const good = rate >= 70
                  return (
                    <div key={a.id} className={`lq-attempt ${good ? 'ok' : 'bad'}`}>
                      <div className="lq-attempt-top">
                        <b>Lần {history.length - i}</b>
                        <span className="lq-rate">{rate}%</span>
                      </div>
                      <div className="lq-bar">
                        <span style={{ width: `${rate}%` }} />
                      </div>
                      <div className="lq-attempt-meta">
                        <span>
                          {a.correct}/{a.total} câu · {MODE_LABEL[a.mode] ?? a.mode} · {a.label}
                        </span>
                        <span>{new Date(a.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                      {a.wrongIds.length > 0 && (
                        <button type="button" className="lq-btn lq-small" onClick={() => start(a.wrongIds, 'retry')}>
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
      </div>
    )
  }

  const correctCount = set.filter((qq, i) => picked[i] === qq.key).length
  const answered = Object.keys(picked).length

  // ── Tổng kết ──
  if (done) {
    const wrongIds = set.filter((qq, i) => picked[i] && picked[i] !== qq.key).map((qq) => qq.card.id)
    return (
      <div className="lq">
        <div className="lq-panel lq-done">
          <div className="lq-score">
            {correctCount} / {set.length}
          </div>
          <div className="lq-muted">{Math.round((correctCount / set.length) * 100)}% đúng</div>
          <div className="lq-done-list">
            {set.map((qq, i) => {
              const ok = picked[i] === qq.key
              const right = qq.options[LETTERS.indexOf(qq.key)]
              return (
                <button
                  key={i}
                  type="button"
                  className={`lq-done-item ${ok ? 'ok' : 'bad'}`}
                  onClick={() => {
                    setIdx(i)
                    setDone(false)
                  }}
                >
                  <b lang={qq.prompt === 'word' ? lang : undefined}>
                    {i + 1}. {valueOf(qq.card, qq.prompt)}
                  </b>
                  <small>
                    {picked[i]
                      ? `Bạn chọn ${picked[i]}${ok ? '' : ` — đáp án ${qq.key}. ${right}`}`
                      : `Chưa trả lời — đáp án ${qq.key}. ${right}`}
                  </small>
                </button>
              )
            })}
          </div>
          <div className="lq-done-actions">
            <button type="button" className="lq-btn lq-primary" onClick={() => start(run.ids, run.mode)}>
              Làm lại
            </button>
            {wrongIds.length > 0 && (
              <button type="button" className="lq-btn" onClick={() => start(wrongIds, 'retry')}>
                Luyện lại câu sai
              </button>
            )}
            <button type="button" className="lq-btn" onClick={() => setSet(null)}>
              Đổi chế độ
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!q) return null
  const isRight = sel === q.key
  const p = progressOf(q.card.id)
  const promptValue = valueOf(q.card, q.prompt)

  // ── Làm bài ──
  return (
    <div className="lq">
      <div className="lq-panel lq-question">
        <div className="lq-q-top">
          <span className="lq-q-tags">
            <span className="lq-pill lq-pill-solid">
              Câu {idx + 1}/{set.length}
            </span>
            <span className="lq-pill">{q.card.kind === 'grammar' ? '✏️ Ngữ pháp' : '📚 Từ vựng'}</span>
            {p && (p.correctCount > 0 || p.wrongCount > 0) && (
              <span className="lq-pill lq-pill-outline">
                từng: ✓{p.correctCount} ✕{p.wrongCount}
              </span>
            )}
          </span>
          <span className="lq-q-tags">
            <span className="lq-pill ok">✓ {correctCount}</span>
            <span className="lq-pill bad">✕ {answered - correctCount}</span>
            <button type="button" className="lq-pill lq-exit" onClick={() => (answered === 0 ? setSet(null) : setConfirmExit(true))}>
              ✕ Thoát
            </button>
          </span>
        </div>
        {confirmExit && (
          <div className="lq-confirm">
            <b>Thoát khỏi lượt luyện này?</b>
            <p>Các câu đã chấm ({answered}) vẫn được lưu tiến trình. Chọn &quot;Lưu &amp; thoát&quot; để ghi cả lượt vào lịch sử luyện tập.</p>
            <div>
              <button
                type="button"
                className="lq-btn lq-primary lq-small"
                onClick={() => {
                  finish(set)
                  setConfirmExit(false)
                  setSet(null)
                }}
              >
                Lưu &amp; thoát
              </button>
              <button
                type="button"
                className="lq-btn lq-small"
                onClick={() => {
                  setConfirmExit(false)
                  setSet(null)
                }}
              >
                Thoát không lưu lượt
              </button>
              <button type="button" className="lq-btn lq-small" onClick={() => setConfirmExit(false)}>
                Ở lại làm tiếp
              </button>
            </div>
          </div>
        )}
        <div className="lq-bar lq-progress">
          <span style={{ width: `${((idx + 1) / set.length) * 100}%` }} />
        </div>

        <p className="lq-ask">Chọn {FIELD_LABEL[q.answer]} đúng của {FIELD_LABEL[q.prompt]} sau:</p>
        <div className="lq-prompt">
          <span className={q.prompt === 'meaning' ? 'lq-prompt-meaning' : 'lq-prompt-word'} lang={q.prompt === 'word' ? lang : undefined}>
            {promptValue}
          </span>
          {q.prompt === 'word' && (
            <button type="button" className="lq-speak" aria-label="Phát âm" onClick={() => speak(q.card.word, lang)}>
              🔊
            </button>
          )}
        </div>

        <div className="lq-options">
          {q.options.map((opt, i) => {
            const l = LETTERS[i]
            let cls = ''
            if (sel) cls = l === q.key ? 'right' : l === sel ? 'wrong' : 'dim'
            else if (chosen === l) cls = 'chosen'
            return (
              <button key={l} type="button" disabled={!!sel} className={`lq-option ${cls}`} onClick={() => setChoice((c) => ({ ...c, [idx]: l }))}>
                <span className="lq-letter">{sel && l === q.key ? '✓' : sel && l === sel ? '✕' : l}</span>
                <span className={q.answer === 'word' ? 'lq-option-word' : ''} lang={q.answer === 'word' ? lang : undefined}>
                  {opt}
                </span>
              </button>
            )
          })}
        </div>

        {/* Thanh nút ngay dưới đáp án, giải thích hiện bên dưới — nút Kiểm tra / Tiếp luôn ở cùng 1 chỗ */}
        <div className="lq-nav">
          <button type="button" className="lq-btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
            ← Trước
          </button>
          {sel ? (
            <button type="button" className="lq-btn lq-primary" onClick={next}>
              {idx === set.length - 1 ? 'Kết thúc' : 'Tiếp →'}
            </button>
          ) : (
            <button type="button" className="lq-btn lq-primary lq-submit" disabled={!chosen} onClick={submit}>
              Kiểm tra đáp án
            </button>
          )}
        </div>
        {sel && (
          <div className={`lq-explain ${isRight ? 'ok' : 'bad'}`}>
            <div className="lq-explain-head">{isRight ? '🎉 Chính xác!' : `✗ Chưa đúng — đáp án đúng là ${q.key}`}</div>
            <CardInfo card={q.card} lang={lang} />
          </div>
        )}

        <p className="lq-keys">
          <kbd>1</kbd>–<kbd>4</kbd> chọn · <kbd>Enter</kbd> kiểm tra / câu tiếp · <kbd>←</kbd> <kbd>→</kbd> chuyển câu
        </p>
      </div>
    </div>
  )
}

// Phần giải thích sau khi chấm: đủ thông tin của thẻ (từ, phiên âm, từ loại, nghĩa, ghi chú, ví dụ, cấu tạo từ)
function CardInfo({ card, lang }: { card: ReviewCard; lang: string }) {
  return (
    <div className="lq-info">
      <div className="lq-info-main">
        {card.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.image} alt="" />
        )}
        <div>
          <p className="lq-info-word">
            <span lang={lang}>{card.word}</span>
            <button type="button" className="lq-speak" aria-label="Phát âm" onClick={() => speak(card.word, lang)}>
              🔊
            </button>
            {card.reading && <span className="lq-info-reading">{card.reading}</span>}
            {card.pos?.map((p) => (
              <span key={p} className={`vs-pos vs-pos-${p}`}>
                {POS_LABELS[p] ?? p}
              </span>
            ))}
          </p>
          <p className="lq-info-meaning">{card.meaning}</p>
          {card.sub && <p className="lq-info-sub">{card.sub}</p>}
        </div>
      </div>
      {card.example && (
        <div className="lq-info-example">
          <p lang={lang}>
            <button type="button" className="lq-speak lq-speak-sm" aria-label="Đọc câu ví dụ" onClick={() => speak(card.example!, lang)}>
              🔊
            </button>
            {card.example}
          </p>
          {card.exampleReading && <p className="lq-info-reading">{card.exampleReading}</p>}
          {card.exampleVi && <p className="lq-info-vi">{card.exampleVi}</p>}
        </div>
      )}
      {card.parts && <WordParts parts={card.parts} lang={lang} />}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="lq-toggle">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="lq-switch" aria-hidden="true" />
      {label}
    </label>
  )
}

function LessonPicker({
  groups,
  counts,
  selected,
  onChange,
}: {
  groups: ReviewLessonGroup[]
  counts: Map<number, number>
  selected: Set<number>
  onChange: (s: Set<number>) => void
}) {
  const all = groups.flatMap((g) => g.lessons.map((l) => l.lesson)).filter((n) => (counts.get(n) ?? 0) > 0)
  const allOn = all.length > 0 && all.every((n) => selected.has(n))
  const toggle = (ns: number[], on: boolean) => {
    const next = new Set(selected)
    for (const n of ns) {
      if (on) next.add(n)
      else next.delete(n)
    }
    onChange(next)
  }
  return (
    <>
      <h3 className="lq-h3 lq-picker-head">
        Bài học ({selected.size})
        <button type="button" className="lq-link" onClick={() => toggle(all, !allOn)}>
          {allOn ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        </button>
      </h3>
      <div className="lq-picker">
        {groups.map((g) => {
          const ns = g.lessons.map((l) => l.lesson).filter((n) => (counts.get(n) ?? 0) > 0)
          if (ns.length === 0) return null
          const groupOn = ns.every((n) => selected.has(n))
          return (
            <div key={g.label} className="lq-picker-group">
              <button type="button" className="lq-picker-level" onClick={() => toggle(ns, !groupOn)}>
                <span className={`lq-check${groupOn ? ' on' : ''}`} />
                {g.label}
              </button>
              <div className="lq-picker-items">
                {g.lessons.map((l) => {
                  const n = counts.get(l.lesson) ?? 0
                  if (n === 0) return null
                  const on = selected.has(l.lesson)
                  return (
                    <button key={l.lesson} type="button" className={`lq-picker-item${on ? ' on' : ''}`} onClick={() => toggle([l.lesson], !on)} title={l.title}>
                      <span className={`lq-check${on ? ' on' : ''}`} />
                      <span className="lq-picker-badge">{l.badge}</span>
                      <span className="lq-picker-title">{l.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
