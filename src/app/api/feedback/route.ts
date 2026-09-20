import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { siteFeedback } from '@/db/schema'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const CreateSchema = z.object({
  message: z.string().trim().min(1, 'Góp ý đang trống').max(2000, 'Góp ý dài quá, rút gọn lại giúp mình nhé'),
  page: z.string().max(200).optional(),
})

// POST /api/feedback — không cần đăng nhập, ai cũng gửi được (xem db/schema/index.ts:siteFeedback).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, page } = CreateSchema.parse(body)

    await db.insert(siteFeedback).values({ id: nanoid(), message, page: page ?? '' })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
