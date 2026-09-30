import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@/db/schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

// Serverless (Vercel): mỗi function instance có pool riêng nên giữ pool nhỏ, nhả kết nối rảnh sớm để nhiều người dùng cùng lúc
// không chạm giới hạn max_connections của Postgres (Railway mặc định ~100).
// Không đặt connectionTimeoutMillis: mở kết nối mới tới Railway có lúc mất >10s (mạng chậm), timeout làm request lỗi
// 500 thay vì chỉ chậm — để mặc định của pg (chờ tới khi kết nối xong).
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000 })

export const db = drizzle(pool, { schema })
export type DB = typeof db
