'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { SpeakButton } from '@/components/shared/SpeakButton'
import { TV_TAGS, episodeCode, type TvChunk, type TvEpisode, type TvLine, type TvShow, type TvPattern, type TvTag } from '@/lib/ielts/tv'
import './tv.css'

const TAG_LABEL = Object.fromEntries(TV_TAGS.map((t) => [t.key, t.label])) as Record<TvTag, string>

const isHighLine = (line: TvLine) => line.chunks.some((c) => c.priority === 'high') || !!line.patterns?.some((p) => p.priority === 'high')

// Tô các cụm từ của mục ngay trong câu gốc (chỉ cụm xuất hiện nguyên văn — bỏ qua cụm mẫu kiểu "set someone up with…").
function Highlighted({ text, chunks }: { text: string; chunks: TvChunk[] }) {
  const phrases = chunks
    .map((c) => c.phrase)
    .filter((p) => !/…|\/|\+|someone|something/.test(p))
    .sort((a, b) => b.length - a.length)
  const lower = text.toLowerCase()
  const marks: [number, number][] = []
  for (const p of phrases) {
    const i = lower.indexOf(p.toLowerCase())
    if (i === -1 || marks.some(([s, e]) => i < e && i + p.length > s)) continue
    marks.push([i, i + p.length])
  }
  marks.sort((a, b) => a[0] - b[0])
  const out: ReactNode[] = []
  let last = 0
  for (const [s, e] of marks) {
    if (s > last) out.push(text.slice(last, s))
    out.push(
      <mark key={s} className="ih-tv-hl">
        {text.slice(s, e)}
      </mark>,
    )
    last = e
  }
  out.push(text.slice(last))
  return <>{out}</>
}

function PriorityBadge({ priority }: { priority?: 'high' | 'low' }) {
  if (priority === 'high')
    return (
      <span className="ih-tv-star" title="Ưu tiên cao — dùng hằng ngày">
        ★
      </span>
    )
  if (priority === 'low') return <span className="ih-tv-low">ít gặp</span>
  return null
}

function ItemList({ title, items }: { title: string; items: (TvChunk | TvPattern)[] }) {
  return (
    <div className="ih-tv-block">
      <p className="ih-tv-block-title">{title}</p>
      <ul className="ih-tv-items">
        {items.map((it, i) => {
          const head = 'phrase' in it ? it.phrase : it.pattern
          return (
            <li key={i} className={`ih-tv-item${it.priority === 'high' ? ' is-high' : ''}${it.priority === 'low' ? ' is-low' : ''}`}>
              <span className="ih-tv-item-head">
                <b>{head}</b>
                <PriorityBadge priority={it.priority} />
              </span>
              <span className="ih-tv-item-meaning">{it.meaning}</span>
              {it.note && <span className="ih-tv-item-note">{it.note}</span>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function LineCard({ line, index, hideVi }: { line: TvLine; index: number; hideVi: boolean }) {
  const [revealed, setRevealed] = useState(false)
  const showVi = !hideVi || revealed
  return (
    <article id={line.id} className="ih-glass ih-tv-card">
      <header className="ih-tv-card-head">
        <span className="ih-tv-num">{index}</span>
        <span className="ih-tv-tags">
          {line.tags.map((t) => (
            <span key={t} className={`ih-tv-tag ih-tv-tag--${t}`}>
              {TAG_LABEL[t]}
            </span>
          ))}
        </span>
      </header>

      {line.original.length > 0 ? (
        <div className="ih-tv-quote">
          {line.original.map((turn, i) => (
            <p key={i} className="ih-tv-turn">
              <span className="ih-tv-turn-text">
                <Highlighted text={turn} chunks={line.chunks} />
              </span>
              <SpeakButton text={turn.replace(/\.\.\./g, '')} lang="en-US" className="ih-tv-speak shrink-0 rounded-full p-1" />
            </p>
          ))}
        </div>
      ) : (
        <p className="ih-tv-vocab-only">Từ vựng trong tập (không kèm câu thoại)</p>
      )}

      {line.translation &&
        (showVi ? (
          <p className="ih-tv-vi" onClick={hideVi ? () => setRevealed(false) : undefined}>
            {line.translation}
          </p>
        ) : (
          <button type="button" className="ih-tv-reveal" onClick={() => setRevealed(true)}>
            Bấm để xem bản dịch
          </button>
        ))}

      <div className="ih-tv-body">
        {line.chunks.length > 0 && <ItemList title="Từ vựng & cụm từ" items={line.chunks} />}
        {line.patterns && line.patterns.length > 0 && <ItemList title="Cấu trúc" items={line.patterns} />}
      </div>

      {line.context && (
        <p className="ih-tv-context">
          <span aria-hidden>💡</span> {line.context}
        </p>
      )}

      {line.examples && line.examples.length > 0 && (
        <div className="ih-tv-examples">
          <p className="ih-tv-block-title">Ví dụ áp dụng</p>
          {line.examples.map((ex, i) => (
            <p key={i} className="ih-tv-example">
              <span className="ih-tv-example-en">
                {ex.en}
                <SpeakButton text={ex.en} lang="en-US" className="ih-tv-speak shrink-0 rounded-full p-1" />
              </span>
              {ex.vi && <span className="ih-tv-example-vi">{ex.vi}</span>}
            </p>
          ))}
        </div>
      )}
    </article>
  )
}

// 1 tập phim (/ielts/tv/<phim>/<tập>): danh sách câu thoại gốc kèm bản dịch, cụm từ, cấu trúc, ngữ cảnh. Lọc theo nhãn, lọc
// riêng mục có cụm ưu tiên cao, và ẩn bản dịch để tự kiểm tra (bấm từng câu để xem).
export function TvEpisodeView({ show, episode }: { show: TvShow; episode: TvEpisode }) {
  const [tag, setTag] = useState<TvTag | 'all'>('all')
  const [highOnly, setHighOnly] = useState(false)
  const [hideVi, setHideVi] = useState(false)

  const indexed = useMemo(() => episode.lines.map((line, i) => ({ line, n: i + 1 })), [episode])
  const usedTags = useMemo(() => TV_TAGS.filter((t) => episode.lines.some((l) => l.tags.includes(t.key))), [episode])
  const highCount = useMemo(
    () =>
      episode.lines.reduce(
        (sum, l) => sum + l.chunks.filter((c) => c.priority === 'high').length + (l.patterns ?? []).filter((p) => p.priority === 'high').length,
        0,
      ),
    [episode],
  )
  const shown = indexed.filter(({ line }) => (tag === 'all' || line.tags.includes(tag)) && (!highOnly || isHighLine(line)))

  return (
    <div className="ih-tv">
      <header className="ih-tv-hero">
        <p className="ih-tv-kicker">🎬 {show.title}</p>
        <h1 className="ih-font-hand ih-tv-title">
          {episodeCode(episode)} · {episode.title}
        </h1>
        <p className="ih-tv-summary">{episode.summary}</p>
        <p className="ih-tv-stats">
          <span>
            <b>{episode.lines.length}</b> mục học
          </span>
          <span>
            <b>{highCount}</b> cụm ưu tiên cao ★
          </span>
        </p>
      </header>

      <div className="ih-tv-toolbar">
        <div className="ih-tv-chips" role="group" aria-label="Lọc theo nhãn">
          <button type="button" className={`ih-tv-chip${tag === 'all' ? ' on' : ''}`} onClick={() => setTag('all')}>
            Tất cả
          </button>
          {usedTags.map((t) => (
            <button key={t.key} type="button" className={`ih-tv-chip${tag === t.key ? ' on' : ''}`} onClick={() => setTag(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ih-tv-toggles">
          <label className="ih-tv-toggle">
            <input type="checkbox" checked={highOnly} onChange={(e) => setHighOnly(e.target.checked)} />★ Chỉ mục ưu tiên cao
          </label>
          <label className="ih-tv-toggle">
            <input type="checkbox" checked={hideVi} onChange={(e) => setHideVi(e.target.checked)} />
            Ẩn bản dịch
          </label>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="ih-empty-state">Không có mục nào khớp bộ lọc.</p>
      ) : (
        <div className="ih-tv-list">
          {shown.map(({ line, n }) => (
            // key gắn cả hideVi để bật/tắt "Ẩn bản dịch" thì các câu đã mở lẻ cũng đóng lại
            <LineCard key={`${line.id}-${hideVi}`} line={line} index={n} hideVi={hideVi} />
          ))}
        </div>
      )}
    </div>
  )
}
