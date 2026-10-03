'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { speak } from '@/lib/shared/speech'
import { ReviewFlashCard } from './ReviewFlashCard'
import { buildQueue, priorityOf } from './schedule'
import { DEFAULT_REVIEW_SETTINGS, type ReviewCard, type ReviewLessonGroup, type ReviewProgress, type ReviewSettings } from './types'
import '../vocab/vocab-study.css'
import './review.css'

// Ôn tập thẻ (Korean + Chinese). 3 bước: thiết lập → phiên ôn → tổng kết.
// - Thứ tự "Thông minh": thẻ lần trước sai → thẻ chưa ôn → thẻ đã thuộc ôn lâu nhất (schedule.ts), mỗi phiên giới hạn số thẻ.
// - Thẻ "Chưa thuộc" quay lại sau vài thẻ trong cùng phiên; có hoàn tác lần chấm vừa rồi (trả lại cả tiến độ đã lưu).
// - Desktop: Space/Enter lật · ← hoặc 1 chưa thuộc · → hoặc 2 đã thuộc · Backspace/Z hoàn tác.
// Vào từ 1 bài / 1 bộ (preset) thì bắt đầu ngay với thiết lập đã lưu, đổi được qua "⚙ Tuỳ chọn".
interface Preset {
  label: string
  filter: (c: ReviewCard) => boolean
}

interface Snapshot {
  queue: string[]
  index: number
  tally: { correct: number; wrong: number }
  missed: string[]
  cardId: string
  prev: ReviewProgress | undefined
}

const REQUEUE_GAP = 4 // thẻ sai quay lại sau chừng này thẻ
const LIMITS = [10, 20, 50, 0]

function loadSettings(key: string): ReviewSettings {
  try {
    return { ...DEFAULT_REVIEW_SETTINGS, ...(JSON.parse(localStorage.getItem(key) ?? '{}') as Partial<ReviewSettings>) }
  } catch {
    return DEFAULT_REVIEW_SETTINGS
  }
}

export function ReviewApp({
  appHref,
  storageKey,
  lang,
  eyebrow,
  cards,
  lessonGroups,
  preset,
  readingLabel,
  progressOf,
  onResult,
  onUndo,
}: {
  appHref: string
  storageKey: string
  lang: string
  eyebrow: string
  cards: ReviewCard[]
  lessonGroups: ReviewLessonGroup[]
  preset: Preset | null
  readingLabel?: string // có phiên âm riêng (pinyin) → thêm tuỳ chọn hiện ở mặt trước
  progressOf: (id: string) => ReviewProgress | undefined
  onResult: (id: string, result: 'correct' | 'wrong') => void
  onUndo: (id: string, prev: ReviewProgress | undefined) => void
}) {
  const router = useRouter()
  const countByLesson = useMemo(() => {
    const m = new Map<number, number>()
    for (const c of cards) m.set(c.lesson, (m.get(c.lesson) ?? 0) + 1)
    return m
  }, [cards])

  // Trang chỉ render component này sau khi store đã nạp (client) nên đọc localStorage ngay lúc khởi tạo được
  const [init] = useState(() => {
    const settings = loadSettings(storageKey)
    const lessons = new Set(lessonGroups.flatMap((g) => g.lessons.map((l) => l.lesson)).filter((n) => (countByLesson.get(n) ?? 0) > 0))
    const pool = poolOf(cards, preset, lessons, settings, progressOf)
    return { settings, lessons, queue: preset ? buildQueue(pool, progressOf, settings.order, settings.limit) : [] }
  })
  const [settings, setSettings] = useState(init.settings)
  const [lessons, setLessons] = useState<Set<number>>(init.lessons)
  const [phase, setPhase] = useState<'setup' | 'session' | 'summary'>(preset ? 'session' : 'setup')
  const [queue, setQueue] = useState<string[]>(init.queue)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [tally, setTally] = useState({ correct: 0, wrong: 0 })
  const [missed, setMissed] = useState<string[]>([]) // thẻ đã chấm "chưa thuộc" ít nhất 1 lần trong phiên
  const [history, setHistory] = useState<Snapshot[]>([])
  // Bản sao thẻ vừa chấm, bay ra trên thẻ mới (chỉ là hiệu ứng, không chặn thao tác)
  const [ghost, setGhost] = useState<{ key: number; card: ReviewCard; flipped: boolean; dir: 'left' | 'right'; fromX: number } | null>(null)
  useEffect(() => {
    if (!ghost) return
    const t = setTimeout(() => setGhost(null), 320)
    return () => clearTimeout(t)
  }, [ghost])

  const byId = useMemo(() => new Map(cards.map((c) => [c.id, c])), [cards])
  const pool = useMemo(() => poolOf(cards, preset, lessons, settings, progressOf), [cards, preset, lessons, settings, progressOf])
  const hasGrammar = useMemo(() => cards.some((c) => c.kind === 'grammar' && (!preset || preset.filter(c))), [cards, preset])

  function update(patch: Partial<ReviewSettings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  function start(ids?: string[]) {
    setQueue(ids ?? buildQueue(pool, progressOf, settings.order, settings.limit))
    setIndex(0)
    setFlipped(false)
    setTally({ correct: 0, wrong: 0 })
    setMissed([])
    setHistory([])
    setPhase('session')
  }

  const card = phase === 'session' ? byId.get(queue[index]) : undefined

  const answer = useCallback(
    (result: 'correct' | 'wrong', fromX = 0) => {
      if (!card) return
      setGhost({ key: Date.now(), card, flipped, dir: result === 'correct' ? 'right' : 'left', fromX })
      setHistory((h) => [...h, { queue, index, tally, missed, cardId: card.id, prev: progressOf(card.id) }])
      onResult(card.id, result)
      setTally((t) => ({ ...t, [result]: t[result] + 1 }))
      let nextQueue = queue
      if (result === 'wrong') {
        if (!missed.includes(card.id)) setMissed((m) => [...m, card.id])
        if (settings.requeue) {
          nextQueue = [...queue]
          nextQueue.splice(Math.min(index + 1 + REQUEUE_GAP, queue.length), 0, card.id)
          setQueue(nextQueue)
        }
      }
      setFlipped(false)
      if (index + 1 >= nextQueue.length) setPhase('summary')
      else setIndex(index + 1)
    },
    [card, flipped, queue, index, tally, missed, settings.requeue, progressOf, onResult],
  )

  const undo = useCallback(() => {
    const last = history[history.length - 1]
    if (!last) return
    setHistory((h) => h.slice(0, -1))
    onUndo(last.cardId, last.prev)
    setQueue(last.queue)
    setIndex(last.index)
    setTally(last.tally)
    setMissed(last.missed)
    setFlipped(true)
    setPhase('session')
  }, [history, onUndo])

  // Tự phát âm khi thẻ hiện ra (chiều từ → nghĩa) hoặc khi lật ra mặt có chữ (chiều nghĩa → từ)
  useEffect(() => {
    if (!card || !settings.autoSpeak) return
    if (settings.direction === 'word' ? !flipped : flipped) speak(card.word, lang)
  }, [card, flipped, settings.autoSpeak, settings.direction, lang])

  // Phím tắt (desktop)
  const keysRef = useRef({ answer, undo, flip: () => setFlipped((f) => !f), phase })
  useEffect(() => {
    keysRef.current = { answer, undo, flip: () => setFlipped((f) => !f), phase }
  })
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = keysRef.current
      if (e.ctrlKey || e.metaKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, select')) return
      if ((e.key === 'Backspace' || e.key === 'z') && (k.phase === 'session' || k.phase === 'summary')) {
        e.preventDefault()
        k.undo()
        return
      }
      if (k.phase !== 'session') return
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        k.flip()
      } else if (e.key === 'ArrowLeft' || e.key === '1') k.answer('wrong')
      else if (e.key === 'ArrowRight' || e.key === '2') k.answer('correct')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // "Quay lại": đang ôn / xem tổng kết mà đã đi qua bước thiết lập → về thiết lập; còn lại → trang trước đó
  // (trang bài học, sidebar…). Mở thẳng link không có lịch sử thì về trang chủ của app.
  const goBack = () => {
    if (phase !== 'setup' && !preset) setPhase('setup')
    else if (window.history.length > 1) router.back()
    else router.push(appHref)
  }
  const backLink = (
    <button type="button" className="rv-link" onClick={goBack}>
      ‹ Quay lại
    </button>
  )

  // ── Thiết lập ──
  if (phase === 'setup') {
    const stats = { wrong: 0, fresh: 0, known: 0 }
    for (const c of pool) {
      const p = priorityOf(progressOf(c.id))
      if (p === 0) stats.wrong++
      else if (p === 1) stats.fresh++
      else stats.known++
    }
    const size = settings.limit > 0 ? Math.min(settings.limit, pool.length) : pool.length
    return (
      <div className="rv">
        {backLink}
        <p className="rv-eyebrow">{eyebrow}</p>
        <h1 className="rv-title">{preset ? preset.label : 'Chọn nội dung ôn tập'}</h1>

        <div className="rv-panel">
          <div className="rv-stats">
            <span className="rv-stat bad">
              <b>{stats.wrong}</b> cần ôn lại
            </span>
            <span className="rv-stat">
              <b>{stats.fresh}</b> chưa ôn
            </span>
            <span className="rv-stat ok">
              <b>{stats.known}</b> đã thuộc
            </span>
          </div>

          {hasGrammar && (
            <Field label="Loại thẻ">
              <Seg
                value={settings.kind}
                onChange={(kind) => update({ kind })}
                options={[
                  ['all', 'Tất cả'],
                  ['vocab', '📚 Từ vựng'],
                  ['grammar', '✏️ Ngữ pháp'],
                ]}
              />
            </Field>
          )}
          <Field label="Phạm vi">
            <Seg
              value={settings.scope}
              onChange={(scope) => update({ scope })}
              options={[
                ['all', 'Tất cả thẻ'],
                ['unlearned', 'Chỉ thẻ chưa thuộc'],
              ]}
            />
          </Field>
          <Field label="Thứ tự" note={settings.order === 'smart' ? 'Thẻ sai lần trước → thẻ chưa ôn → thẻ đã thuộc lâu chưa ôn' : undefined}>
            <Seg
              value={settings.order}
              onChange={(order) => update({ order })}
              options={[
                ['smart', '🧠 Thông minh'],
                ['sequential', 'Theo bài'],
                ['shuffle', '🔀 Ngẫu nhiên'],
              ]}
            />
          </Field>
          <Field label="Số thẻ mỗi phiên">
            <Seg
              value={String(settings.limit)}
              onChange={(v) => update({ limit: Number(v) })}
              options={LIMITS.map((n) => [String(n), n === 0 ? 'Tất cả' : String(n)] as [string, string])}
            />
          </Field>
          <Field label="Mặt trước của thẻ">
            <Seg
              value={settings.direction}
              onChange={(direction) => update({ direction })}
              options={[
                ['word', 'Từ → đoán nghĩa'],
                ['meaning', 'Nghĩa → nhớ từ'],
              ]}
            />
          </Field>
          <div className="rv-toggles">
            {readingLabel && (
              <Toggle checked={settings.readingOnFront} onChange={(v) => update({ readingOnFront: v })} label={`Hiện ${readingLabel} ở mặt trước`} />
            )}
            <Toggle checked={settings.autoSpeak} onChange={(v) => update({ autoSpeak: v })} label="Tự phát âm" />
            <Toggle checked={settings.requeue} onChange={(v) => update({ requeue: v })} label="Thẻ chưa thuộc quay lại trong phiên" />
          </div>

          {!preset && <LessonPicker groups={lessonGroups} counts={countByLesson} selected={lessons} onChange={setLessons} />}
        </div>

        <button type="button" className="rv-btn rv-btn-solid rv-start" disabled={size === 0} onClick={() => start()}>
          {size === 0 ? 'Không có thẻ nào phù hợp' : `🎴 Bắt đầu ôn ${size} thẻ`}
        </button>
      </div>
    )
  }

  // ── Tổng kết ──
  if (phase === 'summary' || !card) {
    if (phase === 'session' && queue.length === 0) {
      return (
        <div className="rv rv-center">
          {backLink}
          <p className="rv-empty">{settings.scope === 'unlearned' ? '🎉 Bạn đã thuộc hết các thẻ ở đây!' : 'Không có thẻ nào để ôn.'}</p>
          <button type="button" className="rv-btn" onClick={() => setPhase('setup')}>
            ⚙ Đổi tuỳ chọn
          </button>
        </div>
      )
    }
    const answered = tally.correct + tally.wrong
    const unique = new Set(queue).size
    const firstTry = unique - missed.length
    return (
      <div className="rv rv-center">
        <span className="rv-trophy">🎉</span>
        <p className="rv-title">Hoàn thành phiên ôn!</p>
        <p className="rv-muted">
          {preset?.label ?? `${lessons.size} bài đã chọn`} · {unique} thẻ · {answered} lượt chấm
        </p>
        <div className="rv-summary-stats">
          <div className="ok">
            <b>{firstTry}</b>
            <span>thuộc ngay lần đầu</span>
          </div>
          <div className="bad">
            <b>{missed.length}</b>
            <span>cần ôn thêm</span>
          </div>
          <div>
            <b>{unique ? Math.round((firstTry / unique) * 100) : 0}%</b>
            <span>chính xác</span>
          </div>
        </div>

        {missed.length > 0 && (
          <ul className="rv-missed">
            {missed.map((id) => {
              const c = byId.get(id)
              if (!c) return null
              return (
                <li key={id}>
                  <span lang={lang}>{c.word}</span>
                  {c.reading && <span className="rv-missed-reading">{c.reading}</span>}
                  <span className="rv-missed-meaning">{c.meaning}</span>
                </li>
              )
            })}
          </ul>
        )}

        <div className="rv-actions">
          {missed.length > 0 && (
            <button type="button" className="rv-btn rv-btn-solid" onClick={() => start([...missed])}>
              🔁 Ôn lại {missed.length} thẻ chưa thuộc
            </button>
          )}
          <button type="button" className={`rv-btn${missed.length ? '' : ' rv-btn-solid'}`} onClick={() => start()}>
            ▶ Phiên tiếp theo
          </button>
          <button type="button" className="rv-btn" onClick={() => setPhase('setup')}>
            ⚙ Đổi tuỳ chọn
          </button>
          {history.length > 0 && (
            <button type="button" className="rv-btn rv-btn-ghost" onClick={undo}>
              ↶ Hoàn tác thẻ cuối
            </button>
          )}
        </div>
        {backLink}
      </div>
    )
  }

  // ── Phiên ôn ──
  const remaining = queue.length - index
  return (
    <div className="rv rv-session">
      <div className="rv-top">
        {backLink}
        <button type="button" className="rv-link" onClick={() => setPhase('setup')}>
          ⚙ Tuỳ chọn
        </button>
        <span className="rv-count">
          {index + 1} / {queue.length}
        </span>
      </div>
      <div className="rv-progress">
        <span style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>
      <div className="rv-tally">
        <span className="ok">✓ {tally.correct}</span>
        <span className="bad">✕ {tally.wrong}</span>
        <span className="rv-muted">còn {remaining} thẻ</span>
        {preset && <span className="rv-muted rv-tally-label">{preset.label}</span>}
      </div>

      <div className="rv-stack">
        <ReviewFlashCard
          key={`${card.id}-${index}`}
          card={card}
          lang={lang}
          direction={settings.direction}
          showReading={!readingLabel || settings.readingOnFront}
          flipped={flipped}
          onFlip={() => setFlipped((f) => !f)}
          onSwipe={(d, fromX) => answer(d === 'right' ? 'correct' : 'wrong', fromX)}
        />
        {ghost && (
          <ReviewFlashCard
            key={ghost.key}
            card={ghost.card}
            lang={lang}
            direction={settings.direction}
            showReading={!readingLabel || settings.readingOnFront}
            flipped={ghost.flipped}
            onFlip={() => {}}
            ghost={{ dir: ghost.dir, fromX: ghost.fromX }}
          />
        )}
      </div>

      <div className="rv-answer">
        <button type="button" className="rv-btn rv-undo" disabled={history.length === 0} onClick={undo} aria-label="Hoàn tác" title="Hoàn tác (Backspace)">
          ↶
        </button>
        <button type="button" className="rv-btn rv-bad" onClick={() => answer('wrong')}>
          ✕ Chưa thuộc
        </button>
        <button type="button" className="rv-btn rv-ok" onClick={() => answer('correct')}>
          ✓ Đã thuộc
        </button>
      </div>
      <p className="rv-keys">
        <kbd>Space</kbd> lật · <kbd>←</kbd> chưa thuộc · <kbd>→</kbd> đã thuộc · <kbd>Backspace</kbd> hoàn tác
      </p>
    </div>
  )
}

function poolOf(cards: ReviewCard[], preset: Preset | null, lessons: Set<number>, s: ReviewSettings, progressOf: (id: string) => ReviewProgress | undefined) {
  return cards.filter(
    (c) =>
      (preset ? preset.filter(c) : lessons.has(c.lesson)) &&
      (s.kind === 'all' || c.kind === s.kind) &&
      (s.scope === 'all' || progressOf(c.id)?.lastResult !== 'correct'),
  )
}

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="rv-field">
      <span className="rv-field-label">{label}</span>
      {children}
      {note && <span className="rv-field-note">{note}</span>}
    </div>
  )
}

function Seg<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="rv-seg">
      {options.map(([v, label]) => (
        <button key={v} type="button" className={value === v ? 'on' : ''} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="rv-toggle">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="rv-switch" aria-hidden="true" />
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
    <div className="rv-field">
      <div className="rv-picker-head">
        <span className="rv-field-label">Bài học ({selected.size})</span>
        <button type="button" className="rv-link" onClick={() => toggle(all, !allOn)}>
          {allOn ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        </button>
      </div>
      <div className="rv-picker">
        {groups.map((g) => {
          const ns = g.lessons.map((l) => l.lesson).filter((n) => (counts.get(n) ?? 0) > 0)
          if (ns.length === 0) return null
          const groupOn = ns.every((n) => selected.has(n))
          return (
            <div key={g.label} className="rv-picker-group">
              <button type="button" className="rv-picker-level" onClick={() => toggle(ns, !groupOn)}>
                <span className={`rv-check${groupOn ? ' on' : ''}`} />
                {g.label}
              </button>
              {g.lessons.map((l) => {
                const n = counts.get(l.lesson) ?? 0
                if (n === 0) return null
                const on = selected.has(l.lesson)
                return (
                  <button key={l.lesson} type="button" className={`rv-picker-item${on ? ' on' : ''}`} onClick={() => toggle([l.lesson], !on)}>
                    <span className={`rv-check${on ? ' on' : ''}`} />
                    <span className="rv-picker-badge">{l.badge}</span>
                    <span className="rv-picker-title">{l.title}</span>
                    <span className="rv-picker-count">{n}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
