export interface FavoriteSong {
  slug: string
  title: string
  artist: string
  arranger: string
  // Ảnh từng trang bản nhạc (public/music/<slug>/page-<n>.webp) — dựng sẵn từ PDF để xem được ở mọi trình duyệt.
  pages: number
  // File PDF gốc trong /public, dùng cho nút tải về / mở tab mới.
  pdf: string
}

// Thêm bản nhạc mới: bỏ PDF vào public/music, xuất từng trang thành ảnh page-<n>.webp trong public/music/<slug>/,
// rồi khai báo thêm 1 mục ở đây.
export const FAVORITE_SONGS: FavoriteSong[] = [
  {
    slug: 'flower-dance',
    title: 'Flower Dance',
    artist: 'DJ Okawari',
    arranger: 'Riyandi Kusuma',
    pages: 7,
    pdf: '/music/flower-dance.pdf',
  },
]

export function getFavoriteSong(slug: string): FavoriteSong | undefined {
  return FAVORITE_SONGS.find((s) => s.slug === slug)
}

export function songPageImages(song: FavoriteSong): string[] {
  return Array.from({ length: song.pages }, (_, i) => `/music/${song.slug}/page-${i + 1}.webp`)
}
