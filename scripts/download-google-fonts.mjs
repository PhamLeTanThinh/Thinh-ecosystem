// Tải các font Google đang dùng về src/fonts/<slug>/ để tự host bằng next/font/local — build KHÔNG còn gọi
// Google Fonts nữa. Lý do: Turbopack (Next 16.2.x) thỉnh thoảng làm hỏng cả bản build production ở bước
// next/font/google ("next/font/google queries have exactly one entry"), lúc có lúc không tuỳ phản hồi của Google.
//
// Dùng API CSS cũ (fonts.googleapis.com/css) với user-agent IE11: Google trả về MỘT file .woff cho mỗi
// weight/style, đã gộp sẵn các subset yêu cầu (vd latin + vietnamese) — next/font/local không hỗ trợ chia file
// theo unicode-range nên cần đúng dạng "1 file đủ ký tự" này.
//
// Chạy: node scripts/download-google-fonts.mjs   (thêm/sửa font thì sửa FONTS rồi chạy lại, và cập nhật mảng
// `src` của localFont tương ứng — next/font/local cần mảng viết tay, không sinh động được).
import fs from 'node:fs'
import path from 'node:path'

const UA = 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko'
const OUT = path.resolve('src/fonts')

// family (tên trên Google Fonts), slug (thư mục), weights, italic, subsets — gộp mọi chỗ dùng cùng 1 font.
const FONTS = [
  { family: 'Cormorant Garamond', slug: 'cormorant-garamond', weights: [300, 400], italic: true, subsets: ['latin'] },
  { family: 'Caveat', slug: 'caveat', weights: [400, 500, 600, 700], subsets: ['latin'] },
  { family: 'DM Sans', slug: 'dm-sans', weights: [300, 400, 500], subsets: ['latin'] },
  { family: 'DM Mono', slug: 'dm-mono', weights: [300, 400], subsets: ['latin'] },
  { family: 'Londrina Solid', slug: 'londrina-solid', weights: [400, 900], subsets: ['latin'] },
  { family: 'Patrick Hand', slug: 'patrick-hand', weights: [400], subsets: ['latin', 'vietnamese'] },
  { family: 'Shantell Sans', slug: 'shantell-sans', weights: [500, 600, 700], subsets: ['latin', 'vietnamese'] },
  { family: 'Inter', slug: 'inter', weights: [400, 500, 600, 700, 800], subsets: ['latin', 'vietnamese'] },
  { family: 'Lexend', slug: 'lexend', weights: [300, 400, 500, 600], subsets: ['latin', 'vietnamese'] },
  { family: 'Fraunces', slug: 'fraunces', weights: [500, 700, 900], italic: true, subsets: ['latin', 'vietnamese'] },
  { family: 'Be Vietnam Pro', slug: 'be-vietnam-pro', weights: [400, 500, 600, 700], subsets: ['latin', 'vietnamese'] },
  { family: 'Oswald', slug: 'oswald', weights: [500, 700], subsets: ['latin', 'vietnamese'] },
  { family: 'Pacifico', slug: 'pacifico', weights: [400], subsets: ['latin', 'vietnamese'] },
  { family: 'Baloo 2', slug: 'baloo-2', weights: [600, 800], subsets: ['latin', 'vietnamese'] },
  { family: 'Bricolage Grotesque', slug: 'bricolage-grotesque', weights: [500, 600, 700], subsets: ['latin'] },
  { family: 'Instrument Sans', slug: 'instrument-sans', weights: [400, 500, 600], subsets: ['latin'] },
]

for (const f of FONTS) {
  const variants = f.weights.flatMap((w) => (f.italic ? [`${w}`, `${w}i`] : [`${w}`]))
  const url = `https://fonts.googleapis.com/css?family=${encodeURIComponent(f.family).replace(/%20/g, '+')}:${variants.join(',')}&subset=${f.subsets.join(',')}`
  const css = await fetch(url, { headers: { 'User-Agent': UA } }).then((r) => {
    if (!r.ok) throw new Error(`${f.family}: ${r.status} ${url}`)
    return r.text()
  })
  const dir = path.join(OUT, f.slug)
  fs.mkdirSync(dir, { recursive: true })
  const faces = [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map((m) => m[1])
  for (const face of faces) {
    const style = /font-style:\s*(\w+)/.exec(face)[1]
    const weight = /font-weight:\s*(\d+)/.exec(face)[1]
    const src = /url\(([^)]+)\)/.exec(face)[1]
    const file = `${f.slug}-${weight}${style === 'italic' ? '-italic' : ''}.woff`
    const buf = Buffer.from(await fetch(src).then((r) => r.arrayBuffer()))
    fs.writeFileSync(path.join(dir, file), buf)
    console.log(`${f.slug}/${file}  ${(buf.length / 1024).toFixed(1)} KB`)
  }
  if (faces.length !== variants.length) console.warn(`  ⚠ ${f.family}: cần ${variants.length} file, Google trả ${faces.length}`)
}
