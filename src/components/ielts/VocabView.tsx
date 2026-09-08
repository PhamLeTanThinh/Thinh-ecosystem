'use client'

import { useMemo, useState } from 'react'
import { useIeltsStore } from '@/lib/ielts/store'
import { useIeltsAccess } from './AccessContext'
import type { VocabEntry } from '@/lib/ielts/types'

type DraftEntry = Omit<VocabEntry, 'id' | 'createdAt'>

const EMPTY_DRAFT: DraftEntry = {
  word: '',
  partOfSpeech: '',
  meaning: '',
  example: '',
  band: '',
  topic: '',
  linkedPageId: null,
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vocab
    return vocab.filter((v) => v.word.toLowerCase().includes(q) || v.topic.toLowerCase().includes(q))
  }, [vocab, query])

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
        <h1 className="ih-font-hand ih-vocab-title">Từ vựng</h1>
        <input
          className="ih-vocab-search"
          placeholder="Tìm theo từ hoặc chủ đề…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
        {filtered.map((v) => (
          <div key={v.id} className="ih-glass ih-vocab-card">
            <div className="ih-vocab-card-top">
              <span className="ih-vocab-word">{v.word}</span>
              {v.partOfSpeech && <span className="ih-vocab-tag">{v.partOfSpeech}</span>}
            </div>
            <p className="ih-vocab-meaning">{v.meaning}</p>
            {v.example && <p className="ih-vocab-example">“{v.example}”</p>}
            <div className="ih-vocab-card-bottom">
              {v.band && <span className="ih-vocab-chip">{v.band}</span>}
              {v.topic && <span className="ih-vocab-chip">{v.topic}</span>}
              {v.linkedPageId && (
                <button type="button" className="ih-vocab-chip ih-vocab-link" onClick={() => onNavigateToPage(v.linkedPageId!)}>
                  🔗 {pages.find((p) => p.id === v.linkedPageId)?.title ?? 'Trang liên kết'}
                </button>
              )}
              <span className="ih-vocab-card-spacer" />
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
        ))}
        {filtered.length === 0 && <p className="ih-vocab-empty">Chưa có từ nào{query ? ' khớp tìm kiếm' : ''}.</p>}
      </div>
    </div>
  )
}
