'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { clearDraft, loadAttempts, loadDrafts, saveAttempt, saveDraft } from '@/lib/ielts/practice'
import {
  formatClock,
  gradeListening,
  itemRange,
  LETTERS,
  listeningBand,
  sectionRange,
  totalQuestions,
  type LCue,
  type LItem,
  type LSection,
  type LSpan,
  type ListeningTest,
  type QuestionResult,
} from '@/lib/ielts/listening'
import { ConfirmDialog } from './ConfirmDialog'

type Answers = Record<string, string>
type ResultMap = Map<number, QuestionResult>

const RATES = [1, 1.25, 1.5, 0.75]

function Spans({ spans }: { spans: LSpan[] }) {
  return (
    <>
      {spans.map((s, i) => (s.bold ? <strong key={i}>{s.text}</strong> : <span key={i}>{s.text}</span>))}
    </>
  )
}

// Dấu ✓/✗ + đáp án đúng cạnh 1 câu (chỉ khi đã chấm và có đáp án)
function Mark({ r }: { r: QuestionResult | undefined }) {
  if (!r || r.ok === null) return null
  return r.ok ? (
    <span className="ih-l-mark ok" aria-label="Đúng">
      ✓
    </span>
  ) : (
    <span className="ih-l-mark bad" aria-label={`Sai, đáp án đúng: ${r.expected}`}>
      ✗ <span className="ih-l-mark-exp">{r.expected}</span>
    </span>
  )
}

// ── Từng dạng câu hỏi ───────────────────────────────────────────────────────────────────────────
function FillItem({ item, answers, onChange, locked, results }: ItemProps & { item: Extract<LItem, { type: 'fill' }> }) {
  const numOf = new Map(item.blanks.map((id, i) => [id, item.num + i]))
  return (
    <div className="ih-l-card" id={`lq-${item.num}`}>
      {item.heading && <p className="ih-l-heading">{item.heading}</p>}
      {item.body.map((p, i) => (
        <p key={i} className={`ih-l-para${p.bullet ? ' bullet' : ''}`}>
          {p.segs.map((s, j) => {
            if ('blank' in s) {
              const n = numOf.get(s.blank) ?? 0
              const r = results?.get(n)
              return (
                <span key={j} className="ih-l-blank">
                  <b>{n}.</b>
                  <input
                    className={`ih-l-input${r && r.ok !== null ? (r.ok ? ' ok' : ' bad') : ''}`}
                    value={answers[String(n)] ?? ''}
                    disabled={locked}
                    autoComplete="off"
                    spellCheck={false}
                    aria-label={`Câu ${n}`}
                    onChange={(e) => onChange(String(n), e.target.value)}
                  />
                  <Mark r={r} />
                </span>
              )
            }
            return s.bold ? <strong key={j}>{s.text}</strong> : <span key={j}>{s.text}</span>
          })}
        </p>
      ))}
    </div>
  )
}

function ChoiceItem({ item, answers, onChange, locked, results }: ItemProps & { item: Extract<LItem, { type: 'choice' }> }) {
  const r = results?.get(item.num)
  const picked = answers[String(item.num)]
  return (
    <div className="ih-l-card" id={`lq-${item.num}`}>
      <p className="ih-l-q">
        <b>{item.num}.</b> {item.question} <Mark r={r} />
      </p>
      <div className="ih-l-opts" role="radiogroup">
        {item.options.map((o, i) => {
          const letter = LETTERS[i]
          const isPicked = picked === letter
          const cls = r && r.ok !== null ? (r.expected === letter ? ' ok' : isPicked ? ' bad' : '') : ''
          return (
            <button key={letter} type="button" role="radio" aria-checked={isPicked} disabled={locked} className={`ih-l-opt${isPicked ? ' picked' : ''}${cls}`} onClick={() => onChange(String(item.num), isPicked ? '' : letter)}>
              <span className="ih-l-radio" aria-hidden />
              <span className="ih-l-letter">{letter}</span>
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MultiItem({ item, answers, onChange, locked, results }: ItemProps & { item: Extract<LItem, { type: 'multi' }> }) {
  const picked = (answers[String(item.num)] ?? '').split(',').filter(Boolean)
  const range = itemRange(item)
  const expected = new Set((results?.get(item.num)?.expected ?? '').split(', ').filter(Boolean))
  const marked = results && [...Array(item.count)].some((_, i) => results.get(item.num + i)?.ok !== null && results.get(item.num + i)?.ok !== undefined)
  function toggle(letter: string) {
    const next = picked.includes(letter) ? picked.filter((l) => l !== letter) : picked.length < item.count ? [...picked, letter] : picked
    onChange(String(item.num), next.sort().join(','))
  }
  return (
    <div className="ih-l-card" id={`lq-${item.num}`}>
      <p className="ih-l-q">
        <b>
          {range[0]}-{range[1]}.
        </b>{' '}
        {item.question}
      </p>
      <p className="ih-l-hint">Chọn {item.count} đáp án</p>
      <div className="ih-l-opts" role="group">
        {item.options.map((o, i) => {
          const letter = LETTERS[i]
          const isPicked = picked.includes(letter)
          const cls = marked ? (expected.has(letter) ? ' ok' : isPicked ? ' bad' : '') : ''
          return (
            <button key={letter} type="button" role="checkbox" aria-checked={isPicked} disabled={locked} className={`ih-l-opt${isPicked ? ' picked' : ''}${cls}`} onClick={() => toggle(letter)}>
              <span className="ih-l-check" aria-hidden>
                {isPicked ? '✓' : ''}
              </span>
              <span className="ih-l-letter">{letter}</span>
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MapItem({ item, answers, onChange, locked, results }: ItemProps & { item: Extract<LItem, { type: 'map' }> }) {
  return (
    <div className="ih-l-card ih-l-map" id={`lq-${item.num}`}>
      <div className="ih-l-map-img" style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image.url} alt="Bản đồ / sơ đồ cần gán nhãn" />
        {item.spots.map((s) => (
          <span key={s.letter} className="ih-l-spot" style={{ left: `${(s.x / item.image.width) * 100}%`, top: `${(s.y / item.image.height) * 100}%` }}>
            {s.letter}
          </span>
        ))}
      </div>
      <div className="ih-l-map-rows">
        {item.labels.map((label, i) => {
          const n = item.num + i
          const r = results?.get(n)
          return (
            <div key={n} className="ih-l-map-row" id={i ? `lq-${n}` : undefined}>
              <p className="ih-l-q">
                <b>{n}.</b> {label} <Mark r={r} />
              </p>
              <div className="ih-l-letters" role="radiogroup" aria-label={`Câu ${n}`}>
                {item.spots.map((s) => {
                  const isPicked = answers[String(n)] === s.letter
                  const cls = r && r.ok !== null ? (r.expected === s.letter ? ' ok' : isPicked ? ' bad' : '') : ''
                  return (
                    <button key={s.letter} type="button" role="radio" aria-checked={isPicked} disabled={locked} className={`ih-l-letterbtn${isPicked ? ' picked' : ''}${cls}`} onClick={() => onChange(String(n), isPicked ? '' : s.letter)}>
                      {s.letter}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Nối bằng KÉO THẢ như LMS: kéo đáp án từ danh sách bên phải thả vào ô của từng câu (kéo ra ô khác để đổi chỗ, kéo về danh sách hoặc
// bấm ✕ để gỡ). HTML5 kéo thả không chạy trên màn cảm ứng nên ô trống còn 1 <select> trong suốt phủ lên: chạm vào là chọn từ danh sách.
function MatchItem({ item, answers, onChange, locked, results }: ItemProps & { item: Extract<LItem, { type: 'match' }> }) {
  const [over, setOver] = useState<number | null>(null)
  const usedBy = new Map<string, number>() // chữ cái đáp án → số câu đang dùng nó
  item.labels.forEach((_, i) => {
    const l = answers[String(item.num + i)]
    if (l) usedBy.set(l, item.num + i)
  })
  const textOf = (letter: string) => item.options[LETTERS.indexOf(letter)] ?? ''
  const isLetter = (l: string) => LETTERS.indexOf(l) >= 0 && LETTERS.indexOf(l) < item.options.length

  // Đặt đáp án vào câu num; mỗi đáp án chỉ dùng cho 1 câu nên gỡ khỏi câu cũ (đáp án cũ của ô này quay về danh sách)
  function place(num: number, letter: string) {
    if (locked || !isLetter(letter)) return
    const prev = usedBy.get(letter)
    if (prev !== undefined && prev !== num) onChange(String(prev), '')
    onChange(String(num), letter)
  }
  const startDrag = (e: React.DragEvent, letter: string) => {
    e.dataTransfer.setData('text/plain', letter)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="ih-l-card ih-l-match" id={`lq-${item.num}`}>
      <div className="ih-l-match-rows">
        {item.labels.map((label, i) => {
          const n = item.num + i
          const r = results?.get(n)
          const letter = answers[String(n)] ?? ''
          const state = r && r.ok !== null ? (r.ok ? ' ok' : ' bad') : ''
          return (
            <div key={n} className="ih-l-match-row" id={i ? `lq-${n}` : undefined}>
              <p className="ih-l-q">
                <b>{n}.</b> {label} <Mark r={r} />
              </p>
              <div
                className={`ih-l-dz${letter ? ' filled' : ''}${over === n ? ' over' : ''}${state}`}
                onDragOver={(e) => {
                  if (locked) return
                  e.preventDefault()
                  setOver(n)
                }}
                onDragLeave={() => setOver((cur) => (cur === n ? null : cur))}
                onDrop={(e) => {
                  e.preventDefault()
                  setOver(null)
                  place(n, e.dataTransfer.getData('text/plain'))
                }}
              >
                {letter ? (
                  <>
                    <span className="ih-l-dz-chip" draggable={!locked} onDragStart={(e) => startDrag(e, letter)}>
                      {!locked && (
                        <span className="ih-l-grip" aria-hidden>
                          ⠿
                        </span>
                      )}
                      <span className="ih-l-letter">{letter}</span>
                      {textOf(letter)}
                    </span>
                    {!locked && (
                      <button type="button" className="ih-l-dz-x" aria-label={`Gỡ đáp án câu ${n}`} onClick={() => onChange(String(n), '')}>
                        ✕
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <span className="ih-l-dz-ph">Drop or Select your answer</span>
                    {!locked && (
                      <select className="ih-l-dz-select" value="" aria-label={`Chọn đáp án câu ${n}`} onChange={(e) => place(n, e.target.value)}>
                        <option value="">Chọn đáp án…</option>
                        {item.options.map((o, k) => (
                          <option key={LETTERS[k]} value={LETTERS[k]}>
                            {LETTERS[k]}. {o}
                            {usedBy.has(LETTERS[k]) ? ` (đang dùng ở câu ${usedBy.get(LETTERS[k])})` : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <aside
        className="ih-l-bank"
        onDragOver={(e) => !locked && e.preventDefault()}
        onDrop={(e) => {
          // Thả lại vào danh sách = gỡ đáp án khỏi câu đang dùng nó
          e.preventDefault()
          const l = e.dataTransfer.getData('text/plain')
          const num = usedBy.get(l)
          if (!locked && num !== undefined) onChange(String(num), '')
        }}
      >
        <p className="ih-l-bank-title">Kéo option vào câu hỏi</p>
        <p className="ih-l-bank-count">{item.options.length} OPTIONS</p>
        {item.options.map((o, k) => (
          <p key={LETTERS[k]} className={`ih-l-bank-opt${usedBy.has(LETTERS[k]) ? ' used' : ''}`} draggable={!locked} onDragStart={(e) => startDrag(e, LETTERS[k])}>
            {!locked && (
              <span className="ih-l-grip" aria-hidden>
                ⠿
              </span>
            )}
            <span className="ih-l-letter">{LETTERS[k]}</span>
            {o}
          </p>
        ))}
      </aside>
    </div>
  )
}

interface ItemProps {
  answers: Answers
  onChange: (key: string, value: string) => void
  locked: boolean
  results?: ResultMap
}

// 1 section: các nhóm câu hỏi (nhãn "Question a - b" + hướng dẫn) và từng mục câu hỏi
export function SectionQuestions({ section, ...rest }: ItemProps & { section: LSection }) {
  return (
    <>
      {section.groups.map((g, gi) => {
        const first = itemRange(g.items[0])[0]
        const last = itemRange(g.items[g.items.length - 1])[1]
        return (
          <section key={gi} className="ih-l-group">
            <p className="ih-l-group-head">
              <span className="ih-l-pill">{first === last ? `Question ${first}` : `Question ${first} - ${last}`}</span>
              <span>
                <Spans spans={g.instruction} />
              </span>
            </p>
            {g.items.map((it) => {
              switch (it.type) {
                case 'fill':
                  return <FillItem key={it.num} item={it} {...rest} />
                case 'choice':
                  return <ChoiceItem key={it.num} item={it} {...rest} />
                case 'multi':
                  return <MultiItem key={it.num} item={it} {...rest} />
                case 'map':
                  return <MapItem key={it.num} item={it} {...rest} />
                case 'match':
                  return <MatchItem key={it.num} item={it} {...rest} />
              }
            })}
          </section>
        )
      })}
    </>
  )
}

// Số câu (của 1 section) đã có đáp án; mục chọn nhiều đáp án tính theo số lựa chọn đã chọn
export function answeredNumbers(section: LSection, answers: Answers): Set<number> {
  const set = new Set<number>()
  for (const it of section.groups.flatMap((g) => g.items)) {
    if (it.type === 'multi') {
      const k = (answers[String(it.num)] ?? '').split(',').filter(Boolean).length
      for (let i = 0; i < k; i++) set.add(it.num + i)
    } else {
      const [a, b] = itemRange(it)
      for (let n = a; n <= b; n++) if ((answers[String(n)] ?? '').trim()) set.add(n)
    }
  }
  return set
}

// ── Âm thanh ────────────────────────────────────────────────────────────────────────────────────
interface AudioApi {
  // section đang chọn
  playing: boolean
  time: number
  duration: number
  rate: number
  toggle: () => void
  seek: (t: number) => void // tua trong section hiện tại
  skip: (d: number) => void // ± giây, giới hạn trong section hiện tại
  cycleRate: () => void
  // dòng thời gian GỘP cả đề (các section nối tiếp nhau, như 1 file âm thanh dài)
  starts: number[]
  durations: number[]
  total: number
  globalTime: number
  seekGlobal: (t: number) => void
  goSection: (i: number, play: boolean) => void
}

function AudioBar({ audio }: { audio: AudioApi }) {
  return (
    <div className="ih-l-audio">
      <button type="button" className="ih-l-abtn" aria-label="Lùi 15 giây" onClick={() => audio.skip(-15)}>
        ⟲<small>15</small>
      </button>
      <button type="button" className="ih-l-abtn play" aria-label={audio.playing ? 'Tạm dừng' : 'Phát'} onClick={audio.toggle}>
        {audio.playing ? '⏸' : '▶'}
      </button>
      <button type="button" className="ih-l-abtn" aria-label="Tới 15 giây" onClick={() => audio.skip(15)}>
        ⟳<small>15</small>
      </button>
      <span className="ih-l-time">{formatClock(audio.time)}</span>
      <input className="ih-l-seek" type="range" min={0} max={Math.max(1, Math.floor(audio.duration))} step={1} value={Math.min(Math.floor(audio.time), Math.floor(audio.duration) || 0)} aria-label="Tua âm thanh" onChange={(e) => audio.seek(Number(e.target.value))} />
      <span className="ih-l-time">{audio.duration ? formatClock(audio.duration) : '--:--'}</span>
      <button type="button" className="ih-l-rate" aria-label="Tốc độ phát" onClick={audio.cycleRate}>
        {audio.rate}x
      </button>
    </div>
  )
}

// Thời lượng ước tính khi chưa đọc được metadata của file âm thanh (hết transcript + một đoạn đệm, hoặc theo số phút của LMS)
const estimateDuration = (s: LSection) => (s.cues.length ? s.cues[s.cues.length - 1].end / 1000 + 20 : s.durationMin * 60)

// Giây t trên dòng thời gian gộp → section chứa nó + độ lệch trong section. starts[i] = giây bắt đầu của section i.
export function locateSection(starts: number[], t: number): { index: number; offset: number } {
  let i = starts.length - 1
  while (i > 0 && starts[i] > t) i--
  return { index: i, offset: t - starts[i] }
}

// Nạp cả file âm thanh bằng fetch rồi phát từ địa chỉ blob:. Thẻ <audio> trỏ thẳng tới file .mp3 sẽ bị các trình tải (IDM…) bắt
// request và hiện hộp thoại tải xuống; với blob: thì trình duyệt không còn request media nào để chúng chen vào. Cache theo URL
// nên phần đo thời lượng và phần phát dùng chung 1 lần tải. Fetch lỗi (file thiếu, CDN chặn CORS…) thì chỗ gọi tự lùi về URL gốc.
const blobCache = new Map<string, Promise<string>>()
function blobUrlFor(src: string): Promise<string> {
  let p = blobCache.get(src)
  if (!p) {
    p = fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.blob()
      })
      .then((b) => URL.createObjectURL(b.type.startsWith('audio/') ? b : new Blob([b], { type: 'audio/mpeg' })))
    p.catch(() => blobCache.delete(src))
    blobCache.set(src, p)
  }
  return p
}

// Một phần tử <audio> duy nhất phát lần lượt các file của từng section, nhưng hiện ra 1 dòng thời gian liền mạch (giống 1 file
// dài): tua ở vị trí bất kỳ trên cả đề sẽ tự chuyển section + tua tới đúng giây. Hết 1 section thì (nếu autoAdvance) sang
// section kế và phát tiếp, như bài thi thật.
function useTestAudio(test: ListeningTest, secIdx: number, setSecIdx: (i: number) => void, autoAdvance: boolean) {
  const ref = useRef<HTMLAudioElement | null>(null)
  const pending = useRef<{ offset: number; play: boolean } | null>(null) // tua/phát sau khi file của section mới nạp xong
  const secRef = useRef(secIdx)
  const advanceRef = useRef(autoAdvance)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [rate, setRate] = useState(1)
  const [durations, setDurations] = useState<number[]>(() => test.sections.map(estimateDuration))
  // File cục bộ trước; nếu trình duyệt không nạp được (chưa tải về / bản deploy không có file) thì lùi về CDN của LMS
  const [badLocal, setBadLocal] = useState<ReadonlySet<number>>(() => new Set())
  const srcFor = (i: number) => {
    const sec = test.sections[i]
    return sec.audioLocal && !badLocal.has(i) ? sec.audioLocal : sec.audioUrl
  }
  const url = srcFor(secIdx)

  useEffect(() => {
    secRef.current = secIdx
    advanceRef.current = autoAdvance
  }, [secIdx, autoAdvance])

  // Đọc trước metadata của cả 4 file (chỉ tải phần đầu) để biết thời lượng thật → dựng dòng thời gian đúng tỉ lệ
  useEffect(() => {
    let cancelled = false
    const probes: HTMLAudioElement[] = []
    test.sections.forEach((sec, i) => {
      const measure = (src: string) => {
        if (cancelled) return
        const a = new Audio()
        a.preload = 'metadata'
        a.onloadedmetadata = () => {
          if (!cancelled && Number.isFinite(a.duration) && a.duration > 0) setDurations((prev) => prev.map((d, k) => (k === i ? a.duration : d)))
        }
        a.src = src
        probes.push(a)
      }
      blobUrlFor(sec.audioLocal ?? sec.audioUrl).then(measure, () => measure(sec.audioUrl))
    })
    return () => {
      cancelled = true
      for (const a of probes) {
        a.onloadedmetadata = null
        a.removeAttribute('src')
      }
    }
  }, [test])

  useEffect(() => {
    const a = ref.current
    if (!a) return
    const sync = () => {
      setTime(a.currentTime)
      setDuration(Number.isFinite(a.duration) ? a.duration : 0)
    }
    const onEnded = () => {
      setPlaying(false)
      if (advanceRef.current && secRef.current < test.sections.length - 1) {
        pending.current = { offset: 0, play: true }
        setSecIdx(secRef.current + 1)
      }
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => {
      // Đang phát file cục bộ mà lỗi → đánh dấu để chuyển sang CDN (effect nạp lại theo url mới; giữ nguyên vị trí cần tua)
      const i = secRef.current
      const sec = test.sections[i]
      if (sec.audioLocal && a.getAttribute('src') === sec.audioLocal) {
        pending.current ??= { offset: a.currentTime, play: !a.paused }
        setBadLocal((prev) => new Set(prev).add(i))
      }
    }
    a.addEventListener('timeupdate', sync)
    a.addEventListener('error', onError)
    a.addEventListener('loadedmetadata', sync)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('ended', onEnded)
    return () => {
      a.removeEventListener('timeupdate', sync)
      a.removeEventListener('loadedmetadata', sync)
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('ended', onEnded)
      a.removeEventListener('error', onError)
    }
  }, [test, setSecIdx])

  // Đổi section: nạp file mới rồi áp dụng yêu cầu tua/phát đang chờ (nếu có)
  useEffect(() => {
    const a = ref.current
    if (!a) return
    let cancelled = false
    a.pause()
    a.removeAttribute('src')
    a.load()
    setTime(0)
    setDuration(0)
    const direct = (src: string) => {
      a.src = src
      a.load()
    }
    blobUrlFor(url).then(
      (b) => {
        if (!cancelled) direct(b)
      },
      () => {
        if (cancelled) return
        const i = test.sections.findIndex((sec) => sec.audioLocal === url)
        if (i >= 0) setBadLocal((prev) => new Set(prev).add(i)) // file cục bộ thiếu → effect chạy lại với URL CDN
        else direct(url)
      }
    )
    const apply = () => {
      const p = pending.current
      pending.current = null
      if (!p) return
      a.currentTime = p.offset
      if (p.play) void a.play().catch(() => {})
    }
    a.addEventListener('loadedmetadata', apply, { once: true })
    return () => {
      cancelled = true
      a.removeEventListener('loadedmetadata', apply)
    }
  }, [url, test.sections])

  const starts = useMemo(() => durations.map((_, i) => durations.slice(0, i).reduce((x, y) => x + y, 0)), [durations])
  const total = durations.reduce((x, y) => x + y, 0)
  // section đang phát dùng thời lượng thật của chính file; các section khác dùng số đã đo/ước tính
  const globalTime = (starts[secIdx] ?? 0) + time

  const goSection = (i: number, play: boolean) => {
    if (i === secRef.current) {
      const a = ref.current
      if (a) {
        a.currentTime = 0
        if (play) void a.play().catch(() => {})
      }
      return
    }
    pending.current = { offset: 0, play }
    setSecIdx(i)
  }
  const seekGlobal = (t: number) => {
    const clamped = Math.max(0, Math.min(total - 0.05, t))
    const { index: i, offset } = locateSection(starts, clamped)
    if (i === secRef.current) {
      if (ref.current) ref.current.currentTime = offset
      setTime(offset)
    } else {
      pending.current = { offset, play: !!ref.current && !ref.current.paused }
      setSecIdx(i)
    }
  }

  const api: AudioApi = {
    playing,
    time,
    duration,
    rate,
    toggle: () => {
      const a = ref.current
      if (!a) return
      if (a.paused) void a.play().catch(() => {})
      else a.pause()
    },
    seek: (t) => {
      if (ref.current) ref.current.currentTime = t
      setTime(t)
    },
    skip: (d) => {
      const a = ref.current
      if (a) a.currentTime = Math.max(0, Math.min(a.duration || Infinity, a.currentTime + d))
    },
    cycleRate: () => {
      const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length]
      setRate(next)
      if (ref.current) {
        ref.current.defaultPlaybackRate = next // giữ tốc độ khi nạp section mới
        ref.current.playbackRate = next
      }
    },
    starts,
    durations,
    total,
    globalTime,
    seekGlobal,
    goSection,
  }
  return { ref, api, play: () => void ref.current?.play().catch(() => {}) }
}

// Sóng âm 1 section thành n cột: có `wave` của LMS thì lấy đỉnh theo từng đoạn; chưa có thì vẽ tạm theo transcript (đoạn có
// người nói cao, khoảng lặng thấp).
function waveColumns(sec: LSection, durationSec: number, n: number): number[] {
  if (sec.wave?.length) {
    return Array.from({ length: n }, (_, i) => {
      const a = Math.floor((i * sec.wave!.length) / n)
      const b = Math.max(a + 1, Math.floor(((i + 1) * sec.wave!.length) / n))
      return sec.wave!.slice(a, b).reduce((m, v) => Math.max(m, v), 0)
    })
  }
  return Array.from({ length: n }, (_, i) => {
    const t0 = (i / n) * durationSec * 1000
    const t1 = ((i + 1) / n) * durationSec * 1000
    const active = sec.cues.some((c) => c.start < t1 && c.end > t0)
    const jitter = Math.abs(Math.sin(i * 12.9898 + 7.13) * 43758.5453) % 1
    return active ? 0.3 + 0.7 * jitter : 0.05
  })
}

const TOTAL_BARS = 220

// Thanh phát dạng sóng âm chạy suốt cả đề: phần đã nghe màu đỏ, còn lại xám; mốc S1…S4 ở dưới; bấm/kéo để tua.
export function WaveBar({ test, audio }: { test: ListeningTest; audio: AudioApi }) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [drag, setDrag] = useState(false)
  const columns = useMemo(
    () =>
      test.sections.flatMap((sec, i) => {
        const n = Math.max(6, Math.round((audio.durations[i] / (audio.total || 1)) * TOTAL_BARS))
        return waveColumns(sec, audio.durations[i], n)
      }),
    [test, audio.durations, audio.total],
  )
  const progress = audio.total ? Math.min(1, audio.globalTime / audio.total) : 0
  const seekTo = (clientX: number) => {
    const el = wrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    audio.seekGlobal(Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * audio.total)
  }
  return (
    <div
      ref={wrapRef}
      className="ih-l-wave"
      role="slider"
      tabIndex={0}
      aria-label="Tua âm thanh cả đề"
      aria-valuemin={0}
      aria-valuemax={Math.round(audio.total)}
      aria-valuenow={Math.round(audio.globalTime)}
      aria-valuetext={`${formatClock(audio.globalTime)} / ${formatClock(audio.total)}`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        setDrag(true)
        seekTo(e.clientX)
      }}
      onPointerMove={(e) => drag && seekTo(e.clientX)}
      onPointerUp={() => setDrag(false)}
      onPointerCancel={() => setDrag(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') audio.seekGlobal(audio.globalTime + 5)
        else if (e.key === 'ArrowLeft') audio.seekGlobal(audio.globalTime - 5)
        else return
        e.preventDefault()
      }}
    >
      <div className="ih-l-wave-bars">
        {columns.map((v, i) => (
          <span key={i} className={(i + 0.5) / columns.length <= progress ? 'played' : undefined} style={{ height: `${Math.max(6, Math.round(v * 100))}%` }} />
        ))}
      </div>
      <div className="ih-l-wave-marks" aria-hidden>
        {test.sections.map((sec, i) => (
          <span key={sec.id} style={{ left: `${audio.total ? (audio.starts[i] / audio.total) * 100 : 0}%` }}>
            S{i + 1}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Transcript (trang kết quả) ────────────────────────────────────────────────────────────────
export function Transcript({ cues, time, onSeek }: { cues: LCue[]; time: number; onSeek: (sec: number) => void }) {
  const activeRef = useRef<HTMLButtonElement | null>(null)
  const active = cues.findIndex((c) => time * 1000 >= c.start && time * 1000 < c.end)
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [active])
  if (!cues.length) return <p className="ih-pr-empty">Section này chưa có transcript.</p>
  return (
    <div className="ih-l-transcript">
      {cues.map((c, i) => (
        <button key={i} type="button" ref={i === active ? activeRef : undefined} className={`ih-l-cue${i === active ? ' active' : ''}`} onClick={() => onSeek(c.start / 1000)}>
          <span className="ih-l-cue-time">{formatClock(c.start / 1000)}</span>
          <span className="ih-l-cue-text">
            {c.speaker && <b>{c.speaker}: </b>}
            {c.text}
          </span>
        </button>
      ))}
    </div>
  )
}

// ── Trang kết quả / xem lại ──────────────────────────────────────────────────────────────────
export function ResultBody({ test, answers, secIdx, setSecIdx, audio, savedAt }: { test: ListeningTest; answers: Answers; secIdx: number; setSecIdx: (i: number) => void; audio: AudioApi; savedAt?: string }) {
  const grade = useMemo(() => gradeListening(test, answers), [test, answers])
  const results: ResultMap = useMemo(() => new Map(grade.results.map((r) => [r.num, r])), [grade])
  const section = test.sections[secIdx]
  const secResults = grade.results.filter((r) => r.num >= sectionRange(section)[0] && r.num <= sectionRange(section)[1])
  const noop = () => {}
  return (
    <div className="ih-l-result">
      <div className="ih-l-score">
        {grade.graded ? (
          <>
            <p className="ih-l-score-big">
              {grade.score}
              <small>/{grade.total}</small>
            </p>
            <p className="ih-l-score-sub">Band ước lượng: {listeningBand(grade.score)} (theo thang Cambridge, chỉ để tham khảo)</p>
          </>
        ) : (
          <p className="ih-l-score-sub">Đề này chưa có đáp án nên chưa chấm điểm. Bạn vẫn xem lại câu trả lời, nghe lại và đọc transcript được.</p>
        )}
        {test.answersNote && <p className="ih-l-note">ℹ️ {test.answersNote}</p>}
        {savedAt && <p className="ih-l-note">Lần làm gần nhất: {new Date(savedAt).toLocaleString('vi-VN')}</p>}
      </div>

      <div className="ih-l-tabs" role="tablist">
        {test.sections.map((s, i) => {
          const r = grade.results.filter((x) => x.num >= sectionRange(s)[0] && x.num <= sectionRange(s)[1])
          return (
            <button key={s.id} type="button" role="tab" aria-selected={i === secIdx} className={`ih-l-tab${i === secIdx ? ' active' : ''}`} onClick={() => setSecIdx(i)}>
              Section {i + 1}
              {grade.graded && <small>{r.filter((x) => x.ok).length}/{r.length}</small>}
            </button>
          )
        })}
      </div>

      <div className="ih-l-result-cols" translate="no">
        <div className="ih-l-result-questions">
          <h2 className="ih-l-h2">{section.title}</h2>
          <SectionQuestions section={section} answers={answers} onChange={noop} locked results={grade.graded ? results : undefined} />
          {!grade.graded && secResults.length > 0 && <p className="ih-l-note">Chưa có đáp án để đối chiếu.</p>}
        </div>
        <div className="ih-l-result-transcript">
          <h2 className="ih-l-h2">Transcript</h2>
          <AudioBar audio={audio} />
          <Transcript cues={section.cues} time={audio.time} onSeek={(t) => { audio.seek(t); if (!audio.playing) audio.toggle() }} />
        </div>
      </div>
    </div>
  )
}

// Cuộn tới câu n. Mục điền ô trống chỉ có id ở ô đầu → không có id thì lùi về câu gần nhất phía trước có id.
function scrollToQuestion(n: number) {
  for (let k = n; k >= Math.max(1, n - 12); k--) {
    const el = document.getElementById(`lq-${k}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
  }
}

// ── Màn làm bài (trạng thái: bắt đầu → làm bài → kết quả) ──────────────────────────────────────
export function ListeningRunner({ test, initialView = 'start' }: { test: ListeningTest; initialView?: 'start' | 'review' }) {
  const total = totalQuestions(test)
  const [view, setView] = useState<'start' | 'taking' | 'result'>(initialView === 'review' ? 'result' : 'start')
  const [answers, setAnswers] = useState<Answers>({})
  const [secIdx, setSecIdx] = useState(0)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [resumed, setResumed] = useState(false)
  const [confirm, setConfirm] = useState<'submit' | 'exit' | null>(null)
  const [savedAt, setSavedAt] = useState<string | undefined>()
  const [hasAttempt, setHasAttempt] = useState(true)
  const finishedRef = useRef(false)
  const section = test.sections[secIdx]
  const { ref: audioRef, api: audio, play } = useTestAudio(test, secIdx, setSecIdx, view === 'taking')
  const listUrl = '/ielts/listening/practice'

  // Nạp bài nháp (đang làm dở) hoặc lần làm gần nhất (xem lại)
  useEffect(() => {
    const draft = loadDrafts()[test.id]
    const last = loadAttempts()[test.id]?.history?.at(-1)
    /* eslint-disable react-hooks/set-state-in-effect */
    if (initialView === 'review') {
      if (last) {
        setAnswers(last.answers)
        setSavedAt(last.at)
      } else setHasAttempt(false)
    } else if (draft) {
      setAnswers(draft.answers)
      setDeadline(draft.deadline)
      setResumed(true)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [test.id, initialView])

  const finish = useCallback(
    (a: Answers) => {
      if (finishedRef.current) return
      finishedRef.current = true
      audioRef.current?.pause()
      const g = gradeListening(test, a)
      if (g.graded) saveAttempt(test.id, { score: g.score, total: g.total, mode: 'real', answers: a })
      clearDraft(test.id)
      setSavedAt(new Date().toISOString())
      setSecIdx(0)
      setView('result')
      window.scrollTo({ top: 0 })
    },
    [test, audioRef],
  )

  // Đồng hồ: đếm ngược theo MỐC GIỜ (F5 / thoát ra vào lại không reset được); hết giờ tự nộp
  useEffect(() => {
    if (view !== 'taking' || deadline === null) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [view, deadline])
  const remaining = deadline === null ? test.durationMin * 60 : Math.max(0, Math.round((deadline - now) / 1000))
  useEffect(() => {
    if (view === 'taking' && deadline !== null && remaining <= 0) finish(answers)
  }, [view, deadline, remaining, answers, finish])

  // Lưu nháp mỗi khi đổi đáp án
  useEffect(() => {
    if (view === 'taking' && deadline !== null) saveDraft(test.id, { mode: 'real', answers, deadline })
  }, [view, answers, deadline, test.id])

  function start() {
    const d = deadline ?? Date.now() + test.durationMin * 60_000
    setDeadline(d)
    setNow(Date.now())
    setView('taking')
    play()
  }

  // Chuyển section (âm thanh nhảy theo, đang làm bài thì phát luôn) — nút "Section N →", viên S1–S4 và bảng câu hỏi
  const goSection = (i: number) => audio.goSection(i, view === 'taking')
  // Đổi section (kể cả do âm thanh tự sang section kế) thì cuộn lên đầu
  useEffect(() => {
    if (view === 'taking') window.scrollTo({ top: 0 })
  }, [secIdx, view])
  const [palette, setPalette] = useState(false)
  const [jumpTo, setJumpTo] = useState<number | null>(null)
  useEffect(() => {
    if (jumpTo === null) return
    scrollToQuestion(jumpTo)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJumpTo(null)
  }, [jumpTo, secIdx])

  const setAnswer = (key: string, value: string) => setAnswers((prev) => ({ ...prev, [key]: value }))
  const answeredAll = useMemo(() => test.sections.reduce((n, s) => n + answeredNumbers(s, answers).size, 0), [test, answers])
  const done = answeredNumbers(section, answers)
  const [a0, a1] = sectionRange(section)
  const last = secIdx === test.sections.length - 1

  return (
    <div className={`ih-l-root ih-l-${view}`}>
      <audio ref={audioRef} preload="metadata" />

      {view === 'start' && (
        <div className="ih-l-start">
          <p className="ih-pr-dialog-cap">Listening · {test.part}</p>
          <h1 className="ih-font-hand ih-pr-dialog-title">{test.title}</h1>
          <p className="ih-pr-sub">
            {test.sections.length} section · {total} câu · {test.durationMin} phút
          </p>
          {resumed ? (
            <p className="ih-l-note">
              Bạn đang làm dở bài này (đã trả lời {answeredAll}/{total} câu). Thời gian còn lại: <b>{formatClock(remaining)}</b>
            </p>
          ) : (
            <div className="ih-l-notice">
              <p>
                <b>Lưu ý:</b> âm thanh sẽ phát và đồng hồ bắt đầu chạy ngay khi bạn bấm “Bắt đầu”. Bạn có thể tua, đổi tốc độ và chuyển qua lại giữa các section.
              </p>
              <p>Bài chỉ nghe được khi có mạng (âm thanh phát trực tiếp từ máy chủ của LMS). Bài làm dở được lưu tự động trên máy này.</p>
            </div>
          )}
          <div className="ih-pr-filters">
            <button type="button" className="ih-btn-solid" onClick={start}>
              {resumed ? 'Tiếp tục làm bài' : 'Bắt đầu'}
            </button>
            <Link href={listUrl} className="ih-btn-outline">
              ← Danh sách đề
            </Link>
          </div>
        </div>
      )}

      {view === 'taking' && (
        <>
          <header className="ih-l-top">
            <button type="button" className="ih-l-x" aria-label="Thoát" onClick={() => setConfirm('exit')}>
              ✕
            </button>
            <p className="ih-l-top-title">
              Làm bài section {secIdx + 1} <span className={`ih-l-clock${remaining <= 300 ? ' low' : ''}`}>⏱ {formatClock(remaining)}</span>
            </p>
            <span />
          </header>
          <main className="ih-l-main" translate="no">
            <h1 className="ih-l-h1">{section.title}</h1>
            <SectionQuestions section={section} answers={answers} onChange={setAnswer} locked={false} />
          </main>
          <footer className="ih-l-foot">
            <div className="ih-l-player">
              <button type="button" className="ih-l-abtn" aria-label="Lùi 15 giây" onClick={() => audio.seekGlobal(audio.globalTime - 15)}>
                ⟲<small>15</small>
              </button>
              <button type="button" className="ih-l-abtn play" aria-label={audio.playing ? 'Tạm dừng' : 'Phát'} onClick={audio.toggle}>
                {audio.playing ? '⏸' : '▶'}
              </button>
              <button type="button" className="ih-l-abtn" aria-label="Tới 15 giây" onClick={() => audio.seekGlobal(audio.globalTime + 15)}>
                ⟳<small>15</small>
              </button>
              <span className="ih-l-time now">{formatClock(audio.globalTime)}</span>
              <WaveBar test={test} audio={audio} />
              <span className="ih-l-time">{formatClock(audio.total)}</span>
              <button type="button" className="ih-l-rate" aria-label="Tốc độ phát" onClick={audio.cycleRate}>
                {audio.rate}x
              </button>
            </div>
            <div className="ih-l-nav">
              <button type="button" className={`ih-l-gridbtn${palette ? ' on' : ''}`} aria-label="Danh sách câu hỏi" aria-expanded={palette} onClick={() => setPalette((v) => !v)}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
                  {[5, 12, 19].flatMap((cx) => [5, 12, 19].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.8" />))}
                </svg>
              </button>
              <p className="ih-l-nav-info">
                <b>Section {secIdx + 1}</b>
                <span>
                  Đã làm {done.size} / {a1 - a0 + 1}
                </span>
              </p>
              <div className="ih-l-pillnav">
                {test.sections.map((sec, i) => {
                  const [b0, b1] = sectionRange(sec)
                  if (i !== secIdx) {
                    const ratio = answeredNumbers(sec, answers).size / (b1 - b0 + 1)
                    return (
                      <button key={sec.id} type="button" className="ih-l-secmini" aria-label={`Section ${i + 1}`} onClick={() => goSection(i)}>
                        <span>S{i + 1}</span>
                        <i style={{ ['--fill' as string]: `${Math.round(ratio * 100)}%` }} />
                      </button>
                    )
                  }
                  return (
                    <span key={sec.id} className="ih-l-chipgroup">
                      <span className="ih-l-chiplabel">Section {i + 1}</span>
                      <span className="ih-l-chipsep" aria-hidden />
                      {Array.from({ length: b1 - b0 + 1 }, (_, k) => b0 + k).map((n) => (
                        <button key={n} type="button" className={`ih-l-chip${done.has(n) ? ' done' : ''}`} onClick={() => scrollToQuestion(n)}>
                          {n}
                        </button>
                      ))}
                    </span>
                  )
                })}
              </div>
              {last ? (
                <button type="button" className="ih-l-submit" onClick={() => setConfirm('submit')}>
                  Nộp bài
                </button>
              ) : (
                <button type="button" className="ih-l-submit" onClick={() => goSection(secIdx + 1)}>
                  Section {secIdx + 2} →
                </button>
              )}
            </div>
            {palette && (
              <div className="ih-l-palette" role="dialog" aria-label="Danh sách câu hỏi">
                {test.sections.map((sec, i) => {
                  const [b0, b1] = sectionRange(sec)
                  const dn = answeredNumbers(sec, answers)
                  return (
                    <div key={sec.id} className="ih-l-palette-row">
                      <span className="ih-l-palette-label">Section {i + 1}</span>
                      {Array.from({ length: b1 - b0 + 1 }, (_, k) => b0 + k).map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={`ih-l-chip${dn.has(n) ? ' done' : ''}`}
                          onClick={() => {
                            setPalette(false)
                            if (i !== secIdx) goSection(i)
                            setJumpTo(n)
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </footer>
        </>
      )}

      {view === 'result' && (
        <div className="ih-l-resultwrap">
          <Link href={listUrl} className="ih-pr-back">
            ← Danh sách đề
          </Link>
          <p className="ih-pr-dialog-cap">Listening · {test.part}</p>
          <h1 className="ih-font-hand ih-pr-dialog-title">{test.title}</h1>
          {!hasAttempt ? (
            <>
              <p className="ih-pr-empty">Bạn chưa nộp bài nào cho đề này (hoặc đề chưa có đáp án nên không lưu điểm).</p>
              <Link href={`${listUrl}/${test.id}/run`} className="ih-btn-solid">
                Làm đề này
              </Link>
            </>
          ) : (
            <ResultBody
              test={test}
              answers={answers}
              secIdx={secIdx}
              setSecIdx={(i) => {
                setSecIdx(i)
                audioRef.current?.pause()
              }}
              audio={audio}
              savedAt={savedAt}
            />
          )}
        </div>
      )}

      {confirm === 'submit' && (
        <ConfirmDialog
          title="Nộp bài?"
          confirmLabel="Nộp bài"
          cancelLabel="Làm tiếp"
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            setConfirm(null)
            finish(answers)
          }}
        >
          <p>
            Bạn đã trả lời {answeredAll}/{total} câu.
            {answeredAll < total && ' Các câu bỏ trống sẽ tính sai.'}
          </p>
        </ConfirmDialog>
      )}
      {confirm === 'exit' && (
        <ConfirmDialog title="Thoát bài làm?" confirmLabel="Thoát" cancelLabel="Ở lại" tone="danger" onCancel={() => setConfirm(null)} onConfirm={() => (window.location.href = listUrl)}>
          <p>Bài làm dở được lưu trên máy này và đồng hồ vẫn chạy theo mốc giờ kết thúc. Bạn có thể quay lại làm tiếp trước khi hết giờ.</p>
        </ConfirmDialog>
      )}
    </div>
  )
}
