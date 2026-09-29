'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  loadExerciseProgress,
  saveExerciseProgress,
  type QuizChoiceItem,
  type QuizCompletionItem,
  type QuizItem,
  type QuizRepeatChunk,
  type QuizRepeatItem,
  type QuizSegment,
  type QuizSet,
  type QuizTypingItem,
} from '@/lib/ielts/practice'
import { skillLabel } from '@/lib/ielts/skills'
import { isRecognitionSupported, LONG_WORDS, listenOnce, matchSpeech, passRatioFor, speechWords } from '@/lib/shared/recognize'
import { speak, stopSpeaking } from '@/lib/shared/speech'
import { renderExplanation } from './ExerciseSetStudy'
import { shuffle } from './MatchingSetStudy'

type Checked = 'idle' | 'correct' | 'incorrect'
const NO_MAP: Record<string, string> = {}

// So đáp án gõ tự do: không phân biệt hoa/thường, gộp khoảng trắng, bỏ khoảng trắng trước dấu câu và dấu câu ở
// hai đầu, thống nhất dấu nháy cong/thẳng.
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’´`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/^[\s.,;:!?]+|[\s.,;:!?]+$/g, '')
}

// Ô "Chọn đáp án" dạng dropdown — cùng markup/CSS với màn Nối endings (ih-bank-*). Dùng cho chỗ trống của bài
// điền và cho từng dòng của bài nối.
function BankSelect({
  value,
  options,
  usedKeys,
  state,
  locked,
  onPick,
}: {
  value: string | undefined
  options: { key: string; value: string }[]
  usedKeys: Set<string>
  state: 'ok' | 'bad' | null
  locked: boolean
  onPick: (key: string | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const picked = value ? options.find((o) => o.key === value) : undefined
  return (
    <span className="ih-bank-target-wrap">
      <button
        type="button"
        className={`ih-bank-target${picked ? ' filled' : ''}${state === 'ok' ? ' ih-match-ok' : ''}${state === 'bad' ? ' ih-match-bad' : ''}`}
        disabled={locked}
        onClick={() => setOpen((v) => !v)}
      >
        {picked ? picked.value : 'Chọn đáp án'}
        <span className="ih-bank-target-caret" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <>
          <div className="ih-bank-backdrop" onClick={() => setOpen(false)} />
          <div className="ih-bank-dropdown" role="listbox">
            {picked && (
              <button
                type="button"
                className="ih-bank-dropdown-opt"
                onClick={() => {
                  onPick(undefined)
                  setOpen(false)
                }}
              >
                ✕ Bỏ chọn
              </button>
            )}
            {options.map((o) => (
              <button
                key={o.key}
                type="button"
                className={`ih-bank-dropdown-opt${o.key === value ? ' selected' : ''}`}
                disabled={usedKeys.has(o.key) && o.key !== value}
                onClick={() => {
                  onPick(o.key)
                  setOpen(false)
                }}
              >
                {o.value}
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  )
}

// Thẻ ngân hàng đáp án phía trên (bài điền + bài nối): bấm 1 thẻ = gán vào ô trống đầu tiên chưa điền.
function Pool({ options, usedKeys, locked, onAssign }: { options: { key: string; value: string }[]; usedKeys: Set<string>; locked: boolean; onAssign: (key: string) => void }) {
  return (
    <div className="ih-sb-pool">
      {options.map((o) => (
        <button key={o.key} type="button" className={`ih-sb-tag${usedKeys.has(o.key) ? ' used' : ''}`} disabled={locked} onClick={() => onAssign(o.key)}>
          {o.value}
        </button>
      ))}
    </div>
  )
}

function blankKeys(item: QuizCompletionItem | QuizTypingItem): string[] {
  return item.body.flatMap((para) => para.flatMap((seg) => ('blank' in seg ? [seg.blank] : [])))
}

function Paragraphs({ body, renderBlank }: { body: QuizSegment[][]; renderBlank: (key: string) => React.ReactNode }) {
  return (
    <div className="ih-quiz-body">
      {body.map((para, i) => (
        <p key={i} className="ih-quiz-para">
          {para.map((seg, j) =>
            'blank' in seg ? (
              <span key={j}>{renderBlank(seg.blank)}</span>
            ) : seg.bold ? (
              <strong key={j}>{seg.text}</strong>
            ) : (
              <span key={j}>{seg.text}</span>
            ),
          )}
        </p>
      ))}
    </div>
  )
}

// Nút loa bật/tắt: bấm để đọc (🔊), đang đọc thì đổi thành ⏹ và bấm lần nữa sẽ dừng. Bấm loa khác thì loa này tự trở
// về 🔊 (speak() huỷ lượt đọc cũ và lượt cũ vẫn gọi onEnd).
function SpeakButton({ text, label }: { text: string; label: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <button
      type="button"
      className="ih-vocab-speak"
      aria-label={playing ? `Dừng đọc ${label}` : `Nghe ${label}`}
      aria-pressed={playing}
      onClick={() => {
        if (playing) {
          stopSpeaking()
          setPlaying(false)
          return
        }
        setPlaying(true)
        speak(text, 'en-US', undefined, () => setPlaying(false))
      }}
    >
      {playing ? '⏹' : '🔊'}
    </button>
  )
}

const MIC_ERRORS: Record<string, string> = {
  'not-allowed': 'Trình duyệt đang chặn micro — hãy cho phép quyền micro cho trang này rồi thử lại.',
  'service-not-allowed': 'Trình duyệt đang chặn micro — hãy cho phép quyền micro cho trang này rồi thử lại.',
  'no-speech': 'Không nghe thấy giọng nói — bấm ghi âm và thử lại nhé.',
  'audio-capture': 'Không tìm thấy micro trên thiết bị này.',
  network: 'Nhận diện giọng nói cần kết nối mạng.',
  'no-sound': 'Micro không thu được âm thanh — kiểm tra micro đang chọn (trong trình duyệt và Windows), nói to hơn rồi thử lại.',
  'no-result':
    'Trình duyệt thu được tiếng nhưng dịch vụ nhận diện không trả kết quả. Nếu dùng Edge: bật Windows Settings → Privacy & security → Speech → “Online speech recognition”, hoặc thử Chrome. Bạn vẫn có thể bấm “Tự đánh giá”.',
  'start-failed': 'Không bật được micro — tải lại trang rồi thử lại.',
}

// Bài nói lặp lại: câu gốc (nghe được) → câu mẫu để nói (bấm vào cụm gạch chân để xem nghĩa) → ghi âm. Máy nghe rồi
// so từng từ với câu mẫu (đạt từ passRatioFor trở lên là đúng); trình duyệt không hỗ trợ / nghe sai thì người học
// vẫn có thể tự đánh giá. Đặt key theo lần làm để "Làm lại" xoá sạch kết quả cũ.
function RepeatBody({ item, checked, onResult }: { item: QuizRepeatItem; checked: Checked; onResult: (ok: boolean) => void }) {
  const [canListen, setCanListen] = useState(false)
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState<{ text: string; missed: string[]; extra: boolean } | null>(null)
  const [error, setError] = useState('')
  const [meaning, setMeaning] = useState<QuizRepeatChunk | null>(null)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Chỉ biết trình duyệt có hỗ trợ hay không sau khi hydrate (SSR không có window)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanListen(isRecognitionSupported())
    return () => {
      stopRef.current?.()
      stopSpeaking() // rời màn thì thôi đọc
    }
  }, [])

  function toggleListen() {
    if (listening) {
      stopRef.current?.()
      return
    }
    stopSpeaking() // đang đọc mà bấm ghi âm thì tắt loa, kẻo micro thu lại chính tiếng loa
    setError('')
    setHeard(null)
    setListening(true)
    stopRef.current = listenOnce({
      lang: 'en-US',
      continuous: speechWords(item.script).length > LONG_WORDS, // đoạn dài: nghe liền tới khi người học bấm dừng
      onResult: (alts) => {
        const m = matchSpeech(item.script, alts)
        const missed = speechWords(item.script).filter((_, i) => !m.hit.has(i))
        const pass = passRatioFor(item.script)
        setHeard({ text: m.best, missed, extra: missed.length === 0 && m.ratio < pass })
        onResult(m.ratio >= pass)
      },
      onError: (code) => setError(MIC_ERRORS[code] ?? 'Không nhận diện được giọng nói, thử lại nhé.'),
      onEnd: () => setListening(false),
    })
  }

  return (
    <div className="ih-rep">
      <p className="ih-rep-prompt">
        <SpeakButton text={item.prompt} label="câu gốc" />
        {item.prompt}
      </p>
      <div className="ih-rep-bubble">
        <SpeakButton text={item.script} label="câu mẫu" />
        <span className="ih-rep-script">
          {item.chunks.map((c, i) => {
            const gap = i > 0 && !c.punct ? ' ' : ''
            return c.meaning ? (
              <span key={i}>
                {gap}
                <button type="button" className={`ih-rep-chunk${meaning === c ? ' open' : ''}`} onClick={() => setMeaning(meaning === c ? null : c)}>
                  {c.text}
                </button>
              </span>
            ) : (
              <span key={i}>
                {gap}
                {c.text}
              </span>
            )
          })}
        </span>
      </div>
      {meaning && (
        <p className="ih-rep-meaning">
          <strong>{meaning.text}</strong> = {meaning.meaning}
        </p>
      )}
      <div className="ih-rep-actions">
        {canListen ? (
          <button type="button" className={`ih-btn-solid${listening ? ' ih-rep-listening' : ''}`} onClick={toggleListen} disabled={checked === 'correct'}>
            {listening ? '⏹ Đang nghe… bấm để dừng' : '🎤 Nhấn để ghi âm'}
          </button>
        ) : (
          <p className="ih-quiz-hint">Trình duyệt này chưa hỗ trợ nhận diện giọng nói (dùng Chrome hoặc Edge để được chấm tự động) — hãy đọc to câu mẫu rồi tự đánh giá.</p>
        )}
        {checked !== 'correct' && (
          <button type="button" className="ih-btn-outline" onClick={() => onResult(true)}>
            ✓ Tự đánh giá: mình đã nói đúng
          </button>
        )}
      </div>
      {error && <p className="ih-rep-error">{error}</p>}
      {heard && (
        <p className="ih-rep-heard">
          Máy nghe được: “{heard.text}”
          {heard.missed.length > 0 && (
            <>
              {' '}
              · chưa khớp: <strong>{heard.missed.join(', ')}</strong>
            </>
          )}
          {heard.extra && ' · bạn nói thừa nhiều từ so với câu mẫu, hãy nói đúng câu trong khung.'}
        </p>
      )}
    </div>
  )
}

// Trạng thái làm bài của 1 màn. Đặt key={item.id} ở chỗ dùng để mỗi màn có state mới.
function QuizItemView({ item, onSolved, onNext }: { item: QuizItem; onSolved: () => void; onNext: (() => void) | null }) {
  const [picked, setPicked] = useState<string[]>([]) // choice
  const [pairs, setPairs] = useState<Record<string, string>>({}) // completion: blankKey→bankKey, matching: promptKey→optionKey
  const [order, setOrder] = useState<string[]>([]) // order: key các câu đã xếp, theo thứ tự bấm
  const [typed, setTyped] = useState<Record<string, string>>({}) // typing: blankKey→chữ đã gõ
  const [checked, setChecked] = useState<Checked>('idle')
  const [showExplanation, setShowExplanation] = useState(false)
  const [revealed, setRevealed] = useState(false) // typing: đã bấm "Xem đáp án"
  const [attempt, setAttempt] = useState(0) // repeat: tăng mỗi lần "Làm lại" để RepeatBody mất kết quả cũ

  const bank = useMemo(() => {
    if (item.type === 'completion') return shuffle(item.bank)
    if (item.type === 'matching' || item.type === 'order') return shuffle(item.options)
    return []
  }, [item])

  const slots: string[] =
    item.type === 'completion' || item.type === 'typing' ? blankKeys(item) : item.type === 'matching' ? item.prompts.map((p) => p.key) : []
  const correctMap: Record<string, string> = item.type === 'completion' || item.type === 'matching' ? item.correctMap : NO_MAP
  // Mục ngân hàng đúng cho >1 chỗ trống (vd cùng 1 đáp án lặp lại) thì được dùng nhiều lần
  const reusable = useMemo(() => {
    const count: Record<string, number> = {}
    for (const v of Object.values(correctMap)) count[v] = (count[v] ?? 0) + 1
    return new Set(Object.keys(count).filter((k) => count[k] > 1))
  }, [correctMap])
  const usedKeys = new Set(Object.values(pairs).filter((k) => !reusable.has(k)))
  const locked = checked === 'correct'

  function touch() {
    if (checked === 'incorrect') setChecked('idle')
  }

  function assign(slot: string, key: string | undefined) {
    if (locked) return
    setPairs((prev) => {
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(prev)) if (v !== key || reusable.has(v)) next[k] = v // 1 mục chỉ gán được cho 1 chỗ (trừ mục dùng lại được)
      if (key) next[slot] = key
      else delete next[slot]
      return next
    })
    touch()
  }

  function assignFirstEmpty(key: string) {
    const slot = slots.find((s) => !pairs[s])
    if (slot) assign(slot, key)
  }

  function togglePick(c: QuizChoiceItem, key: string) {
    if (locked) return
    setPicked((prev) => (c.multiple ? (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]) : [key]))
    touch()
  }

  const ready =
    item.type === 'choice'
      ? picked.length > 0
      : item.type === 'order'
        ? order.length === item.options.length
        : item.type === 'typing'
          ? slots.every((s) => (typed[s] ?? '').trim())
          : slots.every((s) => pairs[s])

  function check() {
    let ok: boolean
    if (item.type === 'choice') ok = picked.length === item.correct.length && item.correct.every((k) => picked.includes(k))
    else if (item.type === 'order') ok = order.length === item.correct.length && order.every((k, i) => k === item.correct[i])
    else if (item.type === 'typing') ok = slots.every((s) => item.answers[s]?.some((a) => normalize(a) === normalize(typed[s] ?? '')))
    else ok = slots.every((s) => pairs[s] === correctMap[s])
    setChecked(ok ? 'correct' : 'incorrect')
    if (ok) onSolved()
  }

  function reset() {
    setPicked([])
    setPairs({})
    setOrder([])
    setTyped({})
    setChecked('idle')
    setShowExplanation(false)
    setRevealed(false)
    setAttempt((n) => n + 1)
  }

  const slotState = (slot: string): 'ok' | 'bad' | null => {
    if (checked === 'idle' || !pairs[slot]) return null
    return pairs[slot] === correctMap[slot] ? 'ok' : checked === 'incorrect' ? 'bad' : 'ok'
  }

  const orderText = (key: string) => (item.type === 'order' ? (item.options.find((o) => o.key === key)?.value ?? '') : '')

  return (
    <div className="ih-sb-card">
      <div className="ih-sb-topbar">
        <h2 className="ih-sb-instruction">{item.instruction}</h2>
      </div>
      {item.context && <p className="ih-match-context">{item.context}</p>}

      {item.type === 'choice' && (
        <div className="ih-quiz-opts" role={item.multiple ? 'group' : 'radiogroup'}>
          {item.multiple && <p className="ih-quiz-hint">Chọn tất cả đáp án đúng</p>}
          {item.options.map((o) => {
            const isPicked = picked.includes(o.key)
            const isRight = item.correct.includes(o.key)
            const mark = checked === 'idle' ? '' : isPicked && isRight ? ' ok' : isPicked ? ' bad' : checked === 'correct' && isRight ? ' ok' : ''
            return (
              <button
                key={o.key}
                type="button"
                role={item.multiple ? 'checkbox' : 'radio'}
                aria-checked={isPicked}
                className={`ih-quiz-opt${isPicked ? ' picked' : ''}${mark}`}
                disabled={locked}
                onClick={() => togglePick(item, o.key)}
              >
                <span className="ih-quiz-opt-box" aria-hidden>
                  {isPicked ? '✓' : ''}
                </span>
                {o.value}
              </button>
            )
          })}
        </div>
      )}

      {item.type === 'completion' && (
        <>
          <Pool options={bank} usedKeys={usedKeys} locked={locked} onAssign={assignFirstEmpty} />
          <Paragraphs
            body={item.body}
            renderBlank={(k) => <BankSelect value={pairs[k]} options={bank} usedKeys={usedKeys} state={slotState(k)} locked={locked} onPick={(key) => assign(k, key)} />}
          />
        </>
      )}

      {item.type === 'matching' && (
        <>
          <Pool options={bank} usedKeys={usedKeys} locked={locked} onAssign={assignFirstEmpty} />
          <div className="ih-match-rows">
            {item.prompts.map((p) => (
              <div key={p.key} className={`ih-match-row2${slotState(p.key) === 'ok' ? ' correct' : ''}${slotState(p.key) === 'bad' ? ' wrong' : ''}`}>
                <span className="ih-match-row2-vi">{p.value}</span>
                <span className="ih-match-row2-line" aria-hidden />
                <BankSelect value={pairs[p.key]} options={bank} usedKeys={usedKeys} state={slotState(p.key)} locked={locked} onPick={(k) => assign(p.key, k)} />
              </div>
            ))}
          </div>
        </>
      )}

      {item.type === 'order' && (
        <>
          <p className="ih-quiz-hint">Bấm các câu bên dưới theo đúng thứ tự. Bấm lại câu đã chọn để bỏ nó ra.</p>
          <ol className="ih-quiz-order">
            {order.map((key, i) => {
              const mark = checked === 'incorrect' ? (key === item.correct[i] ? ' ok' : ' bad') : checked === 'correct' ? ' ok' : ''
              return (
                <li key={key}>
                  <button
                    type="button"
                    className={`ih-quiz-opt picked${mark}`}
                    disabled={locked}
                    onClick={() => {
                      setOrder((prev) => prev.filter((k) => k !== key))
                      touch()
                    }}
                  >
                    <span className="ih-quiz-opt-box" aria-hidden>
                      {i + 1}
                    </span>
                    {orderText(key)}
                  </button>
                </li>
              )
            })}
          </ol>
          {!locked && (
            <div className="ih-quiz-opts">
              {bank
                .filter((o) => !order.includes(o.key))
                .map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    className="ih-quiz-opt"
                    onClick={() => {
                      setOrder((prev) => [...prev, o.key])
                      touch()
                    }}
                  >
                    <span className="ih-quiz-opt-box" aria-hidden />
                    {o.value}
                  </button>
                ))}
            </div>
          )}
        </>
      )}

      {item.type === 'repeat' && (
        <RepeatBody
          key={attempt}
          item={item}
          checked={checked}
          onResult={(ok) => {
            setChecked(ok ? 'correct' : 'incorrect')
            if (ok) onSolved()
          }}
        />
      )}

      {item.type === 'typing' && (
        <>
          <Paragraphs
            body={item.body}
            renderBlank={(k) => {
              const ok = checked !== 'idle' && item.answers[k]?.some((a) => normalize(a) === normalize(typed[k] ?? ''))
              return (
                <input
                  className={`ih-quiz-input${checked === 'idle' ? '' : ok ? ' ok' : ' bad'}`}
                  value={typed[k] ?? ''}
                  disabled={locked}
                  placeholder="Nhập câu trả lời…"
                  onChange={(e) => {
                    setTyped((prev) => ({ ...prev, [k]: e.target.value }))
                    touch()
                  }}
                />
              )
            }}
          />
          {checked === 'incorrect' && (
            <>
              <button type="button" className="ih-vocab-expand" onClick={() => setRevealed((v) => !v)}>
                {revealed ? 'Ẩn đáp án ▴' : 'Xem đáp án ▾'}
              </button>
              {revealed && (
                <div className="ih-sb-explanation">
                  {slots.map((k) => (
                    <p key={k} className="ih-sb-exp-line">
                      <strong>{item.answers[k]?.[0]}</strong>
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      <div className="ih-pr-filters ih-sb-actions">
        {checked === 'idle' && item.type !== 'repeat' && (
          <button type="button" className="ih-btn-solid ih-pr-push" onClick={check} disabled={!ready}>
            Kiểm tra
          </button>
        )}
        {checked === 'correct' && onNext && (
          <button type="button" className="ih-btn-solid ih-pr-push" onClick={onNext}>
            Màn tiếp →
          </button>
        )}
        {checked === 'incorrect' && (
          <button type="button" className="ih-btn-solid ih-pr-push" onClick={reset}>
            ↺ Làm lại
          </button>
        )}
      </div>

      {checked !== 'idle' && (
        <div className={`ih-sb-result${checked === 'correct' ? ' correct' : ' incorrect'}`}>
          <p className="ih-sb-result-title">{checked === 'correct' ? 'Chính xác!' : 'Chưa đúng — xem lại rồi thử lại nhé'}</p>
          {item.explanation && (
            <button type="button" className="ih-vocab-expand" onClick={() => setShowExplanation((v) => !v)}>
              {showExplanation ? 'Ẩn giải thích ▴' : 'Xem giải thích ▾'}
            </button>
          )}
          {showExplanation && item.explanation && <div className="ih-sb-explanation">{renderExplanation(item.explanation)}</div>}
        </div>
      )}
    </div>
  )
}

// Làm 1 bộ Bài tập Quiz (/ielts/<skill>/exercise/<id>): đi lần lượt từng màn (trắc nghiệm / điền chỗ trống /
// nối endings / sắp xếp câu / gõ tự do), đúng hết 1 màn mới tính qua và lưu tiến độ (theo item.id, cùng nơi
// lưu với 2 dạng bài kia).
export function QuizSetStudy({ set }: { set: QuizSet }) {
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const [cur, setCur] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSolved(new Set(loadExerciseProgress()[set.id] ?? []))
  }, [set.id])

  const total = set.items.length
  const item = set.items[cur]

  function markSolved() {
    if (!item) return
    const next = new Set(solved)
    next.add(item.id)
    setSolved(next)
    saveExerciseProgress(set.id, [...next])
  }

  if (!item) {
    return (
      <div className="ih-pr">
        <Link href={`/ielts/${set.skill}/exercise`} className="ih-pr-back">
          ← Danh sách Bài tập
        </Link>
        <p className="ih-pr-empty">Bài này chưa có màn nào.</p>
      </div>
    )
  }

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
          Đã đúng {Math.min(solved.size, total)}/{total} màn
        </span>
        <span className="ih-sb-qnav">
          {set.items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              className={`ih-sb-dot${i === cur ? ' active' : ''}${solved.has(it.id) ? ' solved' : ''}`}
              aria-label={`Màn ${i + 1}${solved.has(it.id) ? ', đã đúng' : ''}`}
              aria-current={i === cur ? 'step' : undefined}
              onClick={() => setCur(i)}
            >
              {i + 1}
            </button>
          ))}
        </span>
      </div>

      <QuizItemView key={item.id} item={item} onSolved={markSolved} onNext={cur < total - 1 ? () => setCur(cur + 1) : null} />
    </div>
  )
}
