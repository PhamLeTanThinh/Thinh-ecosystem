// Màu chủ đạo của từng app — 1 nguồn duy nhất cho thẻ ở /study (tools.ts) và vòng xoay loading
// (lib/loading/apps.ts), để thẻ luôn cùng tông với app mà nó mở ra. Mã cố định (không dùng
// var(--color-brand)...) vì /study không nạp CSS của các app kia nên các biến đó không tồn tại ở đó.
// Mỗi giá trị trùng với token màu chính của app:
//   ielts   --color-ih-rose      (ielts.css)
//   chinese --color-brand        (chinese.css)
//   korean  --color-brand        (korean.css)
//   vitrine --color-vt-teal      (vitrine.css) — app tạm ẩn khỏi /study, xem lib/apps/tools.ts
//   music   --color-ms-ink       (music.css)
//   pm      --color-accent       (pm.css)
//   it      --color-accent       (it.css)
//   certs   --color-accent       (certs.css)
export const APP_BRAND = {
  ielts: '#c9667a',
  chinese: '#b3222b',
  korean: '#1f4fd6',
  vitrine: '#0d9c78',
  music: '#111111',
  pm: '#7c3aed',
  it: '#059669',
  certs: '#0ea5e9',
} as const
