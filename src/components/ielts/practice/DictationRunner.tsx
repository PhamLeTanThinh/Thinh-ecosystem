'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { loadDictationProgress, saveDictationProgress } from '@/lib/ielts/practice'
import { audioSources, blankIndexes, formatClock, isPunct, partLabel, sameWord, spaceBefore, type DSentence, type Dictation } from '@/lib/ielts/dictation'
import { isRecognitionSupported, listenOnce, matchSpeech, passRatioFor, speechWords } from '@/lib/shared/recognize'

const RATES = [1, 0.75, 0.5, 1.25]
const PASS_TYPED = 0.9 // gõ nguyên câu (chế độ HARD): đạt khi đúng ≥ 90% số từ
const MODE_KEY = 'ielts-dictation-mode'

type Mode = 'easy' | 'hard'
type View = 'dictate' | 'shadow'
type Panel = null | 'preview' | 'vocab'

// Đọc 1 từ/cụm bằng giọng của trình duyệt (bấm vào từ ở phần Script để nghe phát âm)
function speak(text: string) {
  try {
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  } catch {
    // trình duyệt không hỗ trợ đọc: bỏ qua
  }
}

const iconPlay = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
    <path d="M8 5v14l11-7z" />
  </svg>
)
const iconPause = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
  </svg>
)
const iconReplay = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
)
const iconLoop = (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M17 2l4 4-4 4" />
    <path d="M3 11V9a3 3 0 0 1 3-3h15" />
    <path d="M7 22l-4-4 4-4" />
    <path d="M21 13v2a3 3 0 0 1-3 3H3" />
  </svg>
)
const iconMic = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
    <path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 0 0-8 0v5a4 4 0 0 0 4 4zm6-4a1 1 0 1 0-2 0 4 4 0 0 1-8 0 1 1 0 1 0-2 0 6 6 0 0 0 5 5.9V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.1A6 6 0 0 0 18 11z" />
  </svg>
)

// ── Trình phát 1 câu: chỉ phát đoạn [start, end] của file âm thanh của section ─────────────────────
// Dùng chung 1 phần tử <audio> của trang (audioRef); key={câu} nên mỗi câu mount lại và tự về đầu câu.
function SentencePlayer({ audioRef, s, rate, loop, autoPlay, onRate, onLoop }: { audioRef: React.RefObject<HTMLAudioElement | null>; s: DSentence; rate: number; loop: boolean; autoPlay: boolean; onRate: () => void; onLoop: () => void }) {
  const start = s.start / 1000
  const end = s.end / 1000
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const loopRef = useRef(loop)
  const rateRef = useRef(rate)
  useEffect(() => {
    loopRef.current = loop
    rateRef.current = rate
    if (audioRef.current) audioRef.current.playbackRate = rate
  }, [loop, rate, audioRef])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    let raf = 0
    const tick = () => {
      const t = a.currentTime
      setPos(Math.min(Math.max(0, t - start), end - start))
      if (t >= end - 0.02) {
        if (loopRef.current) a.currentTime = start
        else {
          a.pause()
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }
    const onPlay = () => {
      setPlaying(true)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }
    const onPause = () => {
      setPlaying(false)
      cancelAnimationFrame(raf)
    }
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('ended', onPause)
    a.pause()
    try {
      a.currentTime = start
    } catch {
      // chưa nạp metadata: lần phát đầu sẽ tự đặt lại vị trí
    }
    if (autoPlay) {
      a.playbackRate = rateRef.current
      void a.play().catch(() => {})
    }
    return () => {
      cancelAnimationFrame(raf)
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      a.removeEventListener('ended', onPause)
      a.pause()
    }
    // autoPlay chỉ có nghĩa lúc mount câu mới
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef, start, end])

  const play = () => {
    const a = audioRef.current
    if (!a) return
    if (a.currentTime < start - 0.05 || a.currentTime >= end - 0.05) a.currentTime = start
    a.playbackRate = rate
    void a.play().catch(() => {})
  }
  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) play()
    else a.pause()
  }
  const replay = () => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = start
    setPos(0)
    play()
  }
  const seek = (clientX: number, el: HTMLElement) => {
    const a = audioRef.current
    if (!a) return
    const r = el.getBoundingClientRect()
    const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * (end - start)
    a.currentTime = start + t
    setPos(t)
  }
  const dur = end - start
  return (
    <div className="ih-dc-player">
      <button type="button" className="ih-dc-play" aria-label={playing ? 'Tạm dừng' : 'Phát câu'} onClick={toggle}>
        {playing ? iconPause : iconPlay}
      </button>
      <button type="button" className="ih-dc-rbtn" aria-label="Nghe lại từ đầu câu" onClick={replay}>
        {iconReplay}
      </button>
      <div className="ih-dc-bar" role="slider" tabIndex={0} aria-label="Vị trí trong câu" aria-valuemin={0} aria-valuemax={Math.round(dur * 10) / 10} aria-valuenow={Math.round(pos * 10) / 10} onPointerDown={(e) => seek(e.clientX, e.currentTarget)}>
        <span style={{ width: `${dur ? (pos / dur) * 100 : 0}%` }} />
      </div>
      <span className="ih-dc-time">
        {formatClock(pos)}/{formatClock(Math.ceil(dur))}
      </span>
      <button type="button" className="ih-dc-rbtn round" aria-label="Tốc độ phát" onClick={onRate}>
        {rate}×
      </button>
      <button type="button" className={`ih-dc-rbtn round${loop ? ' on' : ''}`} aria-label="Lặp lại câu" aria-pressed={loop} onClick={onLoop}>
        {iconLoop}
      </button>
    </div>
  )
}

// ── EASY: điền từng từ ─────────────────────────────────────────────────────────────────────────
function EasyAttempt({ s, onChecked }: { s: DSentence; onChecked: (ok: boolean) => void }) {
  const blanks = useMemo(() => blankIndexes(s), [s])
  const given = useMemo(() => new Set(s.given ?? []), [s])
  const [values, setValues] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const refs = useRef<Record<number, HTMLInputElement | null>>({})
  const correct = blanks.filter((i) => sameWord(values[i] ?? '', s.words[i])).length
  const anyTyped = blanks.some((i) => (values[i] ?? '').trim() !== '')

  const focusAt = (i: number | undefined) => i !== undefined && refs.current[i]?.focus()
  const check = () => {
    if (!anyTyped) return
    setChecked(true)
    onChecked(correct === blanks.length)
  }
  const reset = () => {
    setValues({})
    setChecked(false)
    focusAt(blanks[0])
  }

  return (
    <>
      <div className="ih-dc-words" translate="no">
        {s.words.map((w, i) => {
          const gap = spaceBefore(s.words[i - 1], w) ? ' sp' : ''
          if (isPunct(w) || given.has(i)) {
            return (
              <span key={i} className={`ih-dc-fixed${gap}`}>
                {w}
              </span>
            )
          }
          const ok = checked && sameWord(values[i] ?? '', w)
          const bad = checked && !ok
          const at = blanks.indexOf(i)
          return (
            <span key={i} className={`ih-dc-slot${gap}`}>
              <input
                ref={(el) => {
                  refs.current[i] = el
                }}
                className={`ih-dc-blank${ok ? ' ok' : ''}${bad ? ' bad' : ''}`}
                style={{ width: `${Math.max(3, w.length) * 0.78 + 1.6}em` }}
                value={values[i] ?? ''}
                disabled={checked}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label={`Từ ${at + 1}`}
                onChange={(e) => setValues((v) => ({ ...v, [i]: e.target.value.replace(/\s/g, '') }))}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.preventDefault()
                    focusAt(blanks[at + 1])
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    check()
                  } else if (e.key === 'Backspace' && !(values[i] ?? '') && at > 0) {
                    e.preventDefault()
                    focusAt(blanks[at - 1])
                  }
                }}
              />
              {bad && <span className="ih-dc-fix">{w}</span>}
            </span>
          )
        })}
      </div>
      {checked && (
        <p className={`ih-dc-result ${correct === blanks.length ? 'ok' : 'bad'}`}>
          {correct === blanks.length ? '✓ Chính xác!' : `Đúng ${correct}/${blanks.length} từ — từ đúng hiện ngay dưới ô sai.`}
        </p>
      )}
      <div className="ih-dc-actions">
        <p className="ih-dc-hint">
          <span className="ih-dc-info" aria-hidden>
            i
          </span>
          <span>
            Nhấn phím <kbd>Space</kbd> để qua từ.
            <br />
            Chuyển qua <b>Unikey Eng</b> để tránh lỗi typing trên Macbook.
          </span>
        </p>
        <div className="ih-dc-btns">
          {checked && (
            <button type="button" className="ih-dc-btn ghost" onClick={reset}>
              Làm lại
            </button>
          )}
          {!checked && (
            <button type="button" className="ih-dc-btn primary" disabled={!anyTyped} onClick={check}>
              Kiểm tra
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ── HARD: gõ nguyên câu ───────────────────────────────────────────────────────────────────────
function HardAttempt({ s, onChecked }: { s: DSentence; onChecked: (ok: boolean) => void }) {
  const [text, setText] = useState('')
  const [result, setResult] = useState<{ ratio: number; hit: Set<number> } | null>(null)
  const [listening, setListening] = useState(false)
  const [micError, setMicError] = useState('')
  const stopRef = useRef<() => void>(() => {})
  const target = useMemo(() => speechWords(s.text), [s])
  const canMic = typeof window !== 'undefined' && isRecognitionSupported()

  const check = () => {
    if (!text.trim()) return
    const m = matchSpeech(s.text, [text])
    setResult({ ratio: m.ratio, hit: m.hit })
    onChecked(m.ratio >= PASS_TYPED)
  }
  const reset = () => {
    setText('')
    setResult(null)
    setMicError('')
  }
  const toggleMic = () => {
    if (listening) {
      stopRef.current()
      return
    }
    setMicError('')
    setListening(true)
    stopRef.current = listenOnce({
      lang: 'en-US',
      continuous: true,
      onResult: (heard) => setText((prev) => (prev.trim() ? prev.trimEnd() + ' ' : '') + (heard[0] ?? '')),
      onError: (code) => setMicError(code === 'not-allowed' ? 'Chưa cấp quyền micro cho trình duyệt.' : code === 'no-sound' ? 'Micro không thu được tiếng.' : code === 'no-speech' || code === 'no-result' ? 'Không nhận diện được giọng nói.' : `Lỗi micro (${code}).`),
      onEnd: () => setListening(false),
    })
  }
  useEffect(() => () => stopRef.current(), [])

  return (
    <>
      <div className="ih-dc-area">
        <textarea
          className="ih-dc-text"
          value={text}
          disabled={!!result}
          placeholder="Nhập những gì bạn nghe được"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          translate="no"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!result) check()
            }
          }}
        />
        {canMic && !result && (
          <button type="button" className={`ih-dc-mic${listening ? ' on' : ''}`} aria-label={listening ? 'Dừng ghi âm' : 'Nói để nhập'} aria-pressed={listening} onClick={toggleMic}>
            {iconMic}
          </button>
        )}
      </div>
      {micError && <p className="ih-dc-result bad">{micError}</p>}
      {result && (
        <div className={`ih-dc-result ${result.ratio >= PASS_TYPED ? 'ok' : 'bad'}`}>
          <p>
            {result.ratio >= PASS_TYPED ? '✓ Chính xác!' : 'Chưa đúng hoàn toàn.'} Khớp {Math.round(result.ratio * 100)}% — từ đúng màu xanh, từ thiếu/sai màu đỏ:
          </p>
          <p className="ih-dc-diff" translate="no">
            {target.map((w, i) => (
              <span key={i} className={result.hit.has(i) ? 'hit' : 'miss'}>
                {w}
              </span>
            ))}
          </p>
        </div>
      )}
      <div className="ih-dc-actions">
        <p className="ih-dc-hint">
          <span className="ih-dc-info" aria-hidden>
            i
          </span>
          <span>
            Nhấn phím <kbd>Enter</kbd> để kiểm tra.
            <br />
            Chuyển qua <b>Unikey Eng</b> để tránh lỗi typing trên Macbook.
          </span>
        </p>
        <div className="ih-dc-btns">
          <button type="button" className="ih-dc-btn ghost" disabled={!text && !result} onClick={reset}>
            Làm lại
          </button>
          <button type="button" className="ih-dc-btn primary" disabled={!text.trim() || !!result} onClick={check}>
            Kiểm tra
          </button>
        </div>
      </div>
    </>
  )
}

// ── Shadowing: nghe rồi nói theo câu, chấm bằng nhận diện giọng nói ─────────────────────────────
function ShadowAttempt({ s }: { s: DSentence }) {
  const [state, setState] = useState<'idle' | 'listening'>('idle')
  const [result, setResult] = useState<{ ratio: number; hit: Set<number>; heard: string } | null>(null)
  const [error, setError] = useState('')
  const stopRef = useRef<() => void>(() => {})
  const target = useMemo(() => speechWords(s.text), [s])
  const supported = typeof window !== 'undefined' && isRecognitionSupported()
  useEffect(() => () => stopRef.current(), [])

  const start = () => {
    if (state === 'listening') {
      stopRef.current()
      return
    }
    setError('')
    setResult(null)
    setState('listening')
    stopRef.current = listenOnce({
      lang: 'en-US',
      continuous: target.length > 20,
      onResult: (heard) => {
        const m = matchSpeech(s.text, heard)
        setResult({ ratio: m.ratio, hit: m.hit, heard: m.best })
      },
      onError: (code) => setError(code === 'not-allowed' ? 'Chưa cấp quyền micro cho trình duyệt.' : code === 'no-sound' ? 'Micro không thu được tiếng.' : code === 'no-speech' || code === 'no-result' ? 'Không nhận diện được giọng nói.' : `Lỗi micro (${code}).`),
      onEnd: () => setState('idle'),
    })
  }
  const pass = result ? result.ratio >= passRatioFor(s.text) : false
  return (
    <div className="ih-dc-shadow">
      <p className="ih-dc-shadow-cap">Nghe câu rồi đọc theo — bấm micro và nói lại:</p>
      <p className="ih-dc-diff big" translate="no">
        {target.map((w, i) => (
          <span key={i} className={result ? (result.hit.has(i) ? 'hit' : 'miss') : undefined}>
            {w}
          </span>
        ))}
      </p>
      {supported ? (
        <button type="button" className={`ih-dc-btn primary wide${state === 'listening' ? ' on' : ''}`} onClick={start}>
          {iconMic} {state === 'listening' ? 'Đang nghe… bấm để dừng' : 'Bấm để nói'}
        </button>
      ) : (
        <p className="ih-dc-result bad">Trình duyệt này không hỗ trợ nhận diện giọng nói (dùng Chrome hoặc Edge).</p>
      )}
      {error && <p className="ih-dc-result bad">{error}</p>}
      {result && (
        <p className={`ih-dc-result ${pass ? 'ok' : 'bad'}`}>
          {pass ? '✓ Phát âm tốt!' : 'Thử lại nhé.'} Khớp {Math.round(result.ratio * 100)}% · nghe được: “{result.heard}”
        </p>
      )}
    </div>
  )
}

// ── Trang chính ───────────────────────────────────────────────────────────────────────────────
export function DictationRunner({ dictation, backHref }: { dictation: Dictation; backHref: string }) {
  const sentences = dictation.sentences
  const total = sentences.length
  const src = audioSources(dictation)
  const [source, setSource] = useState(src.primary)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [idx, setIdx] = useState(0)
  const [mode, setMode] = useState<Mode>('easy')
  const [view, setView] = useState<View>('dictate')
  const [panel, setPanel] = useState<Panel>(null)
  const [done, setDone] = useState<number[]>([])
  const [rate, setRate] = useState(1)
  const [loop, setLoop] = useState(false)
  const [touched, setTouched] = useState(false) // đã có thao tác người dùng → được tự phát khi sang câu mới
  const [scriptOpen, setScriptOpen] = useState(false)
  const [checkedIdx, setCheckedIdx] = useState<Record<string, boolean>>({}) // `${idx}:${mode}` → đã kiểm tra
  const [elapsed, setElapsed] = useState(0)
  const loaded = useRef(false)

  // Nạp tiến độ + chế độ đã chọn (localStorage chỉ đọc được ở client)
  useEffect(() => {
    const p = loadDictationProgress()[dictation.id]
    /* eslint-disable react-hooks/set-state-in-effect */
    if (p) {
      setDone(p.done.filter((n) => n < total))
      if (p.last > 0 && p.last < total) setIdx(p.last)
    }
    try {
      if (localStorage.getItem(MODE_KEY) === 'hard') setMode('hard')
    } catch {
      // bỏ qua
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    loaded.current = true
  }, [dictation.id, total])
  useEffect(() => {
    if (loaded.current) saveDictationProgress(dictation.id, { done, last: idx })
  }, [dictation.id, done, idx])
  useEffect(() => {
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  const s = sentences[idx]
  const doneSet = useMemo(() => new Set(done), [done])
  const blankCount = blankIndexes(s).length
  const go = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(total - 1, i))
      setIdx(n)
      setScriptOpen(false)
      setTouched(true)
      window.scrollTo({ top: 0 })
    },
    [total],
  )
  const changeMode = (m: Mode) => {
    setMode(m)
    try {
      localStorage.setItem(MODE_KEY, m)
    } catch {
      // bỏ qua
    }
  }
  const onChecked = (ok: boolean) => {
    setCheckedIdx((c) => ({ ...c, [`${idx}:${mode}`]: true }))
    if (ok) setDone((d) => (d.includes(idx) ? d : [...d, idx].sort((a, b) => a - b)))
  }
  const attemptKey = `${idx}:${mode}`
  const wasChecked = !!checkedIdx[attemptKey]

  return (
    <div className="ih-dc-root">
      <audio
        ref={audioRef}
        src={source}
        preload="auto"
        onError={() => {
          if (src.fallback && source === src.primary) setSource(src.fallback)
        }}
      />

      <header className="ih-dc-top">
        <Link href={backHref} className="ih-dc-back" aria-label="Danh sách bài Dictation">
          ←
        </Link>
        <div className="ih-dc-title">
          <b>{dictation.title}</b>
          <span>
            Audio · {total} câu · {partLabel(dictation)}
          </span>
        </div>
        <div className="ih-dc-tools">
          <button type="button" className={`ih-dc-tool${panel === 'preview' ? ' on' : ''}`} onClick={() => setPanel(panel === 'preview' ? null : 'preview')}>
            <span aria-hidden>👁</span> Nghe trước
          </button>
          <button type="button" className={`ih-dc-tool${view === 'shadow' ? ' on' : ''}`} onClick={() => setView(view === 'shadow' ? 'dictate' : 'shadow')}>
            <span aria-hidden>🗣</span> Shadowing
          </button>
          <button type="button" className={`ih-dc-tool${panel === 'vocab' ? ' on' : ''}`} onClick={() => setPanel(panel === 'vocab' ? null : 'vocab')}>
            <span aria-hidden>🔤</span> Từ vựng
          </button>
          <span className="ih-dc-clock">⏱ {formatClock(elapsed)}</span>
        </div>
      </header>

      <main className="ih-dc-main">
        {panel === 'preview' && <PreviewPanel audioRef={audioRef} dictation={dictation} onClose={() => setPanel(null)} />}
        {panel === 'vocab' && <VocabPanel dictation={dictation} onJump={(i) => { setPanel(null); go(i) }} onClose={() => setPanel(null)} />}

        {panel === null && (
          <>
            <section className="ih-dc-card">
              <div className="ih-dc-nav">
                <button type="button" className="ih-dc-arrow" aria-label="Câu trước" disabled={idx === 0} onClick={() => go(idx - 1)}>
                  ←
                </button>
                <b className="ih-dc-count">
                  Câu {idx + 1}/{total}
                  {doneSet.has(idx) && (
                    <span className="ih-dc-tick" aria-label="Đã làm đúng">
                      ✓
                    </span>
                  )}
                </b>
                <button type="button" className="ih-dc-arrow" aria-label="Câu sau" disabled={idx === total - 1} onClick={() => go(idx + 1)}>
                  →
                </button>
                <span className="ih-dc-words-n">{blankCount} từ</span>
                {view === 'dictate' && (
                  <div className="ih-dc-seg" role="group" aria-label="Chế độ">
                    <button type="button" aria-pressed={mode === 'easy'} onClick={() => changeMode('easy')}>
                      EASY
                    </button>
                    <button type="button" aria-pressed={mode === 'hard'} onClick={() => changeMode('hard')}>
                      HARD
                    </button>
                  </div>
                )}
              </div>

              <SentencePlayer key={idx} audioRef={audioRef} s={s} rate={rate} loop={loop} autoPlay={touched} onRate={() => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length])} onLoop={() => setLoop((v) => !v)} />

              {view === 'dictate' ? (
                mode === 'easy' ? (
                  <EasyAttempt key={attemptKey} s={s} onChecked={onChecked} />
                ) : (
                  <HardAttempt key={attemptKey} s={s} onChecked={onChecked} />
                )
              ) : (
                <ShadowAttempt key={`sh-${idx}`} s={s} />
              )}

              {(wasChecked || view === 'shadow') && idx < total - 1 && (
                <div className="ih-dc-next">
                  <button type="button" className="ih-dc-btn primary" onClick={() => go(idx + 1)}>
                    Câu tiếp theo →
                  </button>
                </div>
              )}
            </section>

            <section className="ih-dc-card ih-dc-script">
              <button type="button" className="ih-dc-acc" aria-expanded={scriptOpen} onClick={() => setScriptOpen((v) => !v)}>
                Script, pronunciation &amp; translate
                <span className={`ih-dc-chev${scriptOpen ? ' open' : ''}`} aria-hidden>
                  ⌄
                </span>
              </button>
              {scriptOpen && (
                <div className="ih-dc-scriptbody">
                  <p className="ih-dc-lang">
                    ENGLISH <span className="ih-dc-langhint">Click vào từ để nghe phát âm</span>
                  </p>
                  <p className="ih-dc-eng" translate="no">
                    {s.words.map((w, i) =>
                      isPunct(w) ? (
                        <span key={i}>{w}</span>
                      ) : (
                        <button key={i} type="button" className={`ih-dc-w${spaceBefore(s.words[i - 1], w) ? ' sp' : ''}`} onClick={() => speak(w)}>
                          {w}
                        </button>
                      ),
                    )}
                  </p>
                  <button type="button" className="ih-dc-link" onClick={() => setView('shadow')}>
                    🗣 Luyện shadowing câu
                  </button>
                  {s.pw && s.pw.length > 0 && (
                    <ul className="ih-dc-pw">
                      {s.pw.map((p) => (
                        <li key={p.en}>
                          <button type="button" onClick={() => speak(p.en)}>
                            <b>{p.en}</b> {p.ipa && <i>/{p.ipa}/</i>}
                          </button>
                          <span>{p.vi}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.vi && (
                    <>
                      <p className="ih-dc-lang vi">VIETNAMESE</p>
                      <p className="ih-dc-vi">{s.vi}</p>
                    </>
                  )}
                </div>
              )}
            </section>

            <p className="ih-dc-progress">
              Đã làm đúng {done.length}/{total} câu
            </p>
          </>
        )}
      </main>
    </div>
  )
}

// ── Nghe trước: phát cả section, không hiện chữ ─────────────────────────────────────────────────
function PreviewPanel({ audioRef, dictation, onClose }: { audioRef: React.RefObject<HTMLAudioElement | null>; dictation: Dictation; onClose: () => void }) {
  const first = dictation.sentences[0].start / 1000
  const last = dictation.sentences[dictation.sentences.length - 1].end / 1000
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(first)
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    let raf = 0
    const tick = () => {
      setT(a.currentTime)
      if (a.currentTime >= last) a.pause()
      else raf = requestAnimationFrame(tick)
    }
    const onPlay = () => {
      setPlaying(true)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }
    const onPause = () => {
      setPlaying(false)
      cancelAnimationFrame(raf)
    }
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    a.pause()
    try {
      a.currentTime = first
    } catch {
      // chưa nạp metadata
    }
    return () => {
      cancelAnimationFrame(raf)
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      a.pause()
    }
  }, [audioRef, first, last])
  const current = dictation.sentences.findIndex((s) => t * 1000 >= s.start && t * 1000 < s.end)
  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (!a.paused) a.pause()
    else {
      if (a.currentTime >= last - 0.1 || a.currentTime < first) a.currentTime = first
      a.playbackRate = 1
      void a.play().catch(() => {})
    }
  }
  return (
    <section className="ih-dc-card ih-dc-preview">
      <h2>Nghe trước cả bài</h2>
      <p className="ih-dc-hint2">Nghe hết bài một lượt (không hiện chữ) để quen nội dung trước khi chép từng câu.</p>
      <div className="ih-dc-player">
        <button type="button" className="ih-dc-play" aria-label={playing ? 'Tạm dừng' : 'Phát'} onClick={toggle}>
          {playing ? iconPause : iconPlay}
        </button>
        <input
          type="range"
          className="ih-dc-range"
          aria-label="Vị trí trong bài"
          min={first}
          max={last}
          step={0.1}
          value={Math.min(Math.max(t, first), last)}
          onChange={(e) => {
            const v = Number(e.target.value)
            if (audioRef.current) audioRef.current.currentTime = v
            setT(v)
          }}
        />
        <span className="ih-dc-time">
          {formatClock(t - first)}/{formatClock(last - first)}
        </span>
      </div>
      <p className="ih-dc-hint2">{current >= 0 ? `Đang ở câu ${current + 1}/${dictation.sentences.length}` : ' '}</p>
      <button type="button" className="ih-dc-btn primary" onClick={onClose}>
        Bắt đầu chép →
      </button>
    </section>
  )
}

// ── Từ vựng của cả bài ─────────────────────────────────────────────────────────────────────────
function VocabPanel({ dictation, onJump, onClose }: { dictation: Dictation; onJump: (i: number) => void; onClose: () => void }) {
  const rows = dictation.sentences.flatMap((s, i) => (s.pw ?? []).map((p) => ({ i, p })))
  return (
    <section className="ih-dc-card ih-dc-vocab">
      <div className="ih-dc-vocab-head">
        <h2>Từ vựng trong bài ({rows.length})</h2>
        <button type="button" className="ih-dc-btn ghost" onClick={onClose}>
          Quay lại luyện
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="ih-dc-hint2">Bài này chưa có từ vựng gợi ý.</p>
      ) : (
        <ul className="ih-dc-pw wide">
          {rows.map(({ i, p }) => (
            <li key={`${i}-${p.en}`}>
              <button type="button" onClick={() => speak(p.en)} aria-label={`Nghe ${p.en}`}>
                <b>{p.en}</b> {p.ipa && <i>/{p.ipa}/</i>}
              </button>
              <span>{p.vi}</span>
              <button type="button" className="ih-dc-link" onClick={() => onJump(i)}>
                Câu {i + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
