// Đẩy âm thanh Listening đã tải về máy (public/ielts/audio/<đề>/s<N>.mp3) lên Vercel Blob (store PRIVATE) để bản deploy
// phát được mà không phải gói ~366 MB mp3 vào function / static. Route /api/ielts/audio đọc lại từ Blob khi không có file cục bộ.
//   npx vercel env pull .env.vercel --environment=production --yes    (lấy BLOB_STORE_ID + VERCEL_OIDC_TOKEN, token hết hạn sau ~12h)
//   node --env-file=.env.vercel scripts/upload-listening-audio.mjs
// Hoặc dùng BLOB_READ_WRITE_TOKEN nếu store còn read-write token. Blob đã có cùng dung lượng thì bỏ qua.
import fs from 'node:fs'
import path from 'node:path'
import { list, put } from '@vercel/blob'

const SRC = 'public/ielts/audio'
const PREFIX = 'ielts/audio/'

if (!(process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN) && !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Thiếu thông tin Blob — chạy: npx vercel env pull .env.vercel --environment=production --yes, rồi node --env-file=.env.vercel scripts/upload-listening-audio.mjs')
  process.exit(1)
}

const mb = (n) => (n / 1048576).toFixed(1) + ' MB'

// Dung lượng các blob đã có (1 lần list mỗi 1000 blob)
const existing = new Map()
let cursor
do {
  const page = await list({ prefix: PREFIX, cursor, limit: 1000 })
  for (const b of page.blobs) existing.set(b.pathname, b.size)
  cursor = page.hasMore ? page.cursor : undefined
} while (cursor)

let ok = 0
let skipped = 0
let failed = 0
for (const test of fs.readdirSync(SRC).sort()) {
  const dir = path.join(SRC, test)
  if (!fs.statSync(dir).isDirectory()) continue
  for (const f of fs.readdirSync(dir).filter((x) => /^s\d+\.mp3$/.test(x)).sort()) {
    const file = path.join(dir, f)
    const size = fs.statSync(file).size
    const pathname = `${PREFIX}${test}/${f}`
    if (existing.get(pathname) === size) {
      console.log(`  ${pathname}: đã có (${mb(size)})`)
      skipped++
      continue
    }
    try {
      await put(pathname, fs.createReadStream(file), {
        access: 'private',
        contentType: 'audio/mpeg',
        addRandomSuffix: false,
        allowOverwrite: true,
        multipart: true,
      })
      console.log(`  ${pathname}: đã đẩy (${mb(size)})`)
      ok++
    } catch (e) {
      console.warn(`  ${pathname}: LỖI ${e.message}`)
      failed++
    }
  }
}
console.log(`Xong: ${ok} đẩy mới, ${skipped} đã có, ${failed} lỗi → Vercel Blob ${PREFIX}`)
