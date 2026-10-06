import Link from 'next/link'
import { episodeCode, seasonsOf, showLineCount, type TvShow } from '@/lib/ielts/tv'
import './tv.css'

// Trang 1 phim (/ielts/tv/<phim>): poster + giới thiệu, bên dưới là các tập đã học chia theo mùa.
export function TvShowView({ show }: { show: TvShow }) {
  return (
    <div className="ih-tv">
      <header className="ih-tv-show-hero">
        {show.poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ih-tv-show-hero-poster" src={show.poster} alt={`Poster ${show.title}`} />
        )}
        <div>
          <p className="ih-tv-kicker">🎬 Học qua phim</p>
          <h1 className="ih-font-hand ih-tv-title">{show.title}</h1>
          <p className="ih-tv-summary">{show.description}</p>
          <p className="ih-tv-stats">
            <span>
              <b>{show.episodes.length}</b> tập
            </span>
            <span>
              <b>{showLineCount(show)}</b> mục học
            </span>
          </p>
        </div>
      </header>

      {seasonsOf(show).map(({ season, episodes }) => (
        <section key={season} className="ih-tv-season">
          <h2 className="ih-tv-season-title">Mùa {season}</h2>
          <div className="ih-tv-episodes">
            {episodes.map((ep) => (
              <Link key={ep.id} href={`/ielts/tv/${show.id}/${ep.id}`} className="ih-glass ih-tv-episode">
                <span className="ih-tv-episode-code">{episodeCode(ep)}</span>
                <span className="ih-tv-episode-body">
                  <span className="ih-font-hand ih-tv-episode-title">{ep.title}</span>
                  <span className="ih-tv-episode-summary">{ep.summary}</span>
                  <span className="ih-tv-episode-meta">{ep.lines.length} mục học →</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
