import Link from 'next/link'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { FAVORITE_SONGS } from '@/lib/music/songs'
import type { CSSProperties } from 'react'

export default function MusicFavoritesPage() {
  return (
    <div className="ms-content ms-favorites-page">
      <AppBreadcrumb app="/music" trail={[{ label: 'Nhạc yêu thích', icon: 'star' }]} />

      <div className="ms-page-head">
        <span className="ms-page-icon" style={{ viewTransitionName: 'ms-level-favorites' } as CSSProperties}>
          ★
        </span>
        <div>
          <h1 className="ms-title">Nhạc yêu thích</h1>
          <p className="ms-subtitle">{FAVORITE_SONGS.length} bản nhạc — bấm vào để xem bản nhạc.</p>
        </div>
      </div>

      <ul className="ms-song-list">
        {FAVORITE_SONGS.map((song) => (
          <li key={song.slug}>
            <Link href={`/music/favorites/${song.slug}`} className="ms-song-card">
              <span className="ms-song-icon" aria-hidden="true">
                ♪
              </span>
              <span className="ms-song-info">
                <span className="ms-song-title">{song.title}</span>
                <span className="ms-song-artist">{song.artist}</span>
                <span className="ms-song-meta">
                  Piano · {song.pages} trang · Arr. {song.arranger}
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
  )
}
