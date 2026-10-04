'use client'

import { useEffect, useRef, useState } from 'react'
import { BUCKET_STATUSES, type BucketItem } from '@/lib/bucketlist/types'
import { HandDatePicker, todayIso } from './HandDatePicker'
import { PhotoGallery } from './PhotoGallery'

// id có = sửa điều đã có; không có = viết mới vào ô `slot`
export type BucketDraft = Omit<BucketItem, 'id'> & { id?: string }

interface Props {
  draft: BucketDraft
  readOnly: boolean
  onClose: () => void
  onSave: (draft: BucketDraft) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const formatDate = (iso: string) => iso.split('-').reverse().join('/')

const dropPhoto = (key: string) => fetch('/api/bucketlist/photo?key=' + encodeURIComponent(key), { method: 'DELETE' }).catch(() => {})

// Hộp thoại xem/sửa 1 điều. "Vì sao muốn làm" viết lúc đặt mục tiêu; "Kỷ niệm" + ảnh chỉ có khi đã làm được.
// Người xem (không phải chủ trang) chỉ đọc.
export function BucketEditor({ draft: initial, readOnly, onClose, onSave, onDelete }: Props) {
  const [draft, setDraft] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  // Ảnh tải lên trong lần mở này mà chưa Lưu — đóng/huỷ thì xoá khỏi R2 để không bỏ rác
  const freshRef = useRef(new Set<string>())
  const set = <K extends keyof BucketDraft>(key: K, value: BucketDraft[K]) => setDraft((d) => ({ ...d, [key]: value }))

  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = () => {
      freshRef.current.forEach(dropPhoto)
      freshRef.current.clear()
      onClose()
    }
  })
  const cancel = () => closeRef.current()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (e) {
      setError((e as Error).message)
      setBusy(false)
    }
  }

  return (
    <div className="bl-modal-backdrop" onClick={cancel}>
      <div className="bl-modal" role="dialog" aria-modal="true" aria-label={draft.title || 'Điều mới'} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="bl-modal-x" aria-label="Đóng" onClick={cancel}>
          ✕
        </button>

        {readOnly ? (
          <>
            <h2 className={`bl-modal-title${draft.status === 'done' ? ' bl-item--done' : ''}`}>{draft.title}</h2>
            <p className="bl-modal-status">
              {BUCKET_STATUSES.find((s) => s.key === draft.status)?.label}
              {draft.status === 'done' && draft.achievedAt && ` · ${formatDate(draft.achievedAt)}`}
            </p>
            {draft.note && (
              <section className="bl-read">
                <h3>Vì sao muốn làm</h3>
                <p className="bl-modal-note">{draft.note}</p>
              </section>
            )}
            {draft.status === 'done' && (draft.memory || draft.photos.length > 0) && (
              <section className="bl-read">
                <h3>Kỷ niệm</h3>
                {draft.memory && <p className="bl-modal-note">{draft.memory}</p>}
                <PhotoGallery photos={draft.photos} />
              </section>
            )}
          </>
        ) : (
          <form
            className="bl-form"
            onSubmit={(e) => {
              e.preventDefault()
              run(async () => {
                await onSave(draft)
                freshRef.current.clear()
              })
            }}
          >
            <p className="bl-modal-kicker">{draft.id ? 'Sửa' : 'Điều mới'}</p>
            <input
              autoFocus
              maxLength={200}
              className="bl-input bl-input--title"
              value={draft.title}
              placeholder="vd. Ngắm cực quang"
              onChange={(e) => set('title', e.target.value)}
            />

            <div className="bl-seg" role="group" aria-label="Trạng thái">
              {BUCKET_STATUSES.map((s) => (
                <button key={s.key} type="button" className={draft.status === s.key ? 'on' : ''} onClick={() => set('status', s.key)}>
                  {s.label}
                </button>
              ))}
            </div>

            <label className="bl-field">
              <span>Vì sao muốn làm</span>
              <textarea
                rows={2}
                maxLength={2000}
                className="bl-input"
                value={draft.note}
                placeholder="Lý do, động lực, kế hoạch…"
                onChange={(e) => set('note', e.target.value)}
              />
            </label>

            {draft.status === 'done' && (
              <div className="bl-memory">
                <div className="bl-field">
                  <span>Ngày làm được</span>
                  {/* Chưa chọn thì hiện hôm nay — server cũng tự ghi hôm nay khi để trống */}
                  <HandDatePicker value={draft.achievedAt ?? todayIso()} onChange={(v) => set('achievedAt', v)} />
                </div>
                <label className="bl-field">
                  <span>Kỷ niệm</span>
                  <textarea
                    rows={3}
                    maxLength={4000}
                    className="bl-input"
                    value={draft.memory}
                    placeholder="Lúc làm được thì thế nào, ở đâu, với ai…"
                    onChange={(e) => set('memory', e.target.value)}
                  />
                </label>
                <div className="bl-field">
                  <span>Ảnh kỷ niệm</span>
                  <PhotoGallery
                    photos={draft.photos}
                    onChange={(photos) => set('photos', photos)}
                    onUploaded={(key) => freshRef.current.add(key)}
                    onDiscardFresh={(key) => {
                      freshRef.current.delete(key)
                      dropPhoto(key)
                    }}
                    onError={setError}
                  />
                </div>
              </div>
            )}

            {error && <p className="bl-error">{error}</p>}

            <div className="bl-actions">
              {draft.id &&
                (confirmDelete ? (
                  <button type="button" className="bl-btn bl-btn--danger" disabled={busy} onClick={() => run(() => onDelete(draft.id!))}>
                    Chắc chắn xoá?
                  </button>
                ) : (
                  <button type="button" className="bl-btn bl-btn--text" disabled={busy} onClick={() => setConfirmDelete(true)}>
                    Xoá
                  </button>
                ))}
              <span className="bl-actions-gap" />
              <button type="button" className="bl-btn bl-btn--text" onClick={cancel}>
                Huỷ
              </button>
              <button type="submit" className="bl-btn bl-btn--solid" disabled={busy || !draft.title.trim()}>
                {busy ? 'Đang lưu…' : 'Lưu'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
