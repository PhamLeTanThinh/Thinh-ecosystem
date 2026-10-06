import Link from 'next/link'
import { TV_SHOWS, showLineCount } from '@/lib/ielts/tv'
import './tv.css'

// Danh sách phim (/ielts/tv) — mỗi phim 1 thẻ poster, dẫn vào trang của phim (các tập chia theo mùa).
export function TvIndex() {
  return (
    <div className="ih-tv">
      <header className="ih-tv-hero">
        <p className="ih-tv-kicker">🎬 Học qua phim</p>
        <h1 className="ih-font-hand ih-tv-title">Học tiếng Anh qua phim</h1>
        <p className="ih-tv-summary">Câu thoại gốc trong phim kèm bản dịch tự nhiên, cụm từ, cấu trúc và ngữ cảnh — học tiếng Anh nói thật qua từng tập.</p>
      </header>

      <div className="ih-tv-shows">
        {TV_SHOWS.map((show) => (
          <Link key={show.id} href={`/ielts/tv/${show.id}`} className="ih-glass ih-tv-show">
            {show.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="ih-tv-show-poster" src={show.poster} alt={`Poster ${show.title}`} />
            ) : (
              <span className="ih-tv-show-poster ih-tv-show-poster--empty" aria-hidden>
                🎬
              </span>
            )}
            <span className="ih-tv-show-body">
              <span className="ih-font-hand ih-tv-show-title">{show.title}</span>
              <span className="ih-tv-show-meta">
                {show.episodes.length} tập · {showLineCount(show)} mục học →
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
