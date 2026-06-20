import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Đọc env & tạo client lúc gọi (không phải lúc module load) — nếu không, thiếu biến R2_*
// sẽ làm crash toàn bộ Next.js build/runtime ngay cả với route không liên quan tới upload.
let client: S3Client | null = null

function getR2Client(): S3Client {
  if (client) return client
  if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
    throw new Error('R2 credentials are not set')
  }
  client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  })
  return client
}

function getBucket(): string {
  if (!process.env.R2_BUCKET_NAME) throw new Error('R2 credentials are not set')
  return process.env.R2_BUCKET_NAME
}

function getPublicUrl(): string {
  if (!process.env.R2_PUBLIC_URL) throw new Error('R2 credentials are not set')
  return process.env.R2_PUBLIC_URL
}

/** Upload buffer trực tiếp lên R2 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
) {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return `${getPublicUrl()}/${key}`
}

/** Tạo presigned URL để client upload thẳng lên R2 (bỏ qua Vercel 4.5MB limit) */
export async function getUploadPresignedUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    ContentType: contentType,
  })
  const url = await getSignedUrl(getR2Client(), command, { expiresIn: 300 }) // 5 phút
  return { uploadUrl: url, publicUrl: `${getPublicUrl()}/${key}` }
}

/** Xoá file khỏi R2 */
export async function deleteFromR2(key: string) {
  await getR2Client().send(new DeleteObjectCommand({ Bucket: getBucket(), Key: key }))
}
