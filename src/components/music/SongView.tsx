'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { FavoriteSong } from '@/lib/music/songs'
import { ScorePlayer } from './ScorePlayer'

// Kích thước ảnh trang A4 đã xuất (chỉ để giữ đúng tỉ lệ, chưa tải xong ảnh trang không bị nhảy bố cục).
const PAGE_WIDTH = 2396
const PAGE_HEIGHT = 3384

interface Props {
  song: FavoriteSong
  pageImages: string[]
}

// Chuyển đổi giữa 2 cách xem 1 bài hát: bản nhạc tương tác (đọc được nốt, phát âm thanh, phím đàn mô
// phỏng — xem ScorePlayer) và ảnh PDF gốc như cũ. Chỉ những bài đã có MusicXML (xem songs.ts) mới có
// nút chuyển; bài chưa có thì luôn hiện PDF, giữ đúng hành vi cũ.
export function SongView({ song, pageImages }: Props) {
  const [view, setView] = useState<'score' | 'pdf'>(song.musicxml ? 'score' : 'pdf')

  return (
    <>
      {song.musicxml && (
        <div className="ms-view-toggle" role="tablist" aria-label="Cách xem bản nhạc">
          <button type="button" role="tab" aria-selected={view === 'score'} className="ms-view-tab" onClick={() => setView('score')}>
            ♪ Bản nhạc tương tác
          </button>
          <button type="button" role="tab" aria-selected={view === 'pdf'} className="ms-view-tab" onClick={() => setView('pdf')}>
            PDF gốc
          </button>
        </div>
      )}

      {view === 'score' && song.musicxml ? (
        <ScorePlayer slug={song.slug} title={song.title} musicxml={song.musicxml} />
      ) : (
        <div className="ms-song-frame">
          <div className="ms-pdf-pages">
            {pageImages.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={`${song.title} — trang ${i + 1}`}
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                sizes="(max-width: 1000px) 100vw, 1000px"
                className="ms-pdf-page"
                unoptimized
                priority={i === 0}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
