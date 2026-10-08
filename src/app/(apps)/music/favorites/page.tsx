import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { FAVORITE_SONGS, type FavoriteSong } from '@/lib/music/songs'
import { DEFAULT_BPM } from '@/lib/music/scorePlayback'
import type { CSSProperties } from 'react'

// Màu bìa riêng cho từng bài theo thứ tự trong danh sách, cách nhau 1 "góc vàng" (~137.5°) trên vòng màu —
// nhờ vậy các bài cạnh nhau luôn khác màu rõ rệt (băm theo tên dễ ra nhiều màu na ná nhau).
function coverHue(index: number): number {
  return Math.round((20 + index * 137.508) % 360)
}

// Ký tự hiện trên bìa: chữ/số đầu tiên của tên bài (vd. "3月9日" → "3", "Love Story" → "L").
function coverLetter(song: FavoriteSong): string {
  return Array.from(song.title.trim())[0]?.toUpperCase() ?? '♪'
}

export default function MusicFavoritesPage() {
  return (
    <div className="ms-content ms-favorites-page">
      <AppBreadcrumb app="/music" trail={[{ label: 'Nhạc yêu thích', icon: 'star' }]} />

      <div className="ms-favorites-inner">
        <div className="ms-page-head">
          <span className="ms-page-icon" style={{ viewTransitionName: 'ms-level-favorites' } as CSSProperties}>
            ★
          </span>
          <div>
            <h1 className="ms-title">Nhạc yêu thích</h1>
            <p className="ms-subtitle">
              {FAVORITE_SONGS.length} bản nhạc piano — bấm vào để xem, nghe và tập theo.
            </p>
          </div>
        </div>

        <ul className="ms-song-list">
          {FAVORITE_SONGS.map((song, i) => (
            <li key={song.slug}>
              <Link
                href={`/music/favorites/${song.slug}`}
                className="ms-song-card"
                style={{ '--ms-hue': coverHue(i) } as CSSProperties}
              >
                <span className="ms-song-cover" aria-hidden="true">
                  <span className="ms-song-cover-letter">{coverLetter(song)}</span>
                  <span className="ms-song-cover-note">♪</span>
                </span>

                <span className="ms-song-info">
                  <span className="ms-song-title">{song.title}</span>
                  <span className="ms-song-artist">{song.artist}</span>
                  {song.arranger && <span className="ms-song-arranger">Arr. {song.arranger}</span>}
                  <span className="ms-song-tags">
                    {song.musicxml ? (
                      <span className="ms-tag">♩ {song.bpm ?? DEFAULT_BPM}</span>
                    ) : (
                      <span className="ms-tag ms-tag-strong">Chỉ có PDF</span>
                    )}
                    {song.pages ? <span className="ms-tag">PDF · {song.pages} trang</span> : null}
                  </span>
                </span>

                <span className="ms-song-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
