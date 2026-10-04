'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { BUCKET_SIZE, type BucketItem } from '@/lib/bucketlist/types'
import { BucketEditor, type BucketDraft } from './BucketEditor'
import { CrayonFilter, DoodleStrip, Doodles } from './Doodles'

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json' } })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `Lỗi ${res.status}`)
  return data as T
}

// Mỗi chữ cái của tiêu đề 1 màu sáp, nghiêng nhẹ khác nhau như vẽ tay
const TITLE = 'BUCKETLIST'.split('')
const LETTER_COLORS = ['#f2c94c', '#ff5d8f', '#ffa53b', '#e63946', '#9b5de5', '#ff6b35', '#ffd23f', '#7ac74f', '#3a86ff', '#ffbe0b']
const LETTER_TILT = [-3, 2, -1, 3, -2, 1, -3, 2, -1, 3]

// Trang /bucketlist kiểu tờ poster vẽ tay nhiều màu: tiêu đề sáp màu, 100 dòng đánh số chia 3 cột (dòng chưa viết
// để trống chờ điền), điều đã làm được gạch bút đỏ. Chủ trang (canEdit) bấm 1 dòng để viết/sửa; người khác chỉ xem.
export function BucketList() {
  const [items, setItems] = useState<BucketItem[] | null>(null)
  const [canEdit, setCanEdit] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState<BucketDraft | null>(null)

  useEffect(() => {
    api<{ items: BucketItem[]; canEdit: boolean }>('/api/bucketlist')
      .then((data) => {
        setItems(data.items)
        setCanEdit(data.canEdit)
      })
      .catch((e: Error) => setLoadError(e.message))
  }, [])

  const bySlot = useMemo(() => new Map((items ?? []).map((it) => [it.slot, it])), [items])
  const done = useMemo(() => (items ?? []).filter((it) => it.status === 'done').length, [items])

  function upsert(item: BucketItem) {
    setItems((prev) => [...(prev ?? []).filter((it) => it.id !== item.id), item].sort((a, b) => a.slot - b.slot))
  }

  async function save(draft: BucketDraft) {
    const { id, ...fields } = draft
    const item = id
      ? await api<BucketItem>('/api/bucketlist', { method: 'PATCH', body: JSON.stringify({ id, ...fields }) })
      : await api<BucketItem>('/api/bucketlist', { method: 'POST', body: JSON.stringify(fields) })
    upsert(item)
    setEditing(null)
  }

  async function remove(id: string) {
    await api('/api/bucketlist?id=' + encodeURIComponent(id), { method: 'DELETE' })
    setItems((prev) => (prev ?? []).filter((it) => it.id !== id))
    setEditing(null)
  }

  return (
    <div className="bl-page">
      <CrayonFilter />
      <Link href="/tools" className="bl-back">
        ← Tools
      </Link>

      <article className="bl-sheet">
        <Doodles />

        <header className="bl-head">
          <p className="bl-name">Bou&apos;s</p>
          <h1 className="bl-title" aria-label="Bucket list">
            {TITLE.map((ch, i) => (
              <span key={i} aria-hidden="true" style={{ '--c': LETTER_COLORS[i], '--r': `${LETTER_TILT[i]}deg` } as CSSProperties}>
                {ch}
              </span>
            ))}
          </h1>
          <p className="bl-sub">
            {BUCKET_SIZE} điều muốn làm trước khi chết · <b>đã làm được {done}</b>
          </p>
        </header>

        {loadError && <p className="bl-msg">Không tải được danh sách: {loadError}</p>}
        {!items && !loadError && <p className="bl-msg">Đang tải…</p>}

        {items && (
          <ol className="bl-list">
            {Array.from({ length: BUCKET_SIZE }, (_, i) => i + 1).map((slot) => {
              const it = bySlot.get(slot)
              const content = (
                <>
                  <span className="bl-n">{slot}.</span>
                  {it ? (
                    <span className="bl-t">
                      <span className="bl-ink">{it.title}</span>
                      {it.photos.length > 0 && (
                        <span className="bl-has-photo" title={`${it.photos.length} ảnh kỷ niệm`}>
                          📷
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="bl-t bl-t--blank" />
                  )}
                </>
              )
              const cls = `bl-row${it ? ` bl-row--${it.status}` : ' bl-row--blank'}`
              return (
                <li key={slot}>
                  {it || canEdit ? (
                    <button
                      type="button"
                      className={cls}
                      onClick={() =>
                        setEditing(it ? { ...it } : { slot, title: '', note: '', memory: '', photos: [], category: 'other', status: 'todo', achievedAt: null })
                      }
                      aria-label={it ? undefined : `Viết điều #${slot}`}
                    >
                      {content}
                    </button>
                  ) : (
                    <div className={cls}>{content}</div>
                  )}
                </li>
              )
            })}
          </ol>
        )}

        <DoodleStrip />
      </article>

      {editing && <BucketEditor draft={editing} readOnly={!canEdit} onClose={() => setEditing(null)} onSave={save} onDelete={remove} />}
    </div>
  )
}
