'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import type { SampleParagraph, SampleShortAnswerItem, SampleSpan, WritingSample } from '@/lib/ielts/practice'
import { skillLabel } from '@/lib/ielts/skills'
import { speak, stopSpeaking } from '@/lib/shared/speech'
import { FlashModal } from '../VocabView'

const TOC = [
  { id: 'de-bai', icon: '🚀', label: 'Đề bài' },
  { id: 'dan-y', icon: '😵', label: 'Dàn ý' },
  { id: 'bai-mau', icon: '📝', label: 'Bài mẫu' },
  { id: 'vocab', icon: '📚', label: 'Vocabulary' },
  { id: 'exercise', icon: '✨', label: 'Bài tập Exercise' },
] as const
const CONCLUSION_TOC = { id: 'loi-ket', icon: '💡', label: 'Lời kết' } as const
// Đề mẫu Speaking dùng bố cục của LMS: danh sách câu hỏi → mỗi câu hỏi 1 thẻ (nghe + đáp án mẫu) → từ vựng → bài tập.
const SPEAKING_TOC = [
  { id: 'de-bai', icon: '🚀', label: 'Danh sách câu hỏi' },
  { id: 'bai-mau', icon: '📝', label: 'Sample từng câu' },
  { id: 'vocab', icon: '📚', label: 'Vocabulary' },
  { id: 'exercise', icon: '✨', label: 'Bài tập exercise' },
] as const

// So khớp không phân biệt hoa/thường, bỏ khoảng trắng thừa đầu/cuối và dấu câu cuối câu.
function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.,!?]+$/, '')
}

function paragraphText(p: SampleParagraph): string {
  return p.vocabView.map((sp) => sp.text).join('')
}

// Ảnh vocab lấy hotlink từ CDN ngoài của nguồn LMS — có thể chết bất cứ lúc nào (không do app này lưu).
// Lỗi tải thì tự chuyển sang icon thay vì để trống/vỡ hình.
function FallbackImg({ src, alt, fallback }: { src?: string; alt: string; fallback: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <span>{fallback}</span>
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} onError={() => setFailed(true)} />
}

// Nút nghe dạng viên thuốc ▶ (bật/tắt): đọc bằng giọng của trình duyệt; đang đọc thì đổi thành ⏹ để dừng.
function ListenPill({ text, label }: { text: string; label: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <button
      type="button"
      className="ih-sample-listen"
      aria-pressed={playing}
      aria-label={playing ? `Dừng nghe: ${label}` : `Nghe câu trả lời mẫu: ${label}`}
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
      <span className="ih-sample-listen-btn" aria-hidden>
        {playing ? '⏹' : '▶'}
      </span>
      <span>{playing ? 'Đang đọc… bấm để dừng' : 'Nghe câu trả lời mẫu'}</span>
    </button>
  )
}

// essay phẳng (câu hỏi → nhãn → đoạn trả lời…) → nhóm theo từng câu hỏi để mỗi câu hỏi là 1 thẻ
function groupByQuestion(essay: SampleParagraph[]): { q: SampleParagraph; body: SampleParagraph[] }[] {
  const groups: { q: SampleParagraph; body: SampleParagraph[] }[] = []
  for (const p of essay) {
    if (p.headingKind === 'question') groups.push({ q: p, body: [] })
    else groups[groups.length - 1]?.body.push(p)
  }
  return groups
}

// "Sample từng câu" của đề Speaking: mỗi câu hỏi 1 thẻ gồm câu hỏi, nút nghe, rồi đáp án mẫu (có các nhãn Answer 1/2…).
function SpeakingCards({ essay, mode }: { essay: SampleParagraph[]; mode: 'idea' | 'vocab' }) {
  useEffect(() => () => stopSpeaking(), []) // rời trang thì thôi đọc
  return (
    <div className="ih-sample-qcards">
      {groupByQuestion(essay).map(({ q, body }) => (
        <article key={q.id} id={q.id} className="ih-sample-qcard">
          <h3 className="ih-sample-qcard-title">{q.heading}</h3>
          <ListenPill
            text={body
              .filter((p) => !p.heading)
              .map(paragraphText)
              .join(' ')}
            label={q.heading ?? ''}
          />
          {body.map((p) =>
            p.heading ? (
              <p key={p.id} className="ih-sample-heading-label">
                {p.heading}
              </p>
            ) : mode === 'vocab' ? (
              <VocabModeParagraph key={p.id} paragraph={p} />
            ) : (
              <IdeaModeParagraph key={p.id} paragraph={p} />
            ),
          )}
        </article>
      ))}
    </div>
  )
}

// 1 đoạn văn ở chế độ "Từ vựng": cụm được đánh dấu tô cam gạch chân, bấm vào hiện/ẩn nghĩa + IPA ngay bên
// dưới (không dùng popover nổi để tránh phức tạp định vị, xem cùng lý do ở các nơi khác trong app).
function VocabModeParagraph({ paragraph }: { paragraph: SampleParagraph }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }
  return (
    <p className="ih-sample-p">
      {paragraph.vocabView.map((sp, i) =>
        sp.vocabWord ? (
          <Fragment key={i}>
            <button type="button" className="ih-sample-vocab-span" onClick={() => toggle(i)} aria-expanded={revealed.has(i)}>
              {sp.text}
            </button>
            {revealed.has(i) && (
              <span className="ih-sample-gloss">
                {sp.vocabMeaning}
                {sp.vocabIpa && <span className="ih-sample-gloss-ipa"> /{sp.vocabIpa}/</span>}
              </span>
            )}
          </Fragment>
        ) : (
          <Fragment key={i}>{sp.text}</Fragment>
        ),
      )}
    </p>
  )
}

// 1 đoạn văn ở chế độ "Dàn ý": cụm lập luận/linking language tô xanh đậm, phần còn lại làm mờ — giúp thấy
// rõ bộ khung câu chữ dùng để triển khai ý.
function IdeaModeParagraph({ paragraph }: { paragraph: SampleParagraph }) {
  return (
    <p className="ih-sample-p">
      {paragraph.ideaView.map((sp: SampleSpan, i) =>
        sp.highlight ? (
          <span key={i} className="ih-sample-idea-span">
            {sp.text}
          </span>
        ) : (
          <span key={i} className="ih-sample-muted">
            {sp.text}
          </span>
        ),
      )}
    </p>
  )
}

// Exercise 1: điền từ vào chỗ trống bằng dropdown chọn trong 1 kho từ dùng chung (không lặp, không thẻ
// nhiễu) — cùng kiểu tương tác ih-bank-target/ih-bank-dropdown đã dùng cho dạng bài Matching.
function GapFillBlock({ sample }: { sample: WritingSample }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const usedValues = new Set(Object.values(answers))

  function assign(idx: number, value: string) {
    setAnswers((prev) => {
      const next: Record<number, string> = {}
      for (const [k, v] of Object.entries(prev)) if (v !== value) next[Number(k)] = v
      next[idx] = value
      return next
    })
    setOpenIdx(null)
  }

  const allFilled = sample.gapFill.items.every((_, i) => answers[i])
  const allCorrect = checked && sample.gapFill.items.every((it, i) => normalize(answers[i] ?? '') === normalize(it.correctValue))

  return (
    <div className="ih-sample-exercise-block">
      <p className="ih-sample-exercise-title">Exercise 1: Điền từ / cụm từ phù hợp vào chỗ trống.</p>
      {sample.gapFill.items.map((it, i) => {
        const value = answers[i]
        const ok = checked ? normalize(value ?? '') === normalize(it.correctValue) : null
        return (
          <div key={i} className={`ih-sample-gap-row${ok === true ? ' correct' : ok === false ? ' wrong' : ''}`}>
            {it.hintVi && (
              <p className="ih-sample-gap-hint">
                {i + 1}. {it.hintVi}
              </p>
            )}
            <div className="ih-sample-gap-sentence">
              {!it.hintVi && `${i + 1}. `}
              {it.before}{' '}
              <span className="ih-bank-target-wrap">
                <button type="button" className={`ih-bank-target${value ? ' filled' : ''}`} onClick={() => setOpenIdx((cur) => (cur === i ? null : i))}>
                  {value || 'Chọn đáp án'}
                  <span className="ih-bank-target-caret" aria-hidden>
                    ▾
                  </span>
                </button>
                {openIdx === i && (
                  <div className="ih-bank-dropdown" role="listbox">
                    {sample.gapFill.bank.map((w) => (
                      <button
                        key={w}
                        type="button"
                        className={`ih-bank-dropdown-opt${w === value ? ' selected' : ''}`}
                        disabled={usedValues.has(w) && w !== value}
                        onClick={() => assign(i, w)}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                )}
              </span>{' '}
              {it.after}
              {checked && !ok && (
                <span className="ih-sample-gap-answer">
                  {' '}
                  (đáp án: <strong>{it.correctValue}</strong>)
                </span>
              )}
            </div>
          </div>
        )
      })}
      {openIdx !== null && <div className="ih-bank-backdrop" onClick={() => setOpenIdx(null)} />}
      <div className="ih-pr-filters ih-sb-actions">
        <button type="button" className="ih-btn-solid ih-pr-push" disabled={!allFilled} onClick={() => setChecked(true)}>
          Kiểm tra
        </button>
      </div>
      {checked && (
        <p className={`ih-sample-exercise-result${allCorrect ? ' correct' : ' incorrect'}`}>{allCorrect ? 'Chính xác hết!' : 'Còn vài chỗ chưa đúng — xem đáp án ngay dưới chỗ điền sai nhé.'}</p>
      )}
    </div>
  )
}

// Exercise 2: điền câu trả lời tự do (không có sẵn lựa chọn), so khớp không phân biệt hoa/thường.
function ShortAnswerBlock({ items }: { items: SampleShortAnswerItem[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const allFilled = items.every((_, i) => (answers[i] ?? '').trim())

  return (
    <div className="ih-sample-exercise-block">
      <p className="ih-sample-exercise-title">Exercise 2: Điền từ vào chỗ trống (dựa trên những gợi ý có sẵn).</p>
      {items.map((it, i) => {
        const value = answers[i] ?? ''
        const ok = checked ? normalize(value) === normalize(it.correctAnswer) : null
        return (
          <div key={i} className={`ih-sample-gap-row${ok === true ? ' correct' : ok === false ? ' wrong' : ''}`}>
            <label className="ih-sample-gap-hint" htmlFor={`sa-${i}`}>
              {i + 1}. {it.prompt}
            </label>
            <input
              id={`sa-${i}`}
              className="ih-pr-search ih-sample-short-input"
              value={value}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
              placeholder="Nhập câu trả lời…"
            />
            {checked && !ok && (
              <span className="ih-sample-gap-answer">
                Đáp án: <strong>{it.correctAnswer}</strong>
              </span>
            )}
          </div>
        )
      })}
      <div className="ih-pr-filters ih-sb-actions">
        <button type="button" className="ih-btn-solid ih-pr-push" disabled={!allFilled} onClick={() => setChecked(true)}>
          Kiểm tra
        </button>
      </div>
    </div>
  )
}

// Đọc 1 Đề mẫu (/ielts/<skill>/sample/<id>): trang cuộn dài có mục lục cố định bên trái. Bài mẫu hiện theo
// 1 trong 2 kiểu tô — "Dàn ý" (mặc định, tô xanh cụm lập luận, làm mờ phần còn lại) hoặc "Từ vựng" (tô cam
// các cụm từ vựng, bấm vào xem nghĩa) — cùng 1 câu chữ, chỉ khác cụm được tô, xem SampleParagraph.
export function WritingSampleView({ sample }: { sample: WritingSample }) {
  const [mode, setMode] = useState<'idea' | 'vocab'>('idea')
  const [reading, setReading] = useState(false)
  const [flashStart, setFlashStart] = useState<number | null>(null)
  // Đề Speaking không có dàn ý riêng (ý chính nằm ngay ở chế độ "Dàn ý" của bài mẫu) → ẩn mục này
  const hasOutline = sample.outline.length > 0 || !!sample.outlineThesis || !!sample.outlineIntro?.length
  const isSpeaking = sample.skill === 'speaking'

  return (
    <div className="ih-pr ih-sample">
      <Link href={`/ielts/${sample.skill}/sample`} className="ih-pr-back">
        ← Danh sách Đề mẫu
      </Link>
      <p className="ih-pr-dialog-cap">
        {skillLabel(sample.skill)} - Đề mẫu · {sample.part} · {sample.resourceLabel}
      </p>
      <h1 className="ih-font-hand ih-pr-dialog-title">{sample.title}</h1>
      {!isSpeaking && <p className="ih-pr-sub">{sample.description}</p>}

      <div className="ih-sample-layout">
        <nav className="ih-sample-toc" aria-label="Mục lục">
          <p className="ih-sample-toc-label">Table of content</p>
          {(isSpeaking ? [...SPEAKING_TOC] : [...TOC.filter((t) => t.id !== 'dan-y' || hasOutline), ...(sample.conclusion ? [CONCLUSION_TOC] : [])]).map((t) => (
            <a key={t.id} href={`#${t.id}`} className="ih-sample-toc-link">
              {t.icon} {t.label}
            </a>
          ))}
        </nav>

        <div className="ih-sample-main">
          <section id="de-bai" className="ih-sample-section">
            {isSpeaking ? (
              <>
                <h2 className="ih-sample-h2">🚀 Danh sách câu hỏi</h2>
                <ol className="ih-sample-qlist">
                  {sample.essay
                    .filter((e) => e.headingKind === 'question')
                    .map((e) => (
                      <li key={e.id}>
                        <a href={`#${e.id}`}>{e.heading}</a>
                      </li>
                    ))}
                </ol>
              </>
            ) : (
              <>
                <h2 className="ih-sample-h2">🚀 Đề bài</h2>
                <blockquote className="ih-sample-quote">{sample.question}</blockquote>
              </>
            )}
            {sample.questionImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sample.questionImage} alt={sample.title} className="ih-sample-question-image" />
            )}
          </section>

          {hasOutline && (
          <section id="dan-y" className="ih-sample-section">
            <h2 className="ih-sample-h2">😵 Dàn ý</h2>
            {sample.outlineIntro && (
              <div className="ih-sample-outline-intro">
                {sample.outlineIntro.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
            <div className="ih-sample-outline">
              {sample.outlineThesis && <p className="ih-sample-outline-thesis">{sample.outlineThesis}</p>}
              {sample.outline.map((o, i) => (
                <div key={i} className="ih-sample-outline-para">
                  <p className="ih-sample-outline-heading">{o.heading}</p>
                  {o.topicSentence && <p className="ih-sample-outline-topic">{o.topicSentence}</p>}
                  {o.ideas.map((idea, j) => (
                    <div key={j} className="ih-sample-outline-idea-block">
                      {o.ideas.length > 1 && (
                        <p className="ih-sample-outline-idea-num">
                          Idea {j + 1}: <span>{idea.title}</span>
                        </p>
                      )}
                      {o.ideas.length === 1 && <p className="ih-sample-outline-idea-num">{idea.title}</p>}
                      <ul className="ih-sample-outline-bullets">
                        {idea.bullets.map((b, k) => (
                          <li key={k}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
          )}

          <section id="bai-mau" className="ih-sample-section">
            <h2 className="ih-sample-h2">📝 {isSpeaking ? 'Sample từng câu' : 'Bài mẫu'}</h2>
            {isSpeaking && <p className="ih-pr-sub">{sample.description}</p>}
            <div className="ih-pr-filters">
              <button type="button" className="ih-btn-outline" onClick={() => setMode(mode === 'idea' ? 'vocab' : 'idea')}>
                👁 {mode === 'idea' ? 'Từ vựng' : 'Dàn ý'}
              </button>
              {!isSpeaking && (
              <button
                type="button"
                className="ih-btn-outline"
                onClick={() => {
                  if (reading) {
                    stopSpeaking()
                    setReading(false)
                    return
                  }
                  setReading(true)
                  speak(sample.essay.map((p) => p.heading ?? paragraphText(p)).join(' '), 'en-US', undefined, () => setReading(false))
                }}
              >
                {reading ? '⏹ Dừng đọc' : '🔊 Đọc cả bài'}
              </button>
              )}
            </div>
            {isSpeaking ? (
              <SpeakingCards essay={sample.essay} mode={mode} />
            ) : (
              sample.essay.map((p) =>
              p.heading ? (
                <p key={p.id} className={`ih-sample-heading-${p.headingKind ?? 'label'}`}>
                  {p.heading}
                </p>
              ) : mode === 'vocab' ? (
                <VocabModeParagraph key={p.id} paragraph={p} />
              ) : (
                <IdeaModeParagraph key={p.id} paragraph={p} />
              ),
              )
            )}
          </section>

          <section id="vocab" className="ih-sample-section">
            <h2 className="ih-sample-h2">📚 Vocabulary</h2>
            <div className="ih-pr-filters">
              <button type="button" className="ih-btn-outline" disabled={sample.vocab.length === 0} onClick={() => setFlashStart(0)}>
                Xem thẻ lớn
              </button>
            </div>
            <div className="ih-sample-vocab-grid">
              {sample.vocab.map((v, i) => (
                <div key={v.word} className="ih-glass ih-sample-vocab-card">
                  <button type="button" className="ih-sample-vocab-card-img" aria-label={`Xem thẻ lớn: ${v.word}`} onClick={() => setFlashStart(i)}>
                    <FallbackImg src={v.image} alt={v.word} fallback={v.emoji ?? '📖'} />
                  </button>
                  <div className="ih-sample-vocab-card-body">
                    <span className="ih-sample-vocab-card-top">
                      <span className="ih-vocab-word">{v.word}</span>
                      <button type="button" className="ih-vocab-speak" aria-label={`Phát âm ${v.word}`} onClick={() => speak(v.word, 'en-US')}>
                        🔊
                      </button>
                    </span>
                    {v.ipa && <span className="ih-pr-ipa">/{v.ipa}/</span>}
                    {v.partOfSpeech && <span className="ih-vocab-tag">{v.partOfSpeech}</span>}
                    <p className="ih-vocab-meaning">
                      <span className="ih-vocab-lang">VI</span>
                      {v.meaning}
                    </p>
                    {v.example && (
                      <p className="ih-pr-ctx-en">
                        <button type="button" className="ih-vocab-speak" aria-label="Đọc câu ví dụ" onClick={() => speak(v.example, 'en-US')}>
                          🔊
                        </button>
                        {v.example}
                      </p>
                    )}
                    {v.exampleVi && <p className="ih-pr-ctx-vi">{v.exampleVi}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="exercise" className="ih-sample-section">
            <h2 className="ih-sample-h2">✨ Bài tập Exercise</h2>
            <p className="ih-sample-exercise-intro">Mình cùng làm 2 bài tập sau đây để ôn lại các từ vựng và cấu trúc đã được dùng trong bài mẫu nhé!</p>
            {sample.gapFill.items.length > 0 && <GapFillBlock sample={sample} />}
            {sample.shortAnswer.length > 0 && <ShortAnswerBlock items={sample.shortAnswer} />}
          </section>

          {sample.conclusion && (
            <section id="loi-ket" className="ih-sample-section">
              <h2 className="ih-sample-h2">💡 Lời kết</h2>
              {sample.conclusion.map((p, i) => (
                <p key={i} className="ih-sample-p">
                  {p}
                </p>
              ))}
            </section>
          )}
        </div>
      </div>

      {flashStart !== null && <FlashModal words={sample.vocab} start={flashStart} onClose={() => setFlashStart(null)} showWatch={false} />}
    </div>
  )
}
