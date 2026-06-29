import { NextResponse } from 'next/server'
import { createSnapshot, getBackupData, listBackups } from '@/lib/money/backup'

export async function GET() {
  const backups = await listBackups()
  return NextResponse.json(backups)
}

// Tạo 1 bản sao lưu thủ công ngay lập tức, trả về luôn toàn bộ dữ liệu hiện tại
// (dùng để client tải xuống file JSON sao lưu mà không cần gọi thêm request).
export async function POST() {
  await createSnapshot()
  const data = await getBackupData()
  return NextResponse.json(data)
}
