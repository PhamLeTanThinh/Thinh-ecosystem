import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { shortUrls } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const CreateSchema = z.object({
  url: z.string().url('URL không hợp lệ'),
  expiresInDays: z.number().min(1).max(365).optional(), // null = vĩnh viễn
  customSlug: z.string().min(3).max(12).optional(),
})

// POST /api/short — tạo short URL
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, expiresInDays, customSlug } = CreateSchema.parse(body)

    const slug = customSlug ?? nanoid(7)

    // Kiểm tra slug trùng
    if (customSlug) {
      const existing = await db.query.shortUrls.findFirst({
        where: eq(shortUrls.slug, slug),
      })
      if (existing) {
        return NextResponse.json(
          { error: 'Slug này đã được dùng' },
          { status: 409 }
        )
      }
    }

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86_400_000)
      : null

    const [created] = await db
      .insert(shortUrls)
      .values({ slug, originalUrl: url, expiresAt })
      .returning()

    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/s/${slug}`

    return NextResponse.json({ slug, shortUrl, expiresAt }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
