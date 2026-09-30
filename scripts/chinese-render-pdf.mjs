// Render từng trang PDF giáo trình tiếng Trung (bản scan, không có lớp chữ) ra PNG để đọc nội dung bài:
//   node scripts/chinese-render-pdf.mjs <file.pdf> <thư-mục-ra> [trang-đầu=1] [trang-cuối=hết] [scale=1.6]
// vd: node scripts/chinese-render-pdf.mjs scripts/chinese-src/hsk3.pdf scripts/chinese-src/hsk3
// Ra <thư-mục-ra>/p001.png, p002.png… (đã có thì bỏ qua). scripts/chinese-src/ bị git bỏ qua.
// Từ ảnh trang, nội dung mỗi bài được chép sang scripts/chinese-data/<cấp>/Lnn.json rồi nạp bằng import-chinese-lessons.mjs.
import fs from 'node:fs'
import path from 'node:path'
import { createCanvas } from '@napi-rs/canvas'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

const [pdf, out, from = '1', to, scale = '1.6'] = process.argv.slice(2)
if (!pdf || !out) {
  console.error('Cách dùng: node scripts/chinese-render-pdf.mjs <file.pdf> <thư-mục-ra> [trang-đầu] [trang-cuối] [scale]')
  process.exit(1)
}
fs.mkdirSync(out, { recursive: true })
const doc = await getDocument({ data: new Uint8Array(fs.readFileSync(pdf)), verbosity: 0 }).promise
const last = Math.min(to ? Number(to) : doc.numPages, doc.numPages)
let made = 0
for (let i = Number(from); i <= last; i++) {
  const dest = path.join(out, `p${String(i).padStart(3, '0')}.png`)
  if (fs.existsSync(dest)) continue
  const page = await doc.getPage(i)
  const viewport = page.getViewport({ scale: Number(scale) })
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
  await page.render({ canvasContext: canvas.getContext('2d'), viewport, canvas }).promise
  fs.writeFileSync(dest, await canvas.encode('png'))
  made++
}
console.log(`Xong: ${made} trang mới (${doc.numPages} trang) → ${out}`)
