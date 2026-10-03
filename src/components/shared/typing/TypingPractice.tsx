'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { speak } from '@/lib/shared/speech'
import { accuracy, type TypingEngine, type TypingItem as Item, type TypingPools } from './engine'
import { WordParts } from '@/components/shared/vocab/WordParts'
import './typing.css'

// Luyện gõ cho 1 bài (chỉ desktop — nút mở bị ẩn dưới 1024px), dùng chung cho Korean và Chinese; phần riêng của từng
// ngôn ngữ (bộ gõ, bàn phím ảo, giọng đọc) nằm trong `engine`, danh sách mục do wrapper của từng app dựng sẵn (`pools`).
// Nguồn: từ vựng / câu luyện nói / câu hội thoại. Mỗi mục có đồng hồ riêng; gõ đúng hết thì tự chấm, Enter để nộp sớm.
// Chấm xong: đúng/sai + % chính xác + thời gian, tự phát âm.
type Source = 'vocab' | 'speaking' | 'dialogue'

interface Settings {
  source: Source
  meaning: 'before' | 'after'
  reading: 'before' | 'after' // chỉ dùng khi engine có readingLabel (pinyin)
  scope: 'all' | 'unlearned'
  keyboard: boolean
  keyHint: boolean // bàn phím ảo tô sáng phím cần nhấn tiếp theo
  showImage: boolean // hiện ảnh minh hoạ của từ (nếu có)
  autoSpeak: boolean
  shuffle: boolean
}

const DEFAULT_SETTINGS: Settings = { source: 'vocab', meaning: 'before', reading: 'before', scope: 'all', keyboard: true, keyHint: true, showImage: true, autoSpeak: true, shuffle: false }

interface Result {
  item: Item
  typed: string
  correct: boolean
  acc: number
  ms: number
}

function loadSettings(key: string): Settings {
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(key) ?? '{}') as Partial<Settings>) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const fmt = (ms: number) => `${(ms / 1000).toFixed(1)}s`

export function TypingPractice({
  lessonLabel,
  engine,
  pools,
  onClose,
}: {
  lessonLabel: string
  engine: TypingEngine
  pools: TypingPools
  onClose: () => void
}) {
  // Modal chỉ mở sau khi bấm nút (client) nên đọc localStorage ngay lúc khởi tạo được
  const [settings, setSettings] = useState<Settings>(() => loadSettings(engine.storageKey))
  const [phase, setPhase] = useState<'setup' | 'typing' | 'summary'>('setup')
  const [queue, setQueue] = useState<Item[]>([])
  const [index, setIndex] = useState(0)
  const [tokens, setTokens] = useState<string[]>([])
  const [result, setResult] = useState<Result | null>(null) // kết quả của mục đang xem (null = đang gõ)
  const [results, setResults] = useState<Result[]>([])
  const [startAt, setStartAt] = useState(0)
  const [now, setNow] = useState(0)
  const [pressed, setPressed] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => rootRef.current?.focus(), [phase])

  function update(patch: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(engine.storageKey, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const pool = settings.source === 'vocab' ? (settings.scope === 'unlearned' ? pools.vocabUnlearned : pools.vocab) : pools[settings.source]

  const start = useCallback(
    (items: Item[]) => {
      setQueue(settings.shuffle ? shuffled(items) : items)
      setIndex(0)
      setTokens([])
      setResult(null)
      setResults([])
      setStartAt(performance.now())
      setNow(performance.now())
      setPhase('typing')
    },
    [settings.shuffle],
  )

  const item = queue[index]
  const typed = engine.compose(tokens)
  const targetTokens = useMemo(() => (item ? engine.toTokens(item.target) : []), [item, engine])
  const onTrack = tokens.length <= targetTokens.length && tokens.every((t, i) => t === targetTokens[i])
  const nextToken = !result && onTrack ? targetTokens[tokens.length] : undefined

  // Đồng hồ của mục đang gõ
  useEffect(() => {
    if (phase !== 'typing' || result) return
    const id = setInterval(() => setNow(performance.now()), 100)
    return () => clearInterval(id)
  }, [phase, result, index])

  const finish = useCallback(
    (finalTokens: string[]) => {
      if (!item) return
      const text = engine.compose(finalTokens)
      const r: Result = { item, typed: text, correct: text === item.target, acc: accuracy(text, item.target), ms: performance.now() - startAt }
      setResult(r)
      setResults((prev) => [...prev, r])
      if (settings.autoSpeak) speak(item.raw, engine.speechLang)
    },
    [item, startAt, settings.autoSpeak, engine],
  )

  const next = useCallback(() => {
    if (index + 1 >= queue.length) {
      setPhase('summary')
      return
    }
    setIndex(index + 1)
    setTokens([])
    setResult(null)
    setStartAt(performance.now())
    setNow(performance.now())
  }, [index, queue.length])

  function retry() {
    setResults((prev) => prev.slice(0, -1))
    setTokens([])
    setResult(null)
    setStartAt(performance.now())
    setNow(performance.now())
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }
    if (phase !== 'typing') return
    if (e.ctrlKey || e.metaKey || e.altKey) return
    setPressed(e.code)
    if (result) {
      if (e.key === 'Enter') {
        e.preventDefault()
        next()
      }
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (tokens.length > 0) finish(tokens) // chưa gõ gì thì Enter không tính là nộp (tránh lỡ tay)
      return
    }
    if (e.key === 'Backspace') {
      e.preventDefault()
      setTokens((t) => t.slice(0, -1))
      return
    }
    const tk = engine.keyToToken(e)
    if (!tk) return
    e.preventDefault()
    const nextTokens = [...tokens, tk]
    setTokens(nextTokens)
    if (item && engine.compose(nextTokens) === item.target) finish(nextTokens) // gõ đúng hết → tự chấm
  }

  // Tô sáng phím vừa nhấn trên bàn phím ảo
  useEffect(() => {
    if (!pressed) return
    const id = setTimeout(() => setPressed(null), 140)
    return () => clearTimeout(id)
  }, [pressed])

  const showMeaning = settings.meaning === 'before' || !!result
  const showReading = settings.reading === 'before' || !!result

  const content = (
    <div className="kt-backdrop" onClick={onClose}>
      <div ref={rootRef} className="kt-modal" tabIndex={-1} onKeyDown={onKeyDown} onClick={(e) => e.stopPropagation()}>
        <div className="kt-top">
          <div>
            <p className="kt-eyebrow">⌨️ Luyện gõ · {lessonLabel}</p>
            {phase === 'typing' && item && (
              <p className="kt-progress">
                {index + 1}/{queue.length}
                {item.label && <span className="kt-item-label">{item.label}</span>}
              </p>
            )}
          </div>
          <div className="kt-top-actions">
            {phase === 'typing' && (
              <>
                <span className="kt-timer" aria-label="Thời gian">
                  ⏱ {fmt((result ? result.ms : now - startAt) || 0)}
                </span>
                <button type="button" className="kt-btn" onClick={() => setPhase('setup')}>
                  ⚙ Thiết lập
                </button>
              </>
            )}
            <button type="button" className="kt-icon-btn" aria-label="Đóng (Esc)" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {phase === 'setup' && (
          <Setup engine={engine} settings={settings} update={update} counts={{ vocab: pools.vocab.length, unlearned: pools.vocabUnlearned.length, speaking: pools.speaking.length, dialogue: pools.dialogue.length }} poolSize={pool.length} onStart={() => start(pool)} />
        )}

        {phase === 'typing' && item && (
          <div className="kt-stage">
            {settings.showImage && item.image && (
              <div className="kt-image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img key={item.id} src={item.image} alt="" />
              </div>
            )}
            {!result && (
              <p className={`kt-meaning${showMeaning ? '' : ' kt-meaning-hidden'}`}>{showMeaning ? item.meaning || '—' : 'Nghĩa sẽ hiện sau khi gõ xong'}</p>
            )}
            {!result && showMeaning && item.meaningEn && (
              <p className="kt-meaning-en" lang="en">
                {item.meaningEn}
              </p>
            )}

            {item.display ? (
              // Đề là chữ Hán (Chinese): người học gõ pinyin, ô nhập tô màu từng chữ cái so với đáp án
              <>
                <p className="kt-display" lang="zh">
                  {item.display}
                </p>
                {item.reading && (
                  <p className={`kt-reading${showReading ? '' : ' kt-meaning-hidden'}`}>
                    {showReading ? item.reading : `${engine.readingLabel ?? 'Cách đọc'} sẽ hiện sau khi gõ xong`}
                  </p>
                )}
                <div className={`kt-input${result ? (result.correct ? ' correct' : ' wrong') : ''}`} aria-live="polite">
                  <span lang={engine.inputLang}>
                    <Chars text={typed} target={item.target} onTrack={onTrack} done={!!result} typedOnly />
                  </span>
                  {!result && <span className="kt-caret" />}
                  {!typed && !result && <span className="kt-placeholder">{engine.placeholder}</span>}
                </div>
              </>
            ) : (
              <>
                <p className="kt-target" lang={engine.inputLang}>
                  <Chars text={typed} target={item.target} onTrack={onTrack} done={!!result} />
                </p>
                <div className={`kt-input${result ? (result.correct ? ' correct' : ' wrong') : ''}`} aria-live="polite">
                  <span lang={engine.inputLang}>{typed}</span>
                  {!result && <span className="kt-caret" />}
                  {!typed && !result && <span className="kt-placeholder">{engine.placeholder}</span>}
                </div>
              </>
            )}

            {result ? (
              <div className={`kt-result ${result.correct ? 'correct' : 'wrong'}`}>
                {/* Gọn để cả màn vừa 1 khung nhìn (không cuộn): nút ở cùng hàng kết quả, nghĩa + cấu tạo từ xếp ngang */}
                <div className="kt-result-top">
                  <p className="kt-result-head">
                    {result.correct ? '✓ Chính xác' : '✗ Chưa chính xác'}
                    <span className="kt-result-stat">
                      {Math.round(result.acc * 100)}% · {fmt(result.ms)}
                    </span>
                    <button type="button" className="kt-speak" aria-label="Nghe lại" onClick={() => speak(item.raw, engine.speechLang)}>
                      🔊
                    </button>
                  </p>
                  <div className="kt-result-actions">
                    <button type="button" className="kt-btn" onClick={retry}>
                      ↺ Gõ lại
                    </button>
                    <button type="button" className="kt-btn kt-btn-solid" onClick={next}>
                      {index + 1 >= queue.length ? 'Xem kết quả' : 'Tiếp theo'} ↵
                    </button>
                  </div>
                </div>
                {!result.correct && (
                  <p className="kt-result-diff">
                    Đáp án: <b lang={engine.inputLang}>{item.target}</b>
                    {result.typed && (
                      <>
                        {' '}· Bạn gõ: <span lang={engine.inputLang}>{result.typed}</span>
                      </>
                    )}
                  </p>
                )}
                {(item.meaning || item.parts || item.example) && (
                  <div className="kt-result-body">
                    {item.meaning && (
                      <div className="kt-result-meaning">
                        <span className="kt-result-label">Nghĩa</span>
                        <p>{item.meaning}</p>
                        {item.meaningEn && (
                          <p className="kt-result-meaning-en" lang="en">
                            {item.meaningEn}
                          </p>
                        )}
                      </div>
                    )}
                    {item.parts && <WordParts parts={item.parts} lang={engine.speechLang} className="kt-parts" />}
                    {item.example && (
                      <div className="kt-result-example">
                        <span className="kt-result-label">Ví dụ</span>
                        <p className="kt-example-line" lang={engine.speechLang}>
                          <button type="button" className="kt-speak" aria-label="Đọc câu ví dụ" onClick={() => speak(item.example!, engine.speechLang)}>
                            🔊
                          </button>
                          {item.example}
                        </p>
                        {item.exampleReading && <p className="kt-example-reading">{item.exampleReading}</p>}
                        {item.exampleVi && <p className="kt-example-vi">{item.exampleVi}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="kt-hint">
                Gõ đúng hết sẽ tự chấm · <kbd>Enter</kbd> nộp sớm · <kbd>Backspace</kbd> xoá 1 phím · <kbd>Esc</kbd> đóng
              </p>
            )}

            {settings.keyboard && <VirtualKeyboard engine={engine} next={settings.keyHint ? nextToken : undefined} offTrack={settings.keyHint && !onTrack && !result} pressed={pressed} />}
          </div>
        )}

        {phase === 'summary' && <Summary engine={engine} results={results}onAgain={() => start(queue)} onWrong={() => start(results.filter((r) => !r.correct).map((r) => r.item))} onSetup={() => setPhase('setup')} />}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

// Chuỗi đã gõ tô màu theo đáp án: ok / bad / pending (ký tự cuối còn đang ghép âm tiết, vd Hangul).
// Không có typedOnly → hiện cả đáp án, ký tự chưa gõ để mờ (đề cho Korean).
function Chars({ text, target, onTrack, done, typedOnly }: { text: string; target: string; onTrack: boolean; done: boolean; typedOnly?: boolean }) {
  const typed = [...text]
  const goal = [...target]
  const chars = typedOnly ? typed : goal
  return (
    <>
      {chars.map((_, i) => {
        const t = typed[i]
        const ch = goal[i]
        const last = i === typed.length - 1
        let cls = 'kt-ch'
        if (t !== undefined) cls += t === ch ? ' ok' : last && onTrack && !done ? ' pending' : ' bad'
        else if (i === typed.length && !done) cls += ' cur'
        const shown = typedOnly ? t : ch
        return (
          <span key={i} className={cls}>
            {shown === ' ' ? ' ' : shown}
          </span>
        )
      })}
    </>
  )
}

function Setup({
  engine,
  settings,
  update,
  counts,
  poolSize,
  onStart,
}: {
  engine: TypingEngine
  settings: Settings
  update: (p: Partial<Settings>) => void
  counts: { vocab: number; unlearned: number; speaking: number; dialogue: number }
  poolSize: number
  onStart: () => void
}) {
  const sources: [Source, string, number][] = [
    ['vocab', '📚 Từ vựng', counts.vocab],
    ['speaking', '🗣️ Luyện nói', counts.speaking],
    ['dialogue', '💬 Hội thoại', counts.dialogue],
  ]
  return (
    <div className="kt-setup">
      <div className="kt-field">
        <span className="kt-field-label">Luyện gõ theo</span>
        <div className="kt-seg">
          {sources.map(([key, label, n]) => (
            <button key={key} type="button" disabled={n === 0} className={settings.source === key ? 'on' : ''} onClick={() => update({ source: key })}>
              {label} <span className="kt-seg-count">{n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="kt-field">
        <span className="kt-field-label">Từ cần luyện</span>
        <div className="kt-seg">
          <button type="button" className={settings.scope === 'all' ? 'on' : ''} disabled={settings.source !== 'vocab'} onClick={() => update({ scope: 'all' })}>
            Tất cả từ trong bài <span className="kt-seg-count">{counts.vocab}</span>
          </button>
          <button type="button" className={settings.scope === 'unlearned' ? 'on' : ''} disabled={settings.source !== 'vocab'} onClick={() => update({ scope: 'unlearned' })}>
            Chỉ từ chưa thuộc <span className="kt-seg-count">{counts.unlearned}</span>
          </button>
        </div>
        {settings.source !== 'vocab' && <span className="kt-field-note">Chỉ áp dụng khi luyện theo từ vựng</span>}
      </div>

      <div className="kt-field">
        <span className="kt-field-label">Hiện nghĩa</span>
        <div className="kt-seg">
          <button type="button" className={settings.meaning === 'before' ? 'on' : ''} onClick={() => update({ meaning: 'before' })}>
            Trước khi gõ
          </button>
          <button type="button" className={settings.meaning === 'after' ? 'on' : ''} onClick={() => update({ meaning: 'after' })}>
            Sau khi gõ xong
          </button>
        </div>
      </div>

      {engine.readingLabel && (
        <div className="kt-field">
          <span className="kt-field-label">Hiện {engine.readingLabel}</span>
          <div className="kt-seg">
            <button type="button" className={settings.reading === 'before' ? 'on' : ''} onClick={() => update({ reading: 'before' })}>
              Trước khi gõ
            </button>
            <button type="button" className={settings.reading === 'after' ? 'on' : ''} onClick={() => update({ reading: 'after' })}>
              Sau khi gõ xong
            </button>
          </div>
        </div>
      )}

      <div className="kt-field kt-field-options">
        <span className="kt-field-label">Tuỳ chọn</span>
        <div className="kt-toggles">
          <Toggle checked={settings.keyboard} onChange={(v) => update({ keyboard: v })} title="Hiện bàn phím ảo" desc={`${engine.keyboardName} bên dưới ô gõ`} />
          <Toggle
            checked={settings.keyboard && settings.keyHint}
            disabled={!settings.keyboard}
            onChange={(v) => update({ keyHint: v })}
            title="Gợi ý phím tiếp theo"
            desc="Tô sáng phím cần nhấn trên bàn phím ảo"
            sub
          />
          <Toggle checked={settings.showImage} onChange={(v) => update({ showImage: v })} title="Hiện hình minh hoạ" desc="Ảnh của từ vựng (nếu có) phía trên chữ cần gõ" />
          <Toggle checked={settings.autoSpeak} onChange={(v) => update({ autoSpeak: v })} title="Tự phát âm" desc="Đọc từ/câu ngay sau khi gõ xong" />
          <Toggle checked={settings.shuffle} onChange={(v) => update({ shuffle: v })} title="Trộn thứ tự" desc="Xáo các mục mỗi lần bắt đầu" />
        </div>
      </div>

      <button type="button" className="kt-btn kt-btn-solid kt-start" disabled={poolSize === 0} onClick={onStart}>
        {poolSize === 0 ? 'Không có mục nào để luyện' : `Bắt đầu · ${poolSize} mục`}
      </button>
    </div>
  )
}

// Công tắc gạt (switch) — thay checkbox mặc định của trình duyệt
function Toggle({ checked, onChange, title, desc, disabled, sub }: { checked: boolean; onChange: (v: boolean) => void; title: string; desc: string; disabled?: boolean; sub?: boolean }) {
  return (
    <label className={`kt-toggle${sub ? ' kt-toggle-sub' : ''}${disabled ? ' kt-toggle-disabled' : ''}`}>
      <input type="checkbox" role="switch" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="kt-switch" aria-hidden="true" />
      <span className="kt-toggle-text">
        <span className="kt-toggle-title">{title}</span>
        <span className="kt-toggle-desc">{desc}</span>
      </span>
    </label>
  )
}

function VirtualKeyboard({ engine, next, offTrack, pressed }: { engine: TypingEngine; next?: string; offTrack: boolean; pressed: string | null }) {
  const hint = next ? engine.keyFor(next) : undefined
  const hintCode = hint?.code ?? (next === ' ' ? 'Space' : undefined)
  const keyCls = (code: string) => `kt-key${code === hintCode ? ' next' : ''}${code === pressed ? ' pressed' : ''}`
  return (
    <div className="kt-kb" aria-hidden="true">
      {engine.keyRows.map((row, ri) => (
        <div key={ri} className={`kt-kb-row kt-kb-row-${ri}`}>
          {ri === 2 && <span className={`kt-key kt-key-wide${hint?.shift ? ' next' : ''}${pressed === 'ShiftLeft' ? ' pressed' : ''}`}>Shift</span>}
          {row.map(([code, base, shifted]) => (
            <span key={code} className={keyCls(code)}>
              <span className="kt-key-jamo">{hint?.shift && code === hintCode ? shifted : base}</span>
              {shifted !== base && <span className="kt-key-shift">{shifted}</span>}
              {base.toUpperCase() !== code.slice(3) && <span className="kt-key-latin">{code.slice(3)}</span>}
            </span>
          ))}
          {ri === 0 && <span className={`kt-key kt-key-wide${offTrack ? ' warn' : ''}${pressed === 'Backspace' ? ' pressed' : ''}`}>⌫</span>}
          {ri === 1 && <span className={`kt-key kt-key-wide${pressed === 'Enter' ? ' pressed' : ''}`}>Enter</span>}
        </div>
      ))}
      <div className="kt-kb-row">
        <span className={`kt-key kt-key-space${hintCode === 'Space' ? ' next' : ''}${pressed === 'Space' ? ' pressed' : ''}`}>Space</span>
      </div>
      {next && !hint && next !== ' ' && <p className="kt-kb-note">Phím tiếp theo: {next}</p>}
      {offTrack && <p className="kt-kb-note warn">Gõ lệch rồi — nhấn ⌫ để sửa</p>}
    </div>
  )
}

function Summary({ engine, results, onAgain, onWrong, onSetup }: { engine: TypingEngine; results: Result[]; onAgain: () => void; onWrong: () => void; onSetup: () => void }) {
  const correct = results.filter((r) => r.correct).length
  const avgAcc = results.length ? results.reduce((s, r) => s + r.acc, 0) / results.length : 0
  const total = results.reduce((s, r) => s + r.ms, 0)
  const wrong = results.filter((r) => !r.correct)
  return (
    <div className="kt-summary">
      <div className="kt-stats">
        <div>
          <b>
            {correct}/{results.length}
          </b>
          <span>chính xác</span>
        </div>
        <div>
          <b>{Math.round(avgAcc * 100)}%</b>
          <span>độ chính xác TB</span>
        </div>
        <div>
          <b>{fmt(results.length ? total / results.length : 0)}</b>
          <span>mỗi mục</span>
        </div>
        <div>
          <b>{fmt(total)}</b>
          <span>tổng thời gian</span>
        </div>
      </div>

      <table className="kt-table">
        <tbody>
          {results.map((r, i) => (
            <tr key={i} className={r.correct ? '' : 'wrong'}>
              <td>{r.correct ? '✓' : '✗'}</td>
              <td>
                {r.item.display && (
                  <span className="kt-table-display" lang="zh">
                    {r.item.display}{' '}
                  </span>
                )}
                <span lang={engine.inputLang}>{r.item.display ? (r.item.reading ?? r.item.target) : r.item.target}</span>
                {!r.correct && r.typed && <span className="kt-table-typed"> ({r.typed})</span>}
              </td>
              <td className="kt-table-meaning">{r.item.meaning}</td>
              <td>{Math.round(r.acc * 100)}%</td>
              <td>{fmt(r.ms)}</td>
              <td>
                <button type="button" className="kt-speak" aria-label="Nghe" onClick={() => speak(r.item.raw, engine.speechLang)}>
                  🔊
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="kt-result-actions">
        <button type="button" className="kt-btn" onClick={onSetup}>
          ⚙ Đổi thiết lập
        </button>
        {wrong.length > 0 && (
          <button type="button" className="kt-btn" onClick={onWrong}>
            Luyện lại {wrong.length} mục sai
          </button>
        )}
        <button type="button" className="kt-btn kt-btn-solid" onClick={onAgain}>
          Luyện lại từ đầu
        </button>
      </div>
    </div>
  )
}
