export interface FavoriteSong {
  slug: string
  title: string
  artist: string
  arranger?: string // người soạn/chép bản piano — bỏ trống nếu bản nhạc không ghi
  // Ảnh từng trang bản nhạc (public/music/<slug>/page-<n>.webp) — dựng sẵn từ PDF để xem được ở mọi trình duyệt.
  // `pages` và `pdf` đi cùng nhau; bài chỉ có MusicXML (không có PDF) thì bỏ cả 2 — trang bài hát chỉ hiện
  // bản nhạc tương tác, không có tab "PDF gốc" / nút tải PDF.
  pages?: number
  // File PDF gốc trong /public, dùng cho nút tải về / mở tab mới.
  pdf?: string
  // File MusicXML (public/music/<slug>/score.musicxml), dựng từ PDF bằng OMR (xem ghi chú bên dưới) —
  // có trường này thì trang bài hát mới hiện được bản nhạc tương tác (ScorePlayer): tô nốt, phát âm
  // thanh piano, phím đàn mô phỏng. Không có thì trang chỉ hiện ảnh PDF như cũ.
  musicxml?: string
  // Tempo mặc định (nốt đen/phút) khi mở bản nhạc tương tác — người xem vẫn chỉnh được bằng thanh Tempo.
  // Không khai báo thì dùng mặc định của ScorePlayer.
  bpm?: number
}

// Thêm bản nhạc mới:
// 1. Bỏ PDF vào public/music/<slug>.pdf, xuất từng trang thành ảnh page-<n>.webp trong public/music/<slug>/.
// 2. (Tuỳ chọn, để có bản nhạc tương tác) Nếu tải được MusicXML từ MuseScore (file .mxl — chỉ là .zip, giải
//    nén lấy score.xml) thì chép thẳng thành public/music/<slug>/score.musicxml, chính xác hơn hẳn OMR.
//    MuseScore hay không ghi tempo trong file → khai báo `bpm` ở mục bài hát.
//    Chỉ có PDF thì nhận diện nốt nhạc ra MusicXML bằng Audiveris (OMR, miễn phí,
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
  {
    slug: 'tori-no-uta',
    title: 'Tori no Uta',
    artist: 'Shinji Orito',
    arranger: 'Kyle Landry',
    pages: 4,
    pdf: '/music/tori-no-uta.pdf',
    // Xuất thẳng từ MuseScore (giải nén file .mxl tải về) — không qua OMR nên nốt/tiết tấu chính xác.
    musicxml: '/music/tori-no-uta/score.musicxml',
    bpm: 100, // tempo gốc của bản này — file MusicXML không ghi tempo nên khai báo tay
  },
  {
    slug: 'the-beginning',
    title: 'The Beginning',
    artist: 'Ryan Arcand',
    arranger: 'Jasper',
    pages: 2,
    pdf: '/music/the-beginning.pdf',
    musicxml: '/music/the-beginning/score.musicxml', // xuất từ MuseScore, không ghi tempo
  },
  {
    slug: 'fairy-tail',
    title: 'Fairy Tail Theme Song',
    artist: 'Yasuharu Takanashi',
    arranger: 'Finnegan Jarrell',
    pages: 6, // trang 1 là ảnh bìa, bản nhạc từ trang 2
    pdf: '/music/fairy-tail.pdf',
    musicxml: '/music/fairy-tail/score.musicxml',
    bpm: 116, // theo ký hiệu tempo trong file (♩ = 116) — ScorePlayer không tự đọc tempo từ MusicXML
  },
  {
    slug: 'cheri-cheri-lady',
    title: 'Cheri Cheri Lady',
    artist: 'Modern Talking',
    // bản nhạc không ghi người soạn (chỉ có tên trang web nguồn) → bỏ trống arranger
    pages: 2,
    pdf: '/music/cheri-cheri-lady.pdf',
    musicxml: '/music/cheri-cheri-lady/score.musicxml',
    bpm: 120, // theo ký hiệu tempo trong file (♩ = 120)
  },
  {
    slug: 'lemon',
    title: 'Lemon',
    artist: 'Kenshi Yonezu',
    pages: 4,
    pdf: '/music/lemon.pdf',
    // Chỉ có PDF → nhận diện bằng Audiveris rồi sửa tay: bỏ 2 ô rỗng thừa, sửa dấu hoá 7 dấu giáng bị đọc
    // nhầm ở Coda/Chorus cuối, dọn ký hiệu rác (sf, p, nốt hoa mỹ, 15ma...), và "trải" D.S. al Coda (chép lại
    // ô 11–32 sau ô 36) để phát đúng thứ tự bài. Số ô nhịp giữ theo PDF nên đoạn trải ra lặp lại số 11–32.
    musicxml: '/music/lemon/score.musicxml',
    bpm: 90, // ♩ = 90 theo bản gốc (bản gốc đánh móc kép swing, ở đây phát thẳng)
  },
  {
    slug: '3-gatsu-9-ka',
    title: '3月9日 (Sangatsu Kokonoka)',
    artist: 'Remioromen',
    arranger: 'Hirota Yoshimi',
    // chỉ có MusicXML từ MuseScore, không có PDF; có dấu lặp + khung 1/khung 2 (xem buildPlaybackSchedule)
    musicxml: '/music/3-gatsu-9-ka/score.musicxml',
    bpm: 76, // theo ký hiệu tempo trong file (♩ = 76)
  },
  {
    slug: 'love-story',
    title: 'Love Story',
    artist: 'Indila',
    pages: 7,
    pdf: '/music/love-story.pdf',
    // Chỉ có PDF → nhận diện bằng Audiveris rồi sửa: chép tay lại tay phải ở ~45 ô OMR đọc sai nhịp móc đơn,
    // đặt lại toàn bộ 8va theo PDF (OMR ghi cao độ VIẾT → nâng cao độ thật lên 1 quãng 8, giữ ký hiệu 8va để
    // hiển thị như PDF), hạ nốt trầm ở các ô "8vb", thêm khung 2 đoạn Bridge, dọn ký hiệu rác.
    musicxml: '/music/love-story/score.musicxml',
    bpm: 192, // Fast waltz ♩ = 192
  },
  {
    slug: 'beanie',
    title: 'Beanie',
    artist: 'Chezile',
    pages: 5,
    pdf: '/music/beanie.pdf',
    // Chỉ có PDF → nhận diện bằng Audiveris (đọc khá chuẩn) rồi sửa: bỏ ~30 "khung lặp 1/2" giả (OMR đọc nhầm
    // ngoặc pedal), sửa tay trái ô 17/50 (đọc nhầm thành chùm 3), dọn dynamics/dấu nhấn/pedal rác.
    musicxml: '/music/beanie/score.musicxml',
    bpm: 139, // ♩ = 139 theo bản gốc
  },
  {
    slug: 'una-mattina-x-tori-no-uta',
    title: 'Una Mattina × Tori no Uta',
    artist: 'Ludovico Einaudi × Shinji Orito',
    // chỉ có MusicXML từ MuseScore (không có PDF), không ghi người soạn. Nhãn đoạn gốc tiếng Trung
    // (触不可及 / 鸟之诗) đã đổi sang "Una Mattina" / "Tori no Uta (Animenz arr.)".
    musicxml: '/music/una-mattina-x-tori-no-uta/score.musicxml',
    bpm: 140, // theo ký hiệu tempo trong file (♩ = 140)
  },
]

export function getFavoriteSong(slug: string): FavoriteSong | undefined {
  return FAVORITE_SONGS.find((s) => s.slug === slug)
}

export function songPageImages(song: FavoriteSong): string[] {
  return Array.from({ length: song.pages ?? 0 }, (_, i) => `/music/${song.slug}/page-${i + 1}.webp`)
}
