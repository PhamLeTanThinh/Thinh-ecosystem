'use client'

import { useState } from 'react'
import { useChineseStore } from '@/lib/chinese/store'
import { useChineseUIStore } from '@/lib/chinese/uiStore'
import { BottomSheet } from '../BottomSheet'
import { SheetHeader } from '../SheetHeader'

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

  const [hanzi, setHanzi] = useState(editingCard?.hanzi ?? '')
  const [pinyin, setPinyin] = useState(editingCard?.pinyin ?? '')
  const [meaning, setMeaning] = useState(editingCard?.meaning ?? '')

  function handleSave() {
    const trimmedHanzi = hanzi.trim()
    const trimmedPinyin = pinyin.trim()
    const trimmedMeaning = meaning.trim()
    if (!trimmedHanzi || !trimmedPinyin || !trimmedMeaning) return
    if (editingCard) {
      updateCard(editingCard.id, { hanzi: trimmedHanzi, pinyin: trimmedPinyin, meaning: trimmedMeaning })
    } else {
      addCard({ hanzi: trimmedHanzi, pinyin: trimmedPinyin, meaning: trimmedMeaning })
    }
    onClose()
  }

  function handleDelete() {
    if (!editingCard) return
    if (!window.confirm(`Xoá thẻ "${editingCard.hanzi}"? Tiến độ ôn tập của thẻ này cũng sẽ bị xoá.`)) return
    deleteCard(editingCard.id)
    onClose()
  }

  const canSave = hanzi.trim() && pinyin.trim() && meaning.trim()

  return (
    <>
      <SheetHeader title={editingCard ? 'Sửa từ vựng' : 'Thêm từ vựng'} onCancel={onClose} />

      <div className="p-4">
        <label className="text-xs font-medium text-muted" htmlFor="card-hanzi">
          Chữ Hán
        </label>
        <input
          id="card-hanzi"
          type="text"
          value={hanzi}
          onChange={(e) => setHanzi(e.target.value)}
          placeholder="VD: 你好"
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-lg outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
          autoFocus
        />
      </div>

      <div className="px-4 pb-2">
        <label className="text-xs font-medium text-muted" htmlFor="card-pinyin">
          Pinyin
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

      <div className="px-4 pb-4">
        <label className="text-xs font-medium text-muted" htmlFor="card-meaning">
          Nghĩa tiếng Việt
        </label>
        <input
          id="card-meaning"
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="VD: Xin chào"
          className="mt-2 w-full rounded-2xl border border-transparent bg-card-soft px-4 py-3.5 text-sm outline-none transition-colors focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/20"
        />
      </div>

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
