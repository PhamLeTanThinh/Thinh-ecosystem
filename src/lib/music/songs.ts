export interface FavoriteSong {
  slug: string
  title: string
  artist: string
  arranger: string
  // Ảnh từng trang bản nhạc (public/music/<slug>/page-<n>.webp) — dựng sẵn từ PDF để xem được ở mọi trình duyệt.
  pages: number
  // File PDF gốc trong /public, dùng cho nút tải về / mở tab mới.
  pdf: string
  // File MusicXML (public/music/<slug>/score.musicxml), dựng từ PDF bằng OMR (xem ghi chú bên dưới) —
  // có trường này thì trang bài hát mới hiện được bản nhạc tương tác (ScorePlayer): tô nốt, phát âm
  // thanh piano, phím đàn mô phỏng. Không có thì trang chỉ hiện ảnh PDF như cũ.
  musicxml?: string
}

// Thêm bản nhạc mới:
// 1. Bỏ PDF vào public/music/<slug>.pdf, xuất từng trang thành ảnh page-<n>.webp trong public/music/<slug>/.
// 2. (Tuỳ chọn, để có bản nhạc tương tác) Nhận diện nốt nhạc từ PDF ra MusicXML bằng Audiveris (OMR, miễn phí,
//    https://github.com/Audiveris/audiveris — không phải dependency npm, chạy 1 lần ngoài app):
//      audiveris -batch -export -output <thư mục ra> -- <đường dẫn PDF>
//    rồi giải nén file .mxl ra (nó chỉ là 1 file .zip) và chép <tên>.xml thành public/music/<slug>/score.musicxml.
//    OMR không hoàn hảo 100% (có thể sai vài nốt/tiết tấu ở đoạn phức tạp), luôn đối chiếu lại bằng tai.
// 3. Khai báo thêm 1 mục ở đây.
export const FAVORITE_SONGS: FavoriteSong[] = [
  {
    slug: 'flower-dance',
    title: 'Flower Dance',
    artist: 'DJ Okawari',
    arranger: 'Riyandi Kusuma',
    pages: 7,
    pdf: '/music/flower-dance.pdf',
    musicxml: '/music/flower-dance/score.musicxml',
  },
]

export function getFavoriteSong(slug: string): FavoriteSong | undefined {
  return FAVORITE_SONGS.find((s) => s.slug === slug)
}

export function songPageImages(song: FavoriteSong): string[] {
  return Array.from({ length: song.pages }, (_, i) => `/music/${song.slug}/page-${i + 1}.webp`)
}
