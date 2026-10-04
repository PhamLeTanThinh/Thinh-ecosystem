'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { speak, speakQueue } from '@/lib/shared/speech'
import { POS_LABELS } from './pos'
import type { WordPart } from './parts'
import { WordParts } from './WordParts'
import './vocab-study.css'

// 1 từ trong danh sách học — Korean và Chinese chuẩn hoá thẻ của mình về dạng này (xem lib/<app>/vocabStudy.ts).
export interface StudyWord {
  id: string
  word: string
  reading?: string // phiên âm (pinyin) — Korean để trống
  pos?: string[] // từ loại (mã trong ./pos.ts) — hiện thành nhãn màu cạnh từ
  tag?: string // ghi chú ngắn (vd 'Hán Việt: mẫu thân')
  meaning: string // nghĩa tiếng Việt
  en?: string // nghĩa tiếng Anh / ghi chú phụ
  example?: string // câu ví dụ bằng ngôn ngữ đang học
  exampleReading?: string // phiên âm câu ví dụ (pinyin)
  exampleVi?: string // dịch câu ví dụ
  image?: string
  parts?: WordPart[] // cấu tạo từ (thẻ lớn hiện khối "Cấu tạo từ")
  topic?: string // nhóm chủ đề trong bài — danh sách gom các từ cùng nhóm lại với nhau
}

interface Props {
  words: StudyWord[]
  lang: string // 'ko-KR' | 'zh-CN'
  isLearned: (id: string) => boolean
  onToggleLearned: (id: string, known: boolean) => void
  groupIdPrefix?: string // id cho từng nhóm chủ đề (<prefix><thứ tự>) — mục lục "Đang đọc" nhảy tới nhóm
}

// Danh sách học từ vựng của 1 bài (Korean / Chinese) — cùng bố cục với Vocab set của IELTS
// (components/ielts/practice/VocabSetStudy.tsx): lưới 2 cột, mỗi thẻ có hàng đầu (từ + phát âm + từ loại + nút
// "Đã thuộc") và thân (nghĩa + câu ví dụ | ảnh). Từ có topic được gom theo nhóm chủ đề (thứ tự nhóm = thứ tự xuất hiện
// đầu tiên trong bài, từ chưa xếp nhóm vào "Khác" ở cuối); không từ nào có topic thì giữ danh sách phẳng như cũ. "Ẩn nghĩa" che nghĩa để tự kiểm tra, bấm vào để lật; "Xem thẻ lớn" mở flashcard toàn màn hình.
export function VocabStudy({ words, lang, isLearned, onToggleLearned, groupIdPrefix }: Props) {
  const [hideMeaning, setHideMeaning] = useState(false)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [collapsedFirst, setCollapsedFirst] = useState(false)
  const [flashStart, setFlashStart] = useState<number | null>(null)

  // Thứ tự hiển thị = thứ tự trong thẻ lớn (flashcard) — duyệt hết nhóm này rồi sang nhóm kế
  const groups = useMemo(() => groupByTopic(words), [words])
  const ordered = useMemo(() => groups.flatMap((g) => g.words), [groups])
  const total = words.length
  const count = words.filter((w) => isLearned(w.id)).length

  // Từ đầu tiên mở sẵn câu ví dụ (như IELTS); bấm Thu gọn/Xem thêm ở từ nào thì đổi riêng từ đó.
  function toggleExpand(id: string, open: boolean, idx: number) {
    if (idx === 0) setCollapsedFirst(open)
    setExpanded((prev) => {
      const next = new Set(prev)
      if (open) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleReveal(id: string) {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  function renderCard(w: StudyWord, idx: number) {
    const hidden = hideMeaning && !revealed.has(w.id)
    const known = isLearned(w.id)
    const open = expanded.has(w.id) || (idx === 0 && !collapsedFirst)
    return (
      <div key={w.id} className={`vs-card${known ? ' known' : ''}`}>
        <div className="vs-left">
          <span className="vs-top">
            <span className="vs-word" lang={lang}>
              {w.word}
            </span>
            <button type="button" className="vs-speak" aria-label={`Phát âm ${w.word}`} onClick={() => speak(w.word, lang)}>
              🔊
            </button>
          </span>
          {w.reading && <span className="vs-reading">{w.reading}</span>}
          <PosBadges pos={w.pos} />
          {w.tag && <span className="vs-tag">{w.tag}</span>}
          <span className="vs-spacer" />
          <button type="button" className={`vs-known${known ? ' on' : ''}`} onClick={() => onToggleLearned(w.id, !known)} aria-pressed={known}>
            {known ? '✓ Đã thuộc' : 'Đánh dấu đã thuộc'}
          </button>
        </div>

        <div className="vs-main">
          <div className="vs-def" onClick={() => hideMeaning && toggleReveal(w.id)} style={hideMeaning ? { cursor: 'pointer' } : undefined}>
            <span className="vs-label">Nghĩa</span>
            <p className={`vs-meaning${hidden ? ' vs-blur' : ''}`}>
              <span className="vs-lang">VI</span>
              {w.meaning}
            </p>
            {w.en && (
              <p className={`vs-meaning vs-meaning-en${hidden ? ' vs-blur' : ''}`}>
                <span className="vs-lang">EN</span>
                {w.en}
              </p>
            )}
          </div>
          {open && w.example && (
            <div className="vs-ctx">
              <span className="vs-label">Ví dụ</span>
              <p className="vs-ctx-line" lang={lang}>
                <button type="button" className="vs-speak" aria-label="Đọc câu ví dụ" onClick={() => speak(w.example!, lang)}>
                  🔊
                </button>
                {w.example}
              </p>
              {w.exampleReading && <p className="vs-ctx-reading">{w.exampleReading}</p>}
              {w.exampleVi && <p className={`vs-ctx-vi${hidden ? ' vs-blur' : ''}`}>{w.exampleVi}</p>}
            </div>
          )}
          {w.example && (
            <button type="button" className="vs-expand" onClick={() => toggleExpand(w.id, open, idx)}>
              {open ? 'Thu gọn ▴' : 'Xem ví dụ ▾'}
            </button>
          )}
        </div>

        <button type="button" className="vs-img" aria-label={`Xem thẻ lớn: ${w.word}`} onClick={() => setFlashStart(idx)}>
          {w.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={w.image} alt={w.word} loading="lazy" />
          ) : (
            <span className="vs-img-text" lang={lang}>
              {[...w.word].slice(0, 2).join('')}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="vs">
      <div className="vs-toolbar">
        <span className="vs-chip-score">
          Đã thuộc {count}/{total} từ
        </span>
        <label className="vs-toggle">
          <input
            type="checkbox"
            checked={hideMeaning}
            onChange={(e) => {
              setHideMeaning(e.target.checked)
              setRevealed(new Set())
            }}
          />
          Ẩn nghĩa
        </label>
        <button type="button" className="vs-btn" disabled={total === 0} onClick={() => setFlashStart(0)}>
          Xem thẻ lớn
        </button>
      </div>

      {groups.map((g, gi) => (
        <section key={g.title ?? '_'} className="vs-group" id={groupIdPrefix && g.title ? `${groupIdPrefix}${gi}` : undefined}>
          {g.title && (
            <h4 className="vs-group-title">
              {g.title}
              <span className="vs-group-count">{g.words.length}</span>
            </h4>
          )}
          <div className="vs-grid">{g.words.map((w) => renderCard(w, ordered.indexOf(w)))}</div>
        </section>
      ))}
      {total === 0 && <p className="vs-empty">Chưa có từ vựng nào trong bài này.</p>}

      {flashStart !== null && <VocabFlashModal words={ordered} start={flashStart} lang={lang} onClose={() => setFlashStart(null)} />}
    </div>
  )
}

const OTHER_TOPIC = 'Khác'

export function groupByTopic(words: StudyWord[]): { title: string | null; words: StudyWord[] }[] {
  if (!words.some((w) => w.topic)) return [{ title: null, words }]
  const map = new Map<string, StudyWord[]>()
  for (const w of words) {
    const key = w.topic || OTHER_TOPIC
    map.set(key, [...(map.get(key) ?? []), w])
  }
  const other = map.get(OTHER_TOPIC)
  map.delete(OTHER_TOPIC)
  const groups = [...map].map(([title, ws]) => ({ title, words: ws }))
  return other ? [...groups, { title: OTHER_TOPIC, words: other }] : groups
}

interface FlashSettings {
  autoAdvance: boolean
  shuffle: boolean
  skipNoImage: boolean
  hideMeaning: boolean // che nghĩa (+ dịch ví dụ, cấu tạo từ) cho tới khi bấm/Space để lật
  autoReadTerm: boolean
  autoReadExample: boolean
  autoReadDefVi: boolean
}

const FLASH_SETTINGS_KEY = 'lang-vocab-flash-settings'
const DEFAULT_FLASH_SETTINGS: FlashSettings = {
  autoAdvance: false,
  shuffle: false,
  skipNoImage: false,
  hideMeaning: false,
  autoReadTerm: false,
  autoReadExample: false,
  autoReadDefVi: false,
}
const AUTO_ADVANCE_MS = 5000

function loadFlashSettings(): FlashSettings {
  try {
    return {
      ...DEFAULT_FLASH_SETTINGS,
      ...JSON.parse(localStorage.getItem(FLASH_SETTINGS_KEY) ?? '{}'),
    }
  } catch {
    return DEFAULT_FLASH_SETTINGS
  }
}

function shuffled(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Thẻ lớn: 2 cột (trái = từ, nghĩa, ví dụ; phải = ảnh), có cài đặt tự đổi thẻ / trộn / bỏ qua từ không ảnh / tự đọc
// — cùng tính năng với FlashModal bên IELTS (components/ielts/VocabView.tsx), đọc bằng giọng của ngôn ngữ đang học.
function VocabFlashModal({ words, start, lang, onClose }: { words: StudyWord[]; start: number; lang: string; onClose: () => void }) {
  const [settings, setSettings] = useState<FlashSettings>(DEFAULT_FLASH_SETTINGS)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(loadFlashSettings())
  }, [])

  const pool = useMemo(() => {
    const list = settings.skipNoImage ? words.filter((w) => w.image) : words
    return list.length > 0 ? list : words
  }, [words, settings.skipNoImage])

  const [order, setOrder] = useState<number[]>(() => pool.map((_, i) => i))
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(settings.shuffle ? shuffled(pool.length) : pool.map((_, i) => i))
  }, [pool, settings.shuffle])

  const startPos = Math.max(0, pool.indexOf(words[start]))
  const [pos, setPos] = useState(startPos)
  const w = pool[order[pos]]

  // Ẩn nghĩa: lật theo từng thẻ — sang thẻ khác thì che lại
  const [revealedId, setRevealedId] = useState<string | null>(null)
  const hidden = settings.hideMeaning && revealedId !== w?.id
  const reveal = () => w && setRevealedId((id) => (id === w.id ? null : w.id))

  function updateSettings(next: FlashSettings) {
    setSettings(next)
    try {
      localStorage.setItem(FLASH_SETTINGS_KEY, JSON.stringify(next))
    } catch {}
  }

  const hiddenRef = useRef({ on: false, reveal: () => {} })
  useEffect(() => {
    hiddenRef.current = { on: settings.hideMeaning, reveal }
  })

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') setPos((n) => Math.min(order.length - 1, n + 1))
      else if (e.key === 'ArrowLeft') setPos((n) => Math.max(0, n - 1))
      else if ((e.key === ' ' || e.key === 'Enter') && hiddenRef.current.on) {
        e.preventDefault()
        hiddenRef.current.reveal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [order.length, onClose])

  useEffect(() => {
    if (!settings.autoAdvance) return
    const t = setTimeout(() => setPos((n) => (n + 1 < order.length ? n + 1 : n)), AUTO_ADVANCE_MS)
    return () => clearTimeout(t)
  }, [pos, order.length, settings.autoAdvance])

  // Tự động đọc nối tiếp: từ → câu ví dụ → nghĩa tiếng Việt, tuỳ mục nào bật.
  useEffect(() => {
    if (!w) return
    const items: { text: string; lang: string }[] = []
    if (settings.autoReadTerm) items.push({ text: w.word, lang })
    if (settings.autoReadExample && w.example) items.push({ text: w.example, lang })
    if (settings.autoReadDefVi) items.push({ text: w.meaning, lang: 'vi-VN' })
    if (items.length > 0) speakQueue(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, settings.autoReadTerm, settings.autoReadExample, settings.autoReadDefVi])

  if (!w) return null
  // Chế độ ẩn nghĩa: bấm vào BẤT KỲ chỗ nào bị làm mờ (nghĩa, cấu tạo từ, câu dịch ví dụ) đều lật xem/che lại
  const flip = settings.hideMeaning ? reveal : undefined
  const flipTitle = settings.hideMeaning ? (hidden ? 'Bấm (hoặc Space) để xem nghĩa' : 'Bấm để che lại') : undefined
  return (
    <div className="vs-modal-backdrop" onClick={onClose}>
      <div className="vs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="vs-modal-toolbar">
          <button
            type="button"
            className={`vs-hide-btn${settings.hideMeaning ? ' on' : ''}`}
            aria-pressed={settings.hideMeaning}
            onClick={() => updateSettings({ ...settings, hideMeaning: !settings.hideMeaning })}
          >
            {settings.hideMeaning ? '🙈 Đang ẩn nghĩa' : '👁 Ẩn nghĩa'}
          </button>
          <button type="button" className="vs-icon-btn" aria-label="Cài đặt" onClick={() => setSettingsOpen(true)}>
            ⋯
          </button>
          <button type="button" className="vs-icon-btn" aria-label="Đóng" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="vs-modal-body">
          <div className="vs-modal-left">
            <div className="vs-modal-word-row">
              <h2 className="vs-modal-word" lang={lang}>
                {w.word}
              </h2>
              <button type="button" className="vs-speak" aria-label={`Phát âm ${w.word}`} onClick={() => speak(w.word, lang)}>
                🔊
              </button>
            </div>
            {w.reading && <p className="vs-modal-reading">{w.reading}</p>}
            {w.pos && w.pos.length > 0 && (
              <p className="vs-modal-pos">
                <PosBadges pos={w.pos} />
              </p>
            )}
            {w.tag && <span className="vs-tag">{w.tag}</span>}
            <div
              className={`vs-modal-section${settings.hideMeaning ? ' vs-flip' : ''}`}
              onClick={flip}
              title={flipTitle}
            >
              <span className="vs-label">
                Nghĩa{hidden && <span className="vs-flip-hint"> · bấm hoặc Space để xem</span>}
              </span>
              <p className={`vs-meaning${hidden ? ' vs-blur' : ''}`}>
                <span className="vs-lang">VI</span>
                {w.meaning}
              </p>
              {w.en && (
                <p className={`vs-meaning vs-meaning-en${hidden ? ' vs-blur' : ''}`}>
                  <span className="vs-lang">EN</span>
                  {w.en}
                </p>
              )}
            </div>
            {w.parts && (
              <div className={`vs-modal-section${hidden ? ' vs-blur' : ''}${flip ? ' vs-flip' : ''}`} onClick={flip} title={flipTitle}>
                <WordParts parts={w.parts} lang={lang} />
              </div>
            )}
            {w.example && (
              <div className="vs-modal-section">
                <span className="vs-label">Ví dụ</span>
                <p className="vs-ctx-line" lang={lang}>
                  <button type="button" className="vs-speak" aria-label="Đọc câu ví dụ" onClick={() => speak(w.example!, lang)}>
                    🔊
                  </button>
                  {w.example}
                </p>
                {w.exampleReading && <p className="vs-ctx-reading">{w.exampleReading}</p>}
                {w.exampleVi && (
                  <p className={`vs-ctx-vi${hidden ? ' vs-blur' : ''}${flip ? ' vs-flip' : ''}`} onClick={flip} title={flipTitle}>
                    {w.exampleVi}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="vs-modal-right">
            {w.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={w.image} alt={w.word} />
            ) : (
              <span className="vs-modal-glyph" lang={lang}>
                {w.word}
              </span>
            )}
          </div>
        </div>
        <div className="vs-modal-nav">
          <button type="button" className="vs-btn" disabled={pos === 0} onClick={() => setPos(pos - 1)}>
            ←
          </button>
          <span className="vs-modal-count">
            {pos + 1} / {order.length}
          </span>
          <button type="button" className="vs-btn" disabled={pos === order.length - 1} onClick={() => setPos(pos + 1)}>
            →
          </button>
        </div>
      </div>

      {settingsOpen && (
        <FlashSettingsDialog
          initial={settings}
          onClose={() => setSettingsOpen(false)}
          onSave={(next) => {
            updateSettings(next)
            setSettingsOpen(false)
          }}
        />
      )}
    </div>
  )
}

const SETTING_ROWS: {
  key: keyof FlashSettings
  icon: string
  label: string
  group: 'view' | 'audio'
}[] = [
  {
    key: 'autoAdvance',
    icon: '▶',
    label: 'Tự động đổi thẻ (5 giây)',
    group: 'view',
  },
  { key: 'shuffle', icon: '🔀', label: 'Trộn thẻ ngẫu nhiên', group: 'view' },
  {
    key: 'skipNoImage',
    icon: '🖼',
    label: 'Bỏ qua từ không có hình',
    group: 'view',
  },
  { key: 'hideMeaning', icon: '🙈', label: 'Ẩn nghĩa (bấm hoặc Space để lật)', group: 'view' },
  { key: 'autoReadTerm', icon: '🎵', label: 'Tự động đọc từ', group: 'audio' },
  {
    key: 'autoReadExample',
    icon: '🎵',
    label: 'Tự động đọc câu ví dụ',
    group: 'audio',
  },
  {
    key: 'autoReadDefVi',
    icon: '🎵',
    label: 'Tự động đọc nghĩa tiếng Việt',
    group: 'audio',
  },
]

function FlashSettingsDialog({ initial, onClose, onSave }: { initial: FlashSettings; onClose: () => void; onSave: (s: FlashSettings) => void }) {
  const [draft, setDraft] = useState<FlashSettings>(initial)
  const row = (r: (typeof SETTING_ROWS)[number]) => (
    <label key={r.key} className="vs-settings-row">
      <span aria-hidden>{r.icon}</span>
      <span className="vs-settings-row-label">{r.label}</span>
      <span
        className={`vs-switch${draft[r.key] ? ' on' : ''}`}
        onClick={() => setDraft((p) => ({ ...p, [r.key]: !p[r.key] }))}
        role="switch"
        aria-checked={draft[r.key]}
      />
    </label>
  )
  return (
    <div className="vs-settings-backdrop" onClick={onClose}>
      <div className="vs-settings" onClick={(e) => e.stopPropagation()}>
        <div className="vs-settings-head">
          <h3>Cài đặt</h3>
          <button type="button" className="vs-icon-btn" aria-label="Đóng" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="vs-settings-group">XEM THẺ</p>
        {SETTING_ROWS.filter((r) => r.group === 'view').map(row)}
        <p className="vs-settings-group">TỰ ĐỘNG PHÁT ÂM</p>
        {SETTING_ROWS.filter((r) => r.group === 'audio').map(row)}
        <div className="vs-settings-actions">
          <button type="button" className="vs-btn" onClick={onClose}>
            Đóng
          </button>
          <button type="button" className="vs-btn vs-btn-solid" onClick={() => onSave(draft)}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

// Nhãn từ loại — mỗi loại 1 màu (vs-pos-<mã> trong vocab-study.css) để nhìn là phân biệt được danh/động/tính từ…
function PosBadges({ pos }: { pos?: string[] }) {
  if (!pos || pos.length === 0) return null
  return (
    <>
      {pos.map((p) => (
        <span key={p} className={`vs-pos vs-pos-${p}`}>
          {POS_LABELS[p] ?? p}
        </span>
      ))}
    </>
  )
}
