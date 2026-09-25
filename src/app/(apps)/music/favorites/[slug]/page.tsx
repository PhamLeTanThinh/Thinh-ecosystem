import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AppBreadcrumb } from '@/components/study/Breadcrumb'
import { SongView } from '@/components/music/SongView'
import { FAVORITE_SONGS, getFavoriteSong, songPageImages } from '@/lib/music/songs'

export function generateStaticParams() {
  return FAVORITE_SONGS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps<'/music/favorites/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const song = getFavoriteSong(slug)
  return { title: song ? `${song.title} — ${song.artist}` : 'Nhạc yêu thích' }
}

export default async function MusicSongPage({ params }: PageProps<'/music/favorites/[slug]'>) {
  const { slug } = await params
  const song = getFavoriteSong(slug)
  if (!song) notFound()

  return (
    <div className="ms-content ms-song-page">
      <AppBreadcrumb
        app="/music"
        trail={[
          { label: 'Nhạc yêu thích', href: '/music/favorites', icon: 'star' },
          { label: song.title, icon: 'note' },
        ]}
      />

      <div className="ms-song-bar">
        <div>
          <h1 className="ms-title">{song.title}</h1>
          <p className="ms-subtitle">
            {song.artist} · Arr. {song.arranger}
          </p>
        </div>
        <div className="ms-song-actions">
          <a href={song.pdf} target="_blank" rel="noreferrer" className="ms-btn">
            Mở tab mới
          </a>
          <a href={song.pdf} download className="ms-btn ms-btn-primary">
            Tải PDF
          </a>
        </div>
      </div>

      <SongView song={song} pageImages={songPageImages(song)} />
    </div>
  )
}
