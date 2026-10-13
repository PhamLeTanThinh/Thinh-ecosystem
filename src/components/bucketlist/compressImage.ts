// Nén ảnh ngay trên trình duyệt trước khi tải lên: cạnh dài tối đa 1600px, WebP (trình duyệt không hỗ trợ thì
// JPEG). Ảnh điện thoại 5–10MB còn vài trăm KB — nằm gọn dưới giới hạn body 4.5MB của Vercel.
// Dùng chung cho bucket list và ảnh chứng từ của /trips.
const MAX_SIDE = 1600

type Source = { draw: CanvasImageSource; width: number; height: number; release: () => void }

// Đọc ảnh thành thứ vẽ được lên canvas. Thử lần lượt vì Safari iOS kén:
// 1) createImageBitmap có xoay theo EXIF — một số bản Safari không nhận tham số này và báo lỗi
// 2) createImageBitmap không tham số (Safari/Chrome mới tự xoay theo EXIF)
// 3) thẻ <img> — đường cuối, đọc được cả ảnh HEIC trên iPhone
async function loadImage(file: Blob): Promise<Source> {
  if (typeof createImageBitmap === 'function') {
    for (const opts of [{ imageOrientation: 'from-image' } as ImageBitmapOptions, undefined]) {
      try {
        const bmp = opts ? await createImageBitmap(file, opts) : await createImageBitmap(file)
        return { draw: bmp, width: bmp.width, height: bmp.height, release: () => bmp.close() }
      } catch {
        // thử cách tiếp theo
      }
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    await img.decode()
    return { draw: img, width: img.naturalWidth, height: img.naturalHeight, release: () => URL.revokeObjectURL(url) }
  } catch (e) {
    URL.revokeObjectURL(url)
    throw e
  }
}

export async function compressImage(file: File): Promise<Blob> {
  let src: Source
  try {
    src = await loadImage(file)
  } catch {
    throw new Error(`Không đọc được ảnh "${file.name}" — thử ảnh JPEG/PNG khác`)
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(src.width, src.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(src.width * scale))
  canvas.height = Math.max(1, Math.round(src.height * scale))
  canvas.getContext('2d')!.drawImage(src.draw, 0, 0, canvas.width, canvas.height)
  src.release()
  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82))
  // Safari không xuất được WebP (trả về PNG) → dùng JPEG
  const webp = await toBlob('image/webp')
  if (webp && webp.type === 'image/webp') return webp
  const jpeg = await toBlob('image/jpeg')
  if (!jpeg) throw new Error(`Không nén được ảnh "${file.name}"`)
  return jpeg
}
