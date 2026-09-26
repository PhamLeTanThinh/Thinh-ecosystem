'use client'

import { useState } from 'react'
import { RichText } from './RichText'
import type { CertQuestion } from './CertQuiz'

// Chế độ ôn tốc độ: mỗi thẻ hiện luôn câu hỏi + mẹo nhận diện (số liệu/từ khoá đặc trưng) + đáp án đúng +
// giải thích cùng lúc, không cần bấm gì thêm để xem — chỉ lướt qua để ôn. Không chấm điểm, không lưu tiến
// độ (đây là ôn nhanh trước khi thi, không phải một lượt luyện đề) — khác hẳn CertQuiz.
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function TipReview({ questions }: { questions: CertQuestion[] }) {
  const withTip = questions.filter((q) => q.tip)
  const [order, setOrder] = useState<CertQuestion[] | null>(null)
  const [idx, setIdx] = useState(0)
  const [shuffleOn, setShuffleOn] = useState(true)

  if (withTip.length === 0) {
    return <p className="rounded-card border border-border bg-card p-6 text-sm text-muted">Bộ đề này chưa có mẹo nhận diện nhanh.</p>
  }

  const btn = 'rounded-pill border border-border px-4 py-2 text-sm font-semibold transition disabled:opacity-40'
  const primary = `${btn} border-accent bg-accent text-white`

  if (!order) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-card border border-border bg-card p-8 text-center shadow-sm">
        <span className="text-4xl">⚡</span>
        <h2 className="text-lg font-bold">Ôn mẹo nhanh</h2>
        <p className="text-sm leading-relaxed text-muted">
          Mỗi thẻ hiện luôn <strong className="text-text">đề bài, mẹo nhận diện và đáp án đúng</strong> cùng lúc — chỉ lướt qua để ôn, không tính điểm hay lưu
          tiến độ.
        </p>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={shuffleOn} onChange={(e) => setShuffleOn(e.target.checked)} className="peer sr-only" />
          <span className="relative h-6 w-11 shrink-0 rounded-pill bg-border transition peer-checked:bg-plum after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
          Xáo ngẫu nhiên thứ tự câu
        </label>
        <button
          type="button"
          onClick={() => {
            setOrder(shuffleOn ? shuffle(withTip) : withTip)
            setIdx(0)
          }}
          className={`${primary} flex items-center gap-2 px-6 py-2.5 text-sm shadow-md shadow-midnight/20`}
        >
          Bắt đầu ôn
          <span className="rounded-pill bg-white/25 px-2.5 py-0.5 text-xs font-bold">{withTip.length} câu</span>
          <span>→</span>
        </button>
      </div>
    )
  }

  const q = order[idx]
  const last = idx === order.length - 1

  function go(delta: number) {
    setIdx((v) => v + delta)
  }

  return (
    <div className="rounded-card border border-border bg-card p-6 shadow-sm md:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span className="rounded-pill bg-accent px-3 py-1 text-xs font-bold text-white">Câu {idx + 1}/{order.length}</span>
        <button type="button" onClick={() => setOrder(null)} className="rounded-pill border border-border px-3 py-1 text-xs font-semibold hover:border-rose-400 hover:text-rose-600">
          ✕ Thoát
        </button>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-pill bg-card-soft">
        <div className="h-full rounded-pill bg-gradient-to-r from-accent to-plum transition-all duration-500" style={{ width: `${((idx + 1) / order.length) * 100}%` }} />
      </div>

      <RichText text={q.question} className="text-lg font-semibold leading-relaxed" highlightNumbersOn />
      {q.image && (
        <a href={q.image} target="_blank" rel="noreferrer" className="mt-4 block overflow-hidden rounded-xl border border-border" title="Mở ảnh gốc">
          <img src={q.image} alt={`Sơ đồ câu ${q.id}`} className="w-full" />
        </a>
      )}

      <div className="mt-5 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-sm leading-relaxed">
        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-gold">💡 Mẹo nhận diện nhanh</div>
        {q.tip}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {Object.entries(q.options).map(([l, text]) => (
          <div
            key={l}
            className={`flex items-start gap-4 rounded-2xl border p-4 text-left text-sm leading-relaxed ${
              l === q.answer ? 'border-jade/60 bg-jade/10 shadow-sm' : 'border-border opacity-60'
            }`}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${l === q.answer ? 'bg-jade text-white' : 'bg-card-soft text-muted'}`}>
              {l === q.answer ? '✓' : l}
            </span>
            <span className="pt-1">{text}</span>
          </div>
        ))}
      </div>
      {(q.explanation || q.vn.explanation) && (
        <div className="mt-6 rounded-2xl border-l-4 border-jade bg-jade/10 p-5 text-sm leading-relaxed">
          {q.explanation && <RichText text={q.explanation} />}
          {q.vn.explanation && <RichText text={q.vn.explanation} className="mt-2 text-muted" />}
        </div>
      )}
      <div className="mt-8 flex justify-between border-t border-border pt-5">
        <button className={btn} disabled={idx === 0} onClick={() => go(-1)}>← Trước</button>
        {last ? (
          <button className={primary} onClick={() => setOrder(null)}>Hoàn thành</button>
        ) : (
          <button className={primary} onClick={() => go(1)}>Tiếp →</button>
        )}
      </div>
    </div>
  )
}
