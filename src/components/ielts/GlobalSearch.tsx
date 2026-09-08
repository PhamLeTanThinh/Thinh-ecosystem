'use client'

import { useMemo, useRef, useState } from 'react'
import { useIeltsStore } from '@/lib/ielts/store'
import { searchAll } from '@/lib/ielts/search'
import type { Selection } from './Sidebar'

interface Props {
  onSelect: (s: Selection) => void
}

export function GlobalSearch({ onSelect }: Props) {
  const pages = useIeltsStore((s) => s.pages)
  const vocab = useIeltsStore((s) => s.vocab)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => searchAll(pages, vocab, query), [pages, vocab, query])

  function handleBlur(e: React.FocusEvent<HTMLDivElement>) {
    if (rootRef.current?.contains(e.relatedTarget as Node | null)) return
    setOpen(false)
  }

  function handlePick(r: (typeof results)[number]) {
    onSelect(r.type === 'page' ? { type: 'page', id: r.id } : { type: 'vocab' })
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="ih-search" onBlur={handleBlur}>
      <input
        className="ih-search-input"
        placeholder="Tìm kiếm toàn bộ nội dung…"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
      />
      {open && query.trim() && (
        <div className="ih-glass-strong ih-search-results">
          {results.length === 0 && <p className="ih-search-empty">Không tìm thấy kết quả.</p>}
          {results.map((r) => (
            <button key={`${r.type}-${r.id}`} type="button" className="ih-search-result" onClick={() => handlePick(r)}>
              <span className={`ih-search-result-type ih-search-result-${r.type}`}>{r.type === 'page' ? 'Trang' : 'Từ vựng'}</span>
              <span className="ih-search-result-body">
                <span className="ih-search-result-title">{r.title}</span>
                {r.snippet && <span className="ih-search-result-snippet">{r.snippet}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
