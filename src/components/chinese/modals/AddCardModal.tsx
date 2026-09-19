'use client'

import { useState } from 'react'
import { useChineseStore } from '@/lib/chinese/store'
import { useChineseUIStore } from '@/lib/chinese/uiStore'
import { HSK_LEVELS, LESSON_TITLES, UNSORTED_LESSON, lessonNumbersForLevel } from '@/lib/chinese/lessons'
import { BottomSheet } from '../BottomSheet'
import { SheetHeader } from '../SheetHeader'
import { SegmentedControl } from '../SegmentedControl'
import type { ChineseCardKind } from '@/lib/chinese/types'

export function AddCardModal() {
  const open = useChineseUIStore((s) => s.addCardOpen)
  const resetKey = useChineseUIStore((s) => s.addCardKey)
  const close = useChineseUIStore((s) => s.closeAddCard)
  const editingCardId = useChineseUIStore((s) => s.editingCardId)

  return (
    <BottomSheet open={open} onClose={close}>
      <AddCardForm key={resetKey} onClose={close} editingCardId={editingCardId} />
    </BottomSheet>
  )
}

function AddCardForm({ onClose, editingCardId }: { onClose: () => void; editingCardId: string | null }) {
  const cards = useChineseStore((s) => s.cards)
  const addCard = useChineseStore((s) => s.addCard)
  const updateCard = useChineseStore((s) => s.updateCard)
  const deleteCard = useChineseStore((s) => s.deleteCard)

  const editingCard = editingCardId ? cards.find((c) => c.id === editingCardId) ?? null : null

  const [kind, setKind] = useState<ChineseCardKind>(editingCard?.kind ?? 'vocab')
  const [lesson, setLesson] = useState(editingCard?.lesson ?? 1)
  const [hanzi, setHanzi] = useState(editingCard?.hanzi ?? '')
  const [pinyin, setPinyin] = useState(editingCard?.pinyin ?? '')
  const [meaning, setMeaning] = useState(editingCard?.meaning ?? '')
  const [note, setNote] = useState(editingCard?.note ?? '')
  const [example, setExample] = useState(editingCard?.example ?? '')
  const [theory, setTheory] = useState(editingCard?.theory ?? '')

  function handleSave() {
    const trimmedHanzi = hanzi.trim()
    const trimmedMeaning = meaning.trim()
    if (!trimmedHanzi || !trimmedMeaning) return
    const payload = {
      kind,
      lesson,
      hanzi: trimmedHanzi,
      pinyin: pinyin.trim(),
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
    if (!window.confirm(`Xoá thẻ "${editingCard.hanzi}"? Tiến độ ôn tập của thẻ này cũng sẽ bị xoá.`)) return
    deleteCard(editingCard.id)
    onClose()
  }

  const canSave = hanzi.trim() && meaning.trim()

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
          <option value={UNSORTED_LESSON}>{LESSON_TITLES[UNSORTED_LESSON]}</option>
          {HSK_LEVELS.map(({ key, label }) => (
            <optgroup key={key} label={label}>
              {lessonNumbersForLevel(key).map((n) => (
                <option key={n} value={n}>
                  {LESSON_TITLES[n]}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="px-4 pb-2">
        <label className="text-xs font-medium text-muted" htmlFor="card-hanzi">
          {kind === 'grammar' ? 'Mẫu ngữ pháp' : 'Chữ Hán'}
        </label>
        <input
          id="card-hanzi"
          type="text"
          value={hanzi}
          onChange={(e) => setHanzi(e.target.value)}
          placeholder={kind === 'grammar' ? 'VD: 是……的' : 'VD: 你好'}
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-lg outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
          autoFocus
        />
      </div>

      <div className="px-4 pb-2">
        <label className="text-xs font-medium text-muted" htmlFor="card-pinyin">
          Pinyin {kind === 'grammar' && '(không bắt buộc)'}
        </label>
        <input
          id="card-pinyin"
          type="text"
          value={pinyin}
          onChange={(e) => setPinyin(e.target.value)}
          placeholder="VD: nǐ hǎo"
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
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
          placeholder={kind === 'grammar' ? 'VD: chính là… (nhấn mạnh)' : 'VD: Xin chào'}
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
        />
      </div>

      <div className="px-4 pb-2">
        <label className="text-xs font-medium text-muted" htmlFor="card-note">
          {kind === 'grammar' ? 'Cách dùng / cấu trúc' : 'Ghi chú thêm (không bắt buộc)'}
        </label>
        <input
          id="card-note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={kind === 'grammar' ? 'VD: 是 + N + 的' : ''}
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
          placeholder="VD: 这是我买的。"
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
