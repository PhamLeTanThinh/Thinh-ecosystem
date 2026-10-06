import { notFound } from 'next/navigation'
import { IeltsPlainShell } from '@/components/ielts/IeltsShell'
import { TvEpisodeView } from '@/components/ielts/tv/TvEpisodeView'
import { episodeCode, getTvEpisode } from '@/lib/ielts/tv'

type Params = Promise<{ showId: string; episodeId: string }>

export async function generateMetadata({ params }: { params: Params }) {
  const { showId, episodeId } = await params
  const found = getTvEpisode(showId, episodeId)
  return { title: found ? `${found.show.title} ${episodeCode(found.episode)} — Học qua phim` : 'Học qua phim' }
}

// 1 tập phim: câu thoại gốc + bản dịch + cụm từ + cấu trúc + ngữ cảnh.
export default async function TvEpisodePage({ params }: { params: Params }) {
  const { showId, episodeId } = await params
  const found = getTvEpisode(showId, episodeId)
  if (!found) notFound()
  const { show, episode } = found
  return (
    <IeltsPlainShell
      trail={[
        { label: 'Học qua phim', href: '/ielts/tv' },
        { label: show.title, href: `/ielts/tv/${show.id}` },
        { label: `${episodeCode(episode)} · ${episode.title}` },
      ]}
    >
      <TvEpisodeView show={show} episode={episode} />
    </IeltsPlainShell>
  )
}
