// Nén ảnh ngay trên trình duyệt trước khi tải lên: cạnh dài tối đa 1600px, WebP (trình duyệt không hỗ trợ thì
// JPEG). Ảnh điện thoại 5–10MB còn vài trăm KB — nằm gọn dưới giới hạn body 4.5MB của Vercel.
const MAX_SIDE = 1600

export async function compressImage(file: File): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(`Không đọc được ảnh "${file.name}" — thử ảnh JPEG/PNG khác`)
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82))
  const webp = await toBlob('image/webp')
  if (webp && webp.type === 'image/webp') return webp
  const jpeg = await toBlob('image/jpeg')
  if (!jpeg) throw new Error(`Không nén được ảnh "${file.name}"`)
  return jpeg
}
