import { NextRequest, NextResponse } from 'next/server'
import { getUploadPresignedUrl } from '@/lib/r2'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const Schema = z.object({
  filename: z.string(),
  contentType: z.string().regex(/^image\//),
  folder: z.string().default('uploads'),
})

// POST /api/upload — lấy presigned URL để client upload thẳng lên R2
// Tránh đi qua Vercel (giới hạn 4.5MB body)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { filename, contentType, folder } = Schema.parse(body)

    const ext = filename.split('.').pop() ?? 'bin'
    const key = `${folder}/${nanoid()}.${ext}`

    const { uploadUrl, publicUrl } = await getUploadPresignedUrl(key, contentType)

    return NextResponse.json({ uploadUrl, publicUrl, key })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
