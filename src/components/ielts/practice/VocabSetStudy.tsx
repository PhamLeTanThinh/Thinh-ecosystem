'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loadLearned, saveLearned, type VocabGroup } from '@/lib/ielts/practice'
import { skillLabel } from '@/lib/ielts/skills'
import { speak } from '@/lib/shared/speech'
import { FlashModal } from '../VocabView'

// Học 1 Vocab set (/ielts/<skill>/vocab/<testId>): mỗi từ có nút "Đã thuộc" (lưu ngay). "Ẩn nghĩa" biến
// danh sách thành bài tự kiểm tra: che nghĩa, bấm vào thẻ để lật.
export function VocabSetStudy({ group }: { group: VocabGroup }) {
  const [learned, setLearned] = useState<Set<string>>(new Set())
  const [hideMeaning, setHideMeaning] = useState(false)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [flashOpen, setFlashOpen] = useState(false)
  const [flashStart, setFlashStart] = useState(0)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [collapsedFirst, setCollapsedFirst] = useState(false)

  // Từ đầu tiên mở sẵn (như mẫu); bấm Thu gọn/Xem thêm ở từ nào thì đổi trạng thái riêng từ đó.
  function toggleExpand(word: string, open: boolean, idx: number) {
    if (idx === 0) setCollapsedFirst(open)
    setExpanded((prev) => {
      const next = new Set(prev)
      if (open) next.delete(word)
      else next.add(word)
      return next
    })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLearned(new Set(loadLearned()[group.testId] ?? []))
  }, [group.testId])

  const total = group.vocab.length
  const count = group.vocab.filter((v) => learned.has(v.word)).length

  function toggleLearned(word: string) {
    const next = new Set(learned)
    if (next.has(word)) next.delete(word)
    else next.add(word)
    setLearned(next)
    saveLearned(group.testId, [...next])
  }

  function toggleReveal(word: string) {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }

  return (
    <div className="ih-pr">
      <Link href={`/ielts/${group.skill}/vocab`} className="ih-pr-back">
        ← Danh sách Vocab set
      </Link>
      <p className="ih-pr-dialog-cap">
        {skillLabel(group.skill)} - Vocab set · {group.part}
      </p>
      <h1 className="ih-font-hand ih-pr-dialog-title">{group.testTitle}</h1>

      <div className="ih-pr-filters">
        <span className="ih-pr-chip ih-pr-chip-score">
          Đã thuộc {count}/{total} từ
        </span>
        <label className="ih-pr-toggle">
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
        <button
          type="button"
          className="ih-btn-outline"
          disabled={total === 0}
          onClick={() => {
            setFlashStart(0)
            setFlashOpen(true)
          }}
        >
          Xem thẻ lớn
        </button>
        <Link href={`/ielts/${group.skill}/practice/${group.testId}`} className="ih-btn-outline ih-pr-push">
          📝 Làm đề này
        </Link>
      </div>
      {flashOpen && <FlashModal words={group.vocab} start={flashStart} onClose={() => setFlashOpen(false)} />}

      <div className="ih-pr-vocab-grid">
        {group.vocab.map((v, idx) => {
          const hidden = hideMeaning && !revealed.has(v.word)
          const known = learned.has(v.word)
          const open = expanded.has(v.word) || (idx === 0 && !collapsedFirst)
          return (
            <div key={v.word} className={`ih-glass ih-pr-vocab-card${known ? ' known' : ''}`}>
              <div className="ih-pr-vocab-left">
                <span className="ih-pr-vocab-top">
                  <span className="ih-vocab-word">{v.word}</span>
                  <button type="button" className="ih-vocab-speak" aria-label={`Phát âm ${v.word}`} onClick={() => speak(v.word, 'en-US')}>
                    🔊
                  </button>
                </span>
                {v.ipa && <span className="ih-pr-ipa">{v.ipa}</span>}
                <span className="ih-pr-vocab-spacer" />
                {v.partOfSpeech && <span className="ih-vocab-tag">{v.partOfSpeech}</span>}
                <button type="button" className={`ih-pr-known-btn${known ? ' on' : ''}`} onClick={() => toggleLearned(v.word)} aria-pressed={known}>
                  {known ? '✓ Đã thuộc' : 'Đánh dấu đã thuộc'}
                </button>
              </div>
              <div className="ih-pr-vocab-main">
                <div className="ih-pr-vocab-def" onClick={() => hideMeaning && toggleReveal(v.word)} style={hideMeaning ? { cursor: 'pointer' } : undefined}>
                  <span className="ih-vocab-section-label">Definition</span>
                  <p className={`ih-vocab-meaning${hidden ? ' ih-pr-blur' : ''}`}>
                    <span className="ih-vocab-lang">VI</span>
                    {v.meaning}
                  </p>
                  {v.definitionEn && (
                    <p className={`ih-vocab-meaning${hidden ? ' ih-pr-blur' : ''}`}>
                      <span className="ih-vocab-lang">EN</span>
                      {v.definitionEn}
                    </p>
                  )}
                </div>
                {open && v.example && (
                  <div className="ih-pr-vocab-ctx">
                    <span className="ih-vocab-section-label">Word in context</span>
                    {v.exampleVi && <p className={`ih-pr-ctx-vi${hidden ? ' ih-pr-blur' : ''}`}>1. {v.exampleVi}</p>}
                    <p className="ih-pr-ctx-en">
                      <button type="button" className="ih-vocab-speak" aria-label="Đọc câu ví dụ" onClick={() => speak(v.example, 'en-US')}>
                        🔊
                      </button>
                      {v.example}
                    </p>
                  </div>
                )}
                <button type="button" className="ih-vocab-expand" onClick={() => toggleExpand(v.word, open, idx)}>
                  {open ? 'Thu gọn ▴' : 'Xem thêm ▾'}
                </button>
              </div>
              <button
                type="button"
                className="ih-pr-vocab-img"
                aria-label={`Xem thẻ lớn: ${v.word}`}
                onClick={() => {
                  setFlashStart(idx)
                  setFlashOpen(true)
                }}
              >
                {v.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.image} alt={v.word} />
                ) : (
                  <span>{v.emoji ?? '📖'}</span>
                )}
              </button>
            </div>
          )
        })}
        {total === 0 && <p className="ih-pr-empty">Set này chưa có từ nào.</p>}
      </div>
    </div>
  )
}
