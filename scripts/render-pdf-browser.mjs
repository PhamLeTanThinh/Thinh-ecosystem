// Render trang PDF giáo trình (bản scan) ra PNG bằng pdf.js chạy trong Chrome (Playwright) — dùng khi
// scripts/chinese-render-pdf.mjs (@napi-rs/canvas) bị crash/segfault, như với các file 서울대 한국어 1A/1B/2A/2B:
//   node scripts/render-pdf-browser.mjs <file.pdf> <thư-mục-ra> [trang-đầu=1] [trang-cuối=hết] [scale=1.3] [xoay=0]
// vd: node scripts/render-pdf-browser.mjs "D:/.../서울대 2B student book.pdf" scripts/korean-src/2b 1 266 1.1 180
//   - xoay: 90 | 180 | 270 — cho bản scan bị lật (2B scan ngược 180°).
//   - Ra <thư-mục-ra>/p001.png… (đã có thì bỏ qua). scripts/korean-src/ và chinese-src/ bị git bỏ qua.
//   - PDF được phục vụ qua URL không đuôi .pdf với Content-Type octet-stream để IDM không bật hộp thoại tải xuống.
// Cần Chrome cài sẵn (CHROME_PATH để đổi đường dẫn) và playwright: npm i -D playwright (không cần tải trình duyệt).
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const [pdf, out, from = '1', to, scale = '1.3', rot = '0'] = process.argv.slice(2)
if (!pdf || !out) {
  console.error('Cách dùng: node scripts/render-pdf-browser.mjs <file.pdf> <thư-mục-ra> [trang-đầu] [trang-cuối] [scale] [xoay]')
  process.exit(1)
}
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PDFJS = path.resolve('node_modules/pdfjs-dist/build')
const PORT = 3131
fs.mkdirSync(out, { recursive: true })

const files = { '/pdf.mjs': `${PDFJS}/pdf.mjs`, '/pdf.worker.mjs': `${PDFJS}/pdf.worker.mjs`, '/d/src': pdf }
const server = http
  .createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'content-type': 'text/html' })
      return res.end('<html><body></body></html>')
    }
    const f = files[req.url]
    if (!f) {
      res.writeHead(404)
      return res.end()
    }
    res.writeHead(200, { 'content-type': f === pdf ? 'application/octet-stream' : 'text/javascript', 'content-length': fs.statSync(f).size })
    fs.createReadStream(f).pipe(res)
  })
  .listen(PORT)

const browser = await chromium.launch({ executablePath: CHROME })
try {
  const page = await browser.newPage()
  await page.goto(`http://localhost:${PORT}/`)
  const numPages = await page.evaluate(async () => {
    const pdfjs = await import('/pdf.mjs')
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'
    const r = await fetch('/d/src')
    if (!r.ok) throw new Error('fetch ' + r.status)
    window.doc = await pdfjs.getDocument({ data: new Uint8Array(await r.arrayBuffer()) }).promise
    return window.doc.numPages
  })
  const last = Math.min(to ? Number(to) : numPages, numPages)
  let made = 0
  for (let i = Number(from); i <= last; i++) {
    const dest = path.join(out, `p${String(i).padStart(3, '0')}.png`)
    if (fs.existsSync(dest)) continue
    const dataUrl = await page.evaluate(
      async ({ i, scale, rot }) => {
        const pg = await window.doc.getPage(i)
        const vp = pg.getViewport({ scale, rotation: (pg.rotate + rot) % 360 })
        const c = document.createElement('canvas')
        c.width = Math.ceil(vp.width)
        c.height = Math.ceil(vp.height)
        await pg.render({ canvasContext: c.getContext('2d'), viewport: vp, canvas: c }).promise
        pg.cleanup()
        return c.toDataURL('image/png')
      },
      { i, scale: Number(scale), rot: Number(rot) },
    )
    fs.writeFileSync(dest, Buffer.from(dataUrl.split(',')[1], 'base64'))
    made++
  }
  console.log(`Xong: ${made} trang mới (${numPages} trang) → ${out}`)
} finally {
  await browser.close()
  server.close()
}
