import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID) {
  throw new Error('R2 credentials are not set')
}

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export const BUCKET = process.env.R2_BUCKET_NAME!
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!

/** Upload buffer trực tiếp lên R2 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
) {
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
  return `${R2_PUBLIC_URL}/${key}`
}

/** Tạo presigned URL để client upload thẳng lên R2 (bỏ qua Vercel 4.5MB limit) */
export async function getUploadPresignedUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  })
  const url = await getSignedUrl(r2, command, { expiresIn: 300 }) // 5 phút
  return { uploadUrl: url, publicUrl: `${R2_PUBLIC_URL}/${key}` }
}

/** Xoá file khỏi R2 */
export async function deleteFromR2(key: string) {
  await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
