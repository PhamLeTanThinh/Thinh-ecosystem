'use client'

import { useState } from 'react'
import { useKoreanStore } from '@/lib/korean/store'
import { useKoreanUIStore } from '@/lib/korean/uiStore'
import { LESSON_NUMBERS, LESSON_TITLES } from '@/lib/korean/lessons'
import { BottomSheet } from '../BottomSheet'
import { SheetHeader } from '../SheetHeader'
import { SegmentedControl } from '../SegmentedControl'
import type { KoreanCardKind } from '@/lib/korean/types'

export function AddCardModal() {
  const open = useKoreanUIStore((s) => s.addCardOpen)
  const resetKey = useKoreanUIStore((s) => s.addCardKey)
  const close = useKoreanUIStore((s) => s.closeAddCard)
  const editingCardId = useKoreanUIStore((s) => s.editingCardId)

  return (
    <BottomSheet open={open} onClose={close}>
      <AddCardForm key={resetKey} onClose={close} editingCardId={editingCardId} />
    </BottomSheet>
  )
}

function AddCardForm({ onClose, editingCardId }: { onClose: () => void; editingCardId: string | null }) {
  const cards = useKoreanStore((s) => s.cards)
  const addCard = useKoreanStore((s) => s.addCard)
  const updateCard = useKoreanStore((s) => s.updateCard)
  const deleteCard = useKoreanStore((s) => s.deleteCard)

  const editingCard = editingCardId ? cards.find((c) => c.id === editingCardId) ?? null : null

  const [kind, setKind] = useState<KoreanCardKind>(editingCard?.kind ?? 'vocab')
  const [lesson, setLesson] = useState(editingCard?.lesson ?? 1)
  const [front, setFront] = useState(editingCard?.front ?? '')
  const [meaning, setMeaning] = useState(editingCard?.meaning ?? '')
  const [note, setNote] = useState(editingCard?.note ?? '')
  const [example, setExample] = useState(editingCard?.example ?? '')
  const [theory, setTheory] = useState(editingCard?.theory ?? '')

  function handleSave() {
    const trimmedFront = front.trim()
    const trimmedMeaning = meaning.trim()
    if (!trimmedFront || !trimmedMeaning) return
    const payload = {
      kind,
      lesson,
      front: trimmedFront,
      meaning: trimmedMeaning,
      note: note.trim(),
      example: example.trim(),
      theory: kind === 'grammar' ? theory.trim() : '',
    }
    if (editingCard) {
      updateCard(editingCard.id, payload)
    } else {
      addCard(payload)
    }
    onClose()
  }

  function handleDelete() {
    if (!editingCard) return
    if (!window.confirm(`Xoá thẻ "${editingCard.front}"? Tiến độ ôn tập của thẻ này cũng sẽ bị xoá.`)) return
    deleteCard(editingCard.id)
    onClose()
  }

  const canSave = front.trim() && meaning.trim()

  return (
    <>
      <SheetHeader title={editingCard ? 'Sửa thẻ' : 'Thêm thẻ mới'} onCancel={onClose} />

      <div className="p-4">
        <p className="mb-2 text-xs font-medium text-muted">Loại</p>
        <SegmentedControl
          options={[
            { value: 'vocab' as const, label: '📚 Từ vựng' },
            { value: 'grammar' as const, label: '✏️ Ngữ pháp' },
          ]}
          value={kind}
          onChange={setKind}
        />
      </div>

      <div className="px-4 pb-2">
        <label className="text-xs font-medium text-muted" htmlFor="card-lesson">
          Bài học
        </label>
        <select
          id="card-lesson"
          value={lesson}
          onChange={(e) => setLesson(Number(e.target.value))}
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
        >
          {LESSON_NUMBERS.map((n) => (
            <option key={n} value={n}>
              제 {n} 과 · {LESSON_TITLES[n]}
            </option>
          ))}
        </select>
      </div>

      <div className="px-4 pb-2">
        <label className="text-xs font-medium text-muted" htmlFor="card-front">
          {kind === 'grammar' ? 'Mẫu ngữ pháp' : 'Hangul'}
        </label>
        <input
          id="card-front"
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          placeholder={kind === 'grammar' ? 'VD: N(이)라고 하다' : 'VD: 안녕하세요'}
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-lg outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
          autoFocus
        />
      </div>

      <div className="px-4 pb-2">
        <label className="text-xs font-medium text-muted" htmlFor="card-meaning">
          Nghĩa tiếng Việt
        </label>
        <input
          id="card-meaning"
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder={kind === 'grammar' ? 'VD: được gọi là N' : 'VD: Xin chào'}
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="px-4 pb-2">
        <label className="text-xs font-medium text-muted" htmlFor="card-note">
          {kind === 'grammar' ? 'Cách chia / cách dùng' : 'English'}
        </label>
        <input
          id="card-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={kind === 'grammar' ? 'VD: N받침 O: 이라고 하다' : 'VD: Hello'}
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="px-4 pb-4">
        <label className="text-xs font-medium text-muted" htmlFor="card-example">
          Ví dụ (mỗi câu 1 dòng)
        </label>
        <textarea
          id="card-example"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="VD: 저는 트엡이라고 합니다."
          rows={3}
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {kind === 'grammar' && (
        <div className="px-4 pb-4">
          <label className="text-xs font-medium text-muted" htmlFor="card-theory">
            Lý thuyết chi tiết (mỗi đoạn cách nhau 1 dòng trống)
          </label>
          <textarea
            id="card-theory"
            value={theory}
            onChange={(e) => setTheory(e.target.value)}
            placeholder="Giải thích ý nghĩa, cách dùng, lưu ý phân biệt với mẫu ngữ pháp khác..."
            rows={5}
            className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
          />
        </div>
      )}

      <div className="flex gap-3 px-4 py-4">
        {editingCard && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-pill border-2 border-danger px-5 py-3.5 text-sm font-semibold text-danger"
          >
            Xoá
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="flex-1 rounded-pill bg-linear-to-r from-accent to-accent-strong py-3.5 text-sm font-semibold text-white shadow-sm disabled:opacity-40"
        >
          {editingCard ? 'Lưu thay đổi' : 'Lưu'}
        </button>
      </div>
    </>
  )
}
