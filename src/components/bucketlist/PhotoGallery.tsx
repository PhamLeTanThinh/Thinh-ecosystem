'use client'

import { useEffect, useRef, useState } from 'react'
import { BUCKET_MAX_PHOTOS, type BucketPhoto } from '@/lib/bucketlist/types'
import { compressImage } from './compressImage'

interface Props {
  photos: BucketPhoto[]
  // Không truyền = chỉ xem
  onChange?: (photos: BucketPhoto[]) => void
  // Ảnh vừa tải lên trong lần sửa này bị gỡ ra — xoá ngay trên R2 (ảnh đã lưu trước đó thì để server xoá khi Lưu)
  onDiscardFresh?: (key: string) => void
  onUploaded?: (key: string) => void
  onError?: (message: string) => void
}

// Lưới ảnh kỷ niệm: bấm ảnh để xem lớn (← → chuyển ảnh, Esc đóng); khi sửa có ô "+ Thêm ảnh" và nút ✕ gỡ ảnh.
export function PhotoGallery({ photos, onChange, onDiscardFresh, onUploaded, onError }: Props) {
  const [uploading, setUploading] = useState(0)
  const [viewing, setViewing] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const freshRef = useRef(new Set<string>())
  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  })

  async function addFiles(files: FileList) {
    if (!onChange) return
    const room = BUCKET_MAX_PHOTOS - photosRef.current.length
    const list = Array.from(files).slice(0, Math.max(0, room))
    if (files.length > list.length) onError?.(`Tối đa ${BUCKET_MAX_PHOTOS} ảnh mỗi điều`)
    setUploading((n) => n + list.length)
    for (const file of list) {
      try {
        const blob = await compressImage(file)
        const form = new FormData()
        form.append('file', blob, file.name)
        const res = await fetch('/api/bucketlist/photo', { method: 'POST', body: form })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error ?? `Lỗi ${res.status}`)
        freshRef.current.add(data.key)
        onUploaded?.(data.key)
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
    if (!onChange) return
    photosRef.current = photosRef.current.filter((p) => p.key !== key)
    onChange(photosRef.current)
    if (freshRef.current.has(key)) {
      freshRef.current.delete(key)
      onDiscardFresh?.(key)
    }
  }

  useEffect(() => {
    if (viewing === null) return
    // Bắt ở pha capture để Esc chỉ đóng ảnh, không đóng luôn hộp thoại phía sau
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setViewing(null)
      else if (e.key === 'ArrowRight') setViewing((i) => (i === null ? i : (i + 1) % photos.length))
      else if (e.key === 'ArrowLeft') setViewing((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))
      else return
      e.stopPropagation()
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [viewing, photos.length])

  if (!onChange && photos.length === 0) return null

  return (
    <>
      <div className="bl-photos">
        {photos.map((p, i) => (
          <div key={p.key} className="bl-photo" style={{ rotate: `${(i % 2 ? 1 : -1) * (1.5 + (i % 3))}deg` }}>
            <button type="button" className="bl-photo-open" onClick={() => setViewing(i)} aria-label={`Xem ảnh ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt="" />
            </button>
            {onChange && (
              <button type="button" className="bl-photo-x" aria-label="Gỡ ảnh" onClick={() => remove(p.key)}>
                ✕
              </button>
            )}
          </div>
        ))}
        {Array.from({ length: uploading }, (_, i) => (
          <div key={'u' + i} className="bl-photo bl-photo--loading">
            Đang tải…
          </div>
        ))}
        {onChange && photos.length + uploading < BUCKET_MAX_PHOTOS && (
          <button type="button" className="bl-photo bl-photo--add" onClick={() => inputRef.current?.click()}>
            + Thêm ảnh
          </button>
        )}
        {onChange && (
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ''
            }}
          />
        )}
      </div>

      {viewing !== null && photos[viewing] && (
        <div className="bl-lightbox" onClick={() => setViewing(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[viewing].url} alt="" onClick={(e) => e.stopPropagation()} />
          {photos.length > 1 && <span className="bl-lightbox-count">{`${viewing + 1} / ${photos.length}`}</span>}
        </div>
      )}
    </>
  )
}
