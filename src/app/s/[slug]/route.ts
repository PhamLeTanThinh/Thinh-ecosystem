import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { shortUrls } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

// GET /s/[slug] — redirect đến URL gốc
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  const record = await db.query.shortUrls.findFirst({
    where: eq(shortUrls.slug, slug),
  })

  if (!record) {
    return NextResponse.redirect(
      new URL('/short?error=not-found', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  // Kiểm tra hết hạn
  if (record.expiresAt && record.expiresAt < new Date()) {
    return NextResponse.redirect(
      new URL('/short?error=expired', process.env.NEXT_PUBLIC_APP_URL!)
    )
  }

  // Tăng click count (không await để không block redirect)
  db.update(shortUrls)
    .set({ clicks: sql`${shortUrls.clicks} + 1` })
    .where(eq(shortUrls.slug, slug))
    .execute()
    .catch(console.error)

  return NextResponse.redirect(record.originalUrl, { status: 302 })
}
