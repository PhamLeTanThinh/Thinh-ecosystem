'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { compressImage } from '@/components/bucketlist/compressImage'
import { BACKGROUND_HEADER } from '@/lib/loading/tracker'
import { MAX_ENTRY_PHOTOS, type EntryPhoto } from '@/lib/trips/types'
import { Spinner } from './ui'

interface Props {
  photos: EntryPhoto[]
  onChange: (photos: EntryPhoto[]) => void
  onError?: (message: string) => void
  // Ảnh vừa tải lên trong lần mở form này — gỡ ra / bấm Huỷ thì xoá ngay trên R2 (ảnh đã lưu trước đó để server xoá khi Lưu)
  freshKeys: React.MutableRefObject<Set<string>>
}

export const discardPhoto = (key: string) => fetch('/api/trips/photo?key=' + encodeURIComponent(key), { method: 'DELETE', headers: { [BACKGROUND_HEADER]: '1' } }).catch(() => {})

// Ảnh chứng từ của khoản chi (hoá đơn, bill...): chọn nhiều ảnh 1 lúc (nén trên trình duyệt rồi tải lên R2), lưới ảnh
// thu nhỏ có nút ✕ gỡ, bấm ảnh để xem lớn (← → chuyển ảnh, Esc đóng).
export function EvidencePhotos({ photos, onChange, onError, freshKeys }: Props) {
  const [uploading, setUploading] = useState(0)
  const [viewing, setViewing] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // Tải nhiều ảnh nối tiếp → luôn cộng vào danh sách mới nhất, không bị ghi đè bởi closure cũ
  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  })

  async function addFiles(files: FileList) {
    const room = MAX_ENTRY_PHOTOS - photosRef.current.length
    const list = Array.from(files).slice(0, Math.max(0, room))
    if (files.length > list.length) onError?.(`Tối đa ${MAX_ENTRY_PHOTOS} ảnh mỗi khoản`)
    setUploading((n) => n + list.length)
    for (const file of list) {
      try {
        const blob = await compressImage(file)
        const form = new FormData()
        form.append('file', blob, file.name)
        // X-Background: không bật overlay loading toàn trang — ô ảnh đã có spinner riêng
        const res = await fetch('/api/trips/photo', { method: 'POST', body: form, headers: { [BACKGROUND_HEADER]: '1' } })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error ?? `Lỗi ${res.status}`)
        freshKeys.current.add(data.key)
        photosRef.current = [...photosRef.current, { key: data.key, url: data.url }]
        onChange(photosRef.current)
      } catch (e) {
        onError?.((e as Error).message)
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }

  function remove(key: string) {
    photosRef.current = photosRef.current.filter((p) => p.key !== key)
    onChange(photosRef.current)
    if (freshKeys.current.has(key)) {
      freshKeys.current.delete(key)
      discardPhoto(key)
    }
  }

  // Xem lớn: ← → chuyển ảnh, Esc đóng
  useEffect(() => {
    if (viewing === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewing(null)
      if (e.key === 'ArrowRight') setViewing((i) => (i === null ? i : (i + 1) % photos.length))
      if (e.key === 'ArrowLeft') setViewing((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewing, photos.length])

  const full = photos.length >= MAX_ENTRY_PHOTOS

  return (
    <div>
      <p className="text-sm text-muted">
        📎 Ảnh chứng từ {photos.length > 0 && `(${photos.length}/${MAX_ENTRY_PHOTOS})`}
        <span className="ml-1 text-xs">— hoá đơn, bill, ảnh chuyển khoản…</span>
      </p>
      <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {photos.map((p, i) => (
          <div key={p.key} className="group relative aspect-square overflow-hidden rounded-xl bg-card-soft">
            <button type="button" onClick={() => setViewing(i)} className="block h-full w-full" aria-label={`Xem ảnh ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- ảnh R2 domain động, không qua next/image */}
              <img src={p.url} alt="" className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
            </button>
            <button
              type="button"
              onClick={() => remove(p.key)}
              aria-label="Gỡ ảnh"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white backdrop-blur transition hover:bg-black/80"
            >
              ✕
            </button>
          </div>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <div key={'up' + i} className="flex aspect-square items-center justify-center rounded-xl bg-card-soft text-accent">
            <Spinner />
          </div>
        ))}
        {!full && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs font-semibold text-muted transition hover:border-accent hover:text-accent"
          >
            <span className="text-xl">＋</span>
            Thêm ảnh
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files)
          e.target.value = '' // chọn lại đúng file đó vẫn kích hoạt onChange
        }}
      />

      {viewing !== null &&
        photos[viewing] &&
        createPortal(
          <div
            className="fixed inset-0 z-90 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setViewing(null)}
            role="dialog"
            aria-modal="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ảnh R2 domain động */}
            <img src={photos[viewing].url} alt="" className="max-h-full max-w-full rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
            <button
              type="button"
              aria-label="Đóng"
              onClick={() => setViewing(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            >
              ✕
            </button>
            {photos.length > 1 && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-pill bg-white/15 px-3 py-1 text-sm text-white">
                {viewing + 1} / {photos.length}
              </p>
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
