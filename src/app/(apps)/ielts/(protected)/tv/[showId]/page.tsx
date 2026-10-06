import { notFound } from 'next/navigation'
import { IeltsPlainShell } from '@/components/ielts/IeltsShell'
import { TvShowView } from '@/components/ielts/tv/TvShowView'
import { getTvShow } from '@/lib/ielts/tv'

export async function generateMetadata({ params }: { params: Promise<{ showId: string }> }) {
  const show = getTvShow((await params).showId)
  return { title: show ? `${show.title} — Học qua phim` : 'Học qua phim' }
}

// 1 phim: các tập đã học chia theo mùa (dữ liệu ở src/data/ielts/tv/<phim>/).
export default async function TvShowPage({ params }: { params: Promise<{ showId: string }> }) {
  const show = getTvShow((await params).showId)
  if (!show) notFound()
  return (
    <IeltsPlainShell trail={[{ label: 'Học qua phim', href: '/ielts/tv' }, { label: show.title }]}>
      <TvShowView show={show} />
    </IeltsPlainShell>
  )
}
