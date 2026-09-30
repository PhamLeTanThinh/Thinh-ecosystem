import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@/db/schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

// Serverless (Vercel): mỗi function instance có pool riêng nên giữ pool nhỏ, nhả kết nối rảnh sớm để nhiều người dùng cùng lúc
// không chạm giới hạn max_connections của Postgres (Railway mặc định ~100).
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 10_000 })

export const db = drizzle(pool, { schema })
export type DB = typeof db
