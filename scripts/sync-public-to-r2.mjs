// Đẩy các thư mục ảnh lớn trong public/ lên Cloudflare R2 (cùng đường dẫn) — các thư mục này KHÔNG commit vào git
// (.gitignore) để mỗi bản deploy Vercel không mang theo hàng trăm MB; trên web, next.config.ts chuyển hướng
// /<thư mục>/… sang R2_PUBLIC_URL/<thư mục>/…  (xem R2_DIRS bên dưới — phải khớp với redirects trong next.config.ts).
//   node --env-file=.env.local scripts/sync-public-to-r2.mjs [thư mục…] [--delete] [--dry-run]
// Mặc định đồng bộ mọi thư mục trong R2_DIRS; chỉ upload file chưa có trên R2 hoặc khác kích thước.
// --delete: xoá trên R2 các file không còn ở máy (vd ảnh từ vựng đã gỡ vì lệch nghĩa).
import fs from 'node:fs'
import path from 'node:path'
import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3'

export const R2_DIRS = ['ielts/images/vocab', 'ielts/images/writing-task1', 'ielts/images/remote', 'korean/vocab-img', 'chinese/vocab-img']

const args = process.argv.slice(2)
const dirs = args.filter((a) => !a.startsWith('--'))
const del = args.includes('--delete')
const dryRun = args.includes('--dry-run')
for (const k of ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME']) {
  if (!process.env[k]) throw new Error(`Thiếu ${k} trong .env.local`)
}
const Bucket = process.env.R2_BUCKET_NAME
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
})

const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg' }

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
}

async function listRemote(prefix) {
  const out = new Map()
  let ContinuationToken
  do {
    const res = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: `${prefix}/`, ContinuationToken }))
    for (const o of res.Contents ?? []) out.set(o.Key, o.Size)
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (ContinuationToken)
  return out
}

for (const dir of dirs.length ? dirs : R2_DIRS) {
  const local = walk(path.join('public', dir)).map((f) => ({ file: f, key: path.relative('public', f).split(path.sep).join('/') }))
  const remote = await listRemote(dir)
  const todo = local.filter(({ file, key }) => remote.get(key) !== fs.statSync(file).size)
  const stale = del ? [...remote.keys()].filter((k) => !local.some((l) => l.key === k)) : []
  let done = 0
  // Upload song song theo lô nhỏ — vài nghìn ảnh nhỏ, tuần tự thì quá chậm
  for (let i = 0; i < todo.length; i += 8) {
    await Promise.all(
      todo.slice(i, i + 8).map(async ({ file, key }) => {
        if (!dryRun) {
          await s3.send(new PutObjectCommand({
            Bucket,
            Key: key,
            Body: fs.readFileSync(file),
            ContentType: TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream',
            CacheControl: 'public, max-age=86400',
          }))
        }
        done++
      }),
    )
  }
  for (let i = 0; i < stale.length; i += 1000) {
    if (!dryRun) await s3.send(new DeleteObjectsCommand({ Bucket, Delete: { Objects: stale.slice(i, i + 1000).map((Key) => ({ Key })) } }))
  }
  console.log(`${dryRun ? '(dry-run) ' : ''}${dir}: ${local.length} file ở máy · ${remote.size} trên R2 · upload ${done}${del ? ` · xoá ${stale.length}` : ''}`)
}
