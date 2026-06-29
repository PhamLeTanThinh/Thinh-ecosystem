import { NextRequest, NextResponse } from 'next/server'
import { createSnapshot, getBackupRecordData, restoreData } from '@/lib/money/backup'
import type { MoneyBackupData } from '@/lib/money/types'

// Body: { backupId: string } để khôi phục từ 1 bản sao lưu đã lưu, hoặc { data: MoneyBackupData }
// để khôi phục từ file JSON người dùng tự tải lên. Luôn tạo 1 snapshot của trạng thái hiện tại
// trước khi ghi đè, để việc khôi phục — vốn cũng là 1 lần ghi đè toàn bộ — không bao giờ là ngõ cụt.
export async function POST(req: NextRequest) {
  const body: { backupId?: string; data?: MoneyBackupData } = await req.json()

  const data = body.data ?? (body.backupId ? await getBackupRecordData(body.backupId) : null)
  if (!data) {
    return NextResponse.json({ ok: false, error: 'Backup not found' }, { status: 404 })
  }

  await createSnapshot()
  await restoreData(data)

  return NextResponse.json({ ok: true })
}
