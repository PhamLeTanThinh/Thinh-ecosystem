'use client'

import { useEffect, useMemo, useState } from 'react'
import { speak, speakQueue } from '@/lib/shared/speech'
import { useIeltsStore } from '@/lib/ielts/store'
import { useIeltsAccess } from './AccessContext'
import type { VocabEntry } from '@/lib/ielts/types'

type DraftEntry = Omit<VocabEntry, 'id' | 'createdAt'>
type SortMode = 'default' | 'az' | 'newest'
type IdSetter = React.Dispatch<React.SetStateAction<Set<string>>>

const EMPTY_DRAFT: DraftEntry = {
  word: '',
  partOfSpeech: '',
  meaning: '',
  example: '',
  band: '',
  topic: '',
  linkedPageId: null,
}

const FAV_KEY = 'ielts-vocab-favs'

function loadFavs(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

// 1 từ hiện trong thẻ lớn — VocabEntry (từ tự thêm) và PracticeVocab (từ vựng đề) đều khớp cấu trúc này.
export interface FlashWord {
  word: string
  partOfSpeech?: string
  meaning: string
  example?: string
  ipa?: string
  definitionEn?: string
  exampleVi?: string
  image?: string
  emoji?: string
}

export interface FlashSettings {
  autoAdvance: boolean
  shuffle: boolean
  skipNoImage: boolean
  autoReadTerm: boolean
  autoReadDefEn: boolean
  autoReadDefVi: boolean
}

const FLASH_SETTINGS_KEY = 'ielts-flash-settings'
const DEFAULT_FLASH_SETTINGS: FlashSettings = {
  autoAdvance: false,
  shuffle: false,
  skipNoImage: false,
  autoReadTerm: false,
  autoReadDefEn: false,
  autoReadDefVi: false,
}
const AUTO_ADVANCE_MS = 5000

function loadFlashSettings(): FlashSettings {
  try {
    return { ...DEFAULT_FLASH_SETTINGS, ...JSON.parse(localStorage.getItem(FLASH_SETTINGS_KEY) ?? '{}') }
  } catch {
    return DEFAULT_FLASH_SETTINGS
  }
}

function saveFlashSettings(s: FlashSettings) {
  try {
    localStorage.setItem(FLASH_SETTINGS_KEY, JSON.stringify(s))
  } catch {}
}

function shuffled(n: number): number[] {
  const arr = Array.from({ length: n }, (_, idx) => idx)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Thẻ lớn: 2 cột (trái = nghĩa/ví dụ, phải = hình) — dạng flashcard đầy đủ, không cần lật thẻ. Toolbar
// ở góc phải có nút cài đặt (tự động đổi thẻ / trộn ngẫu nhiên / bỏ qua từ không hình / tự đọc term).
export function FlashModal({ words, start, onClose }: { words: FlashWord[]; start: number; onClose: () => void }) {
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

  const [order, setOrder] = useState<number[]>(() => pool.map((_, idx) => idx))
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(settings.shuffle ? shuffled(pool.length) : pool.map((_, idx) => idx))
  }, [pool, settings.shuffle])

  const startPos = Math.max(0, Math.min(pool.length - 1, pool.indexOf(words[start]) === -1 ? 0 : pool.indexOf(words[start])))
  const [pos, setPos] = useState(startPos)
  const v = pool[order[pos]]

  function go(next: number) {
    setPos(Math.max(0, Math.min(order.length - 1, next)))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') setPos((n) => Math.min(order.length - 1, n + 1))
      else if (e.key === 'ArrowLeft') setPos((n) => Math.max(0, n - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [order.length, onClose])

  // Tự động đổi thẻ: hẹn giờ lại mỗi khi đổi thẻ hoặc tắt/bật cài đặt.
  useEffect(() => {
    if (!settings.autoAdvance) return
    const t = setTimeout(() => setPos((n) => (n + 1 < order.length ? n + 1 : n)), AUTO_ADVANCE_MS)
    return () => clearTimeout(t)
  }, [pos, order.length, settings.autoAdvance])

  // Tự động phát âm: đọc nối tiếp term → định nghĩa EN → định nghĩa VI mỗi khi thẻ hiện ra, tuỳ mục nào bật.
  useEffect(() => {
    if (!v) return
    const items: { text: string; lang: string }[] = []
    if (settings.autoReadTerm) items.push({ text: v.word, lang: 'en-US' })
    if (settings.autoReadDefEn && v.definitionEn) items.push({ text: v.definitionEn, lang: 'en-US' })
    if (settings.autoReadDefVi) items.push({ text: v.meaning, lang: 'vi-VN' })
    if (items.length > 0) speakQueue(items)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, settings.autoReadTerm, settings.autoReadDefEn, settings.autoReadDefVi])

  if (!v) return null
  return (
    <div className="ih-vocab-modal-backdrop" onClick={onClose}>
      <div className="ih-glass ih-vocab-modal ih-vocab-modal-v2" onClick={(e) => e.stopPropagation()}>
        <div className="ih-vocab-modal-toolbar">
          <button type="button" className="ih-vocab-modal-icon-btn" aria-label="Cài đặt" onClick={() => setSettingsOpen(true)}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
              <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <button type="button" className="ih-vocab-modal-icon-btn" aria-label="Đóng" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="ih-vocab-modal-body">
          <div className="ih-vocab-modal-left">
            <div className="ih-vocab-modal-word-row">
              <h2 className="ih-vocab-modal-word">{v.word}</h2>
              <button type="button" className="ih-vocab-speak" aria-label={`Phát âm ${v.word}`} onClick={() => speak(v.word, 'en-US')}>
                🔊
              </button>
            </div>
            {v.ipa && <p className="ih-vocab-modal-ipa">{v.ipa}</p>}
            {v.partOfSpeech && <span className="ih-vocab-tag">{v.partOfSpeech}</span>}

            <div className="ih-vocab-modal-section">
              <span className="ih-vocab-section-label">Definition</span>
              <p className="ih-vocab-meaning">
                <span className="ih-vocab-lang">VI</span>
                {v.meaning}
              </p>
              {v.definitionEn && (
                <p className="ih-vocab-meaning">
                  <span className="ih-vocab-lang">EN</span>
                  {v.definitionEn}
                </p>
              )}
            </div>

            {v.example && (
              <div className="ih-vocab-modal-section">
                <span className="ih-vocab-section-label">Word in context</span>
                {v.exampleVi && <p className="ih-pr-ctx-vi">1. {v.exampleVi}</p>}
                <p className="ih-pr-ctx-en">
                  <button type="button" className="ih-vocab-speak" aria-label="Đọc câu ví dụ" onClick={() => speak(v.example!, 'en-US')}>
                    🔊
                  </button>
                  {v.example}
                </p>
              </div>
            )}

            <a
              className="ih-vocab-modal-watch"
              href={`https://www.playphrase.me/#/search?q=${encodeURIComponent(v.word)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🎬 Watch people use this?
            </a>
          </div>

          <div className="ih-vocab-modal-right">
            <div className="ih-vocab-modal-image">
              {v.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.image} alt={v.word} />
              ) : (
                <span className="ih-vocab-modal-emoji">{v.emoji ?? '📖'}</span>
              )}
            </div>
          </div>
        </div>

        <div className="ih-vocab-modal-nav">
          <button type="button" className="ih-btn-outline" disabled={pos === 0} onClick={() => go(pos - 1)}>
            ←
          </button>
          <span className="ih-vocab-modal-count">
            {pos + 1} / {order.length}
          </span>
          <button type="button" className="ih-btn-outline" disabled={pos === order.length - 1} onClick={() => go(pos + 1)}>
            →
          </button>
        </div>
      </div>

      {settingsOpen && (
        <FlashSettingsDialog
          initial={settings}
          onClose={() => setSettingsOpen(false)}
          onSave={(next) => {
            setSettings(next)
            saveFlashSettings(next)
            setSettingsOpen(false)
          }}
        />
      )}
    </div>
  )
}

const FLASH_SETTING_ROWS: { key: keyof FlashSettings; icon: string; label: string; group: 'view' | 'audio' }[] = [
  { key: 'autoAdvance', icon: '▶', label: 'Tự động đổi thẻ', group: 'view' },
  { key: 'shuffle', icon: '🔀', label: 'Trộn thẻ ngẫu nhiên', group: 'view' },
  { key: 'skipNoImage', icon: '🙈', label: 'Bỏ qua từ không có hình', group: 'view' },
  { key: 'autoReadTerm', icon: '🎵', label: 'Tự động đọc term', group: 'audio' },
  { key: 'autoReadDefEn', icon: '🎵', label: 'Tự động đọc định nghĩa EN', group: 'audio' },
  { key: 'autoReadDefVi', icon: '🎵', label: 'Tự động đọc định nghĩa VI', group: 'audio' },
]

// Hộp thoại "Cài đặt" mở từ nút ⚙️ trong thẻ lớn — sửa nháp tại đây, bấm Lưu mới áp dụng + ghi nhớ.
function FlashSettingsDialog({ initial, onClose, onSave }: { initial: FlashSettings; onClose: () => void; onSave: (s: FlashSettings) => void }) {
  const [draft, setDraft] = useState<FlashSettings>(initial)

  function toggle(key: keyof FlashSettings) {
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="ih-flash-settings-backdrop" onClick={onClose}>
      <div className="ih-glass ih-flash-settings" onClick={(e) => e.stopPropagation()}>
        <div className="ih-flash-settings-head">
          <h3>Cài đặt</h3>
          <button type="button" className="ih-vocab-modal-icon-btn" aria-label="Đóng" onClick={onClose}>
            ×
          </button>
        </div>

        <p className="ih-flash-settings-group-label">XEM THẺ</p>
        {FLASH_SETTING_ROWS.filter((r) => r.group === 'view').map((r) => (
          <label key={r.key} className="ih-flash-settings-row">
            <span className="ih-flash-settings-row-icon" aria-hidden>
              {r.icon}
            </span>
            <span className="ih-flash-settings-row-label">{r.label}</span>
            <span className={`ih-rv-switch${draft[r.key] ? ' on' : ''}`} onClick={() => toggle(r.key)} role="switch" aria-checked={draft[r.key]} />
          </label>
        ))}

        <p className="ih-flash-settings-group-label">TỰ ĐỘNG PHÁT ÂM</p>
        {FLASH_SETTING_ROWS.filter((r) => r.group === 'audio').map((r) => (
          <label key={r.key} className="ih-flash-settings-row">
            <span className="ih-flash-settings-row-icon" aria-hidden>
              {r.icon}
            </span>
            <span className="ih-flash-settings-row-label">{r.label}</span>
            <span className={`ih-rv-switch${draft[r.key] ? ' on' : ''}`} onClick={() => toggle(r.key)} role="switch" aria-checked={draft[r.key]} />
          </label>
        ))}

        <div className="ih-flash-settings-actions">
          <button type="button" className="ih-btn-outline" onClick={onClose}>
            Đóng
          </button>
          <button type="button" className="ih-btn-solid" onClick={() => onSave(draft)}>
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

interface Props {
  onNavigateToPage: (pageId: string) => void
}

export function VocabView({ onNavigateToPage }: Props) {
  const { isOwner } = useIeltsAccess()
  const vocab = useIeltsStore((s) => s.vocab)
  const pages = useIeltsStore((s) => s.pages)
  const addVocab = useIeltsStore((s) => s.addVocab)
  const updateVocab = useIeltsStore((s) => s.updateVocab)
  const deleteVocab = useIeltsStore((s) => s.deleteVocab)

  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<DraftEntry>(EMPTY_DRAFT)
  const [sort, setSort] = useState<SortMode>('default')
  const [hideMeaning, setHideMeaning] = useState(false)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [favs, setFavs] = useState<Set<string>>(new Set())
  const [flashStart, setFlashStart] = useState<number | null>(null)

  // localStorage chỉ có ở client — đọc sau mount để không lệch hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavs(loadFavs())
  }, [])

  function toggleIn(setter: IdSetter, id: string, persist = false) {
    setter((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      if (persist) {
        try {
          localStorage.setItem(FAV_KEY, JSON.stringify([...next]))
        } catch {}
      }
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q ? vocab.filter((v) => v.word.toLowerCase().includes(q) || v.topic.toLowerCase().includes(q)) : vocab
    if (sort === 'az') return [...list].sort((a, b) => a.word.localeCompare(b.word))
    if (sort === 'newest') return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return list
  }, [vocab, query, sort])

  function startAdd() {
    setDraft(EMPTY_DRAFT)
    setEditingId(null)
    setAdding(true)
  }

  function startEdit(v: VocabEntry) {
    setDraft({ word: v.word, partOfSpeech: v.partOfSpeech, meaning: v.meaning, example: v.example, band: v.band, topic: v.topic, linkedPageId: v.linkedPageId })
    setAdding(false)
    setEditingId(v.id)
  }

  function cancelForm() {
    setAdding(false)
    setEditingId(null)
  }

  function submitForm() {
    if (!draft.word.trim() || !draft.meaning.trim()) return
    if (editingId) {
      updateVocab(editingId, draft)
    } else {
      addVocab(draft)
    }
    setAdding(false)
    setEditingId(null)
  }

  const formOpen = adding || editingId !== null

  return (
    <div className="ih-vocab">
      <header className="ih-vocab-header">
        <h1 className="ih-font-hand ih-vocab-title">Danh sách từ ({filtered.length})</h1>
        <input
          className="ih-vocab-search"
          placeholder="Tìm theo từ hoặc chủ đề…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="ih-btn-outline" disabled={filtered.length === 0} onClick={() => setFlashStart(0)}>
          Xem thẻ lớn
        </button>
        <select className="ih-input ih-vocab-sort" value={sort} onChange={(e) => setSort(e.target.value as SortMode)} aria-label="Sắp xếp">
          <option value="default">Thứ tự mặc định</option>
          <option value="az">A → Z</option>
          <option value="newest">Mới thêm</option>
        </select>
        <button type="button" className="ih-btn-outline" onClick={() => setHideMeaning((h) => !h)}>
          {hideMeaning ? 'Hiện định nghĩa' : 'Ẩn định nghĩa'}
        </button>
        {isOwner && (
          <button type="button" className="ih-btn-outline" onClick={startAdd}>
            + Thêm từ
          </button>
        )}
      </header>

      {isOwner && formOpen && (
        <div className="ih-glass ih-vocab-form">
          <div className="ih-vocab-form-grid">
            <input className="ih-input" placeholder="Từ" value={draft.word} onChange={(e) => setDraft({ ...draft, word: e.target.value })} />
            <input className="ih-input" placeholder="Loại từ (danh/động/tính từ...)" value={draft.partOfSpeech} onChange={(e) => setDraft({ ...draft, partOfSpeech: e.target.value })} />
            <input className="ih-input" placeholder="Nghĩa tiếng Việt" value={draft.meaning} onChange={(e) => setDraft({ ...draft, meaning: e.target.value })} />
            <input className="ih-input" placeholder="Band gợi ý (vd Band 7+)" value={draft.band} onChange={(e) => setDraft({ ...draft, band: e.target.value })} />
            <input className="ih-input" placeholder="Chủ đề" value={draft.topic} onChange={(e) => setDraft({ ...draft, topic: e.target.value })} />
            <select className="ih-input" value={draft.linkedPageId ?? ''} onChange={(e) => setDraft({ ...draft, linkedPageId: e.target.value || null })}>
              <option value="">— Liên kết trang (tuỳ chọn) —</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <textarea
              className="ih-input ih-vocab-form-example"
              placeholder="Câu ví dụ"
              value={draft.example}
              onChange={(e) => setDraft({ ...draft, example: e.target.value })}
            />
          </div>
          <div className="ih-vocab-form-actions">
            <button type="button" className="ih-btn-outline" onClick={cancelForm}>
              Huỷ
            </button>
            <button type="button" className="ih-btn-solid" onClick={submitForm}>
              Lưu
            </button>
          </div>
        </div>
      )}

      <div className="ih-vocab-grid">
        {filtered.map((v) => {
          const hidden = hideMeaning && !revealed.has(v.id)
          const open = expanded.has(v.id)
          const hasMore = Boolean(v.example || v.band || v.topic || v.linkedPageId)
          return (
            <div key={v.id} className="ih-glass ih-vocab-card">
              <div className="ih-vocab-card-left">
                <div className="ih-vocab-card-top">
                  <span className="ih-vocab-word">{v.word}</span>
                  <button type="button" className="ih-vocab-speak" aria-label={`Phát âm ${v.word}`} onClick={() => speak(v.word, 'en-US')}>
                    🔊
                  </button>
                </div>
                {v.partOfSpeech && <span className="ih-vocab-tag">{v.partOfSpeech}</span>}
              </div>
              <div className="ih-vocab-card-right">
                {hidden ? (
                  <button type="button" className="ih-vocab-reveal" onClick={() => toggleIn(setRevealed, v.id)}>
                    👁 Hiển thị
                  </button>
                ) : (
                  <>
                    <span className="ih-vocab-section-label">Definition</span>
                    <p className="ih-vocab-meaning">
                      <span className="ih-vocab-lang">VI</span>
                      {v.meaning}
                    </p>
                    {open && (
                      <>
                        {v.example && (
                          <>
                            <span className="ih-vocab-section-label">Word in context</span>
                            <p className="ih-vocab-example">
                              <button type="button" className="ih-vocab-speak" aria-label="Đọc câu ví dụ" onClick={() => speak(v.example, 'en-US')}>
                                🔊
                              </button>
                              {v.example}
                            </p>
                          </>
                        )}
                        <div className="ih-vocab-card-bottom">
                          {v.band && <span className="ih-vocab-chip">{v.band}</span>}
                          {v.topic && <span className="ih-vocab-chip">{v.topic}</span>}
                          {v.linkedPageId && (
                            <button type="button" className="ih-vocab-chip ih-vocab-link" onClick={() => onNavigateToPage(v.linkedPageId!)}>
                              🔗 {pages.find((p) => p.id === v.linkedPageId)?.title ?? 'Trang liên kết'}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                    {hasMore && (
                      <button type="button" className="ih-vocab-expand" onClick={() => toggleIn(setExpanded, v.id)}>
                        {open ? 'Thu gọn ▴' : 'Xem thêm ▾'}
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="ih-vocab-card-actions">
                <button
                  type="button"
                  aria-label={favs.has(v.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
                  className={`ih-vocab-card-action ih-vocab-star${favs.has(v.id) ? ' is-on' : ''}`}
                  onClick={() => toggleIn(setFavs, v.id, true)}
                >
                  {favs.has(v.id) ? '★' : '☆'}
                </button>
                {isOwner && (
                  <>
                    <button type="button" aria-label="Sửa" className="ih-vocab-card-action" onClick={() => startEdit(v)}>
                      ✎
                    </button>
                    <button
                      type="button"
                      aria-label="Xoá"
                      className="ih-vocab-card-action"
                      onClick={() => {
                        if (window.confirm(`Xoá từ "${v.word}"?`)) deleteVocab(v.id)
                      }}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <p className="ih-vocab-empty">Chưa có từ nào{query ? ' khớp tìm kiếm' : ''}.</p>}
      </div>

      {flashStart !== null && <FlashModal words={filtered} start={flashStart} onClose={() => setFlashStart(null)} />}
    </div>
  )
}
