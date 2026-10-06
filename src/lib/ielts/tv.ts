// Học tiếng Anh qua phim (/ielts/tv → /ielts/tv/<phim> → /ielts/tv/<phim>/<tập>): mỗi tập phim là 1 bài, mỗi mục học dựa
// trên CÂU THOẠI GỐC đầy đủ (không phải từ đứng riêng lẻ) kèm bản dịch tự nhiên, cụm từ / từ vựng theo ngữ cảnh, cấu trúc
// ngữ pháp, giải thích ngữ cảnh (vd vì sao câu đó buồn cười) và câu ví dụ áp dụng. Dữ liệu tĩnh trong
// src/data/ielts/tv/<phim>/ (mỗi tập 1 file), phim đăng ký ở TV_SHOWS bên dưới.
import { THE_BIG_BANG_THEORY } from '@/data/ielts/tv/the-big-bang-theory'

export type TvTag = 'vocabulary' | 'idiom' | 'phrasal-verb' | 'spoken' | 'grammar' | 'literary' | 'slang' | 'academic' | 'culture'

export const TV_TAGS: { key: TvTag; label: string }[] = [
  { key: 'spoken', label: 'Văn nói' },
  { key: 'idiom', label: 'Thành ngữ' },
  { key: 'phrasal-verb', label: 'Phrasal verb' },
  { key: 'vocabulary', label: 'Từ vựng' },
  { key: 'grammar', label: 'Ngữ pháp' },
  { key: 'slang', label: 'Tiếng lóng' },
  { key: 'literary', label: 'Văn chương / trang trọng' },
  { key: 'academic', label: 'Học thuật' },
  { key: 'culture', label: 'Văn hoá' },
]

// 1 cụm từ / từ vựng học trong ngữ cảnh câu. `high` = cụm dùng hằng ngày nên ưu tiên thuộc; `low` = từ chuyên ngành /
// văn chương hiếm gặp, biết để hiểu phim là đủ.
export interface TvChunk {
  phrase: string
  meaning: string
  note?: string
  priority?: 'high' | 'low'
}

// Cấu trúc ngữ pháp / mẫu câu dùng lại được
export interface TvPattern {
  pattern: string
  meaning: string
  note?: string
  priority?: 'high' | 'low'
}

export interface TvLine {
  id: string
  // Câu thoại gốc — nhiều lượt nói (vd hỏi – đáp) thì mỗi phần tử 1 lượt. Mục chỉ có từ vựng, không kèm câu thoại
  // (vd "monsoon season") thì để mảng rỗng.
  original: string[]
  translation?: string
  chunks: TvChunk[]
  patterns?: TvPattern[]
  // Giải thích nghĩa trong đúng ngữ cảnh / vì sao câu đó gây cười
  context?: string
  examples?: { en: string; vi?: string }[]
  tags: TvTag[]
}

export interface TvEpisode {
  id: string // đoạn URL của tập trong phim: /ielts/tv/<show>/<id>, vd 's01e08'
  season: number
  episode: number
  title: string
  summary: string
  lines: TvLine[]
}

// 1 bộ phim — gồm các tập đã học, chia theo mùa ở trang của phim
export interface TvShow {
  id: string // đoạn URL: /ielts/tv/<id>
  title: string
  poster?: string // ảnh poster phim (đường dẫn tĩnh trong public/), dùng làm thumbnail
  description: string
  episodes: TvEpisode[]
}

export const TV_SHOWS: TvShow[] = [THE_BIG_BANG_THEORY]

export const episodeCode = (ep: Pick<TvEpisode, 'season' | 'episode'>) => `S${String(ep.season).padStart(2, '0')}E${String(ep.episode).padStart(2, '0')}`

export function getTvShow(id: string): TvShow | undefined {
  return TV_SHOWS.find((s) => s.id === id)
}

export function getTvEpisode(showId: string, episodeId: string): { show: TvShow; episode: TvEpisode } | undefined {
  const show = getTvShow(showId)
  const episode = show?.episodes.find((ep) => ep.id === episodeId)
  return show && episode ? { show, episode } : undefined
}

// Các tập của 1 phim chia theo mùa, mùa và tập đều tăng dần
export function seasonsOf(show: TvShow): { season: number; episodes: TvEpisode[] }[] {
  const sorted = [...show.episodes].sort((a, b) => a.season - b.season || a.episode - b.episode)
  const seasons = [...new Set(sorted.map((ep) => ep.season))]
  return seasons.map((season) => ({ season, episodes: sorted.filter((ep) => ep.season === season) }))
}

export const showLineCount = (show: TvShow) => show.episodes.reduce((sum, ep) => sum + ep.lines.length, 0)
