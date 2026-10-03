import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { linkGlossary, parseLessonMd } from '@/lib/lessons/parseLessonMd'
import type { LessonMeta } from '@/lib/lessons/types'

// Bài học Machine Learning — mỗi bài là 1 file Markdown trong src/content/it/machine-learning, thứ tự
// theo tên file (01-..., 02-...). URL của bài = tên file bỏ số thứ tự: 05-linear-regression.md →
// /it/master-ai/machinelearning/linear-regression. Chỉ gọi từ server component: các trang dùng nó được
// render tĩnh lúc build nên nội dung được đóng gói sẵn, runtime không cần đọc file.
const DIR = path.join(process.cwd(), 'src/content/it/machine-learning')
export const ML_BASE_PATH = '/it/master-ai/machinelearning'

export function getMlLessons() {
  const files = readdirSync(DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
  const raws = files.map((f) => readFileSync(path.join(DIR, f), 'utf8'))
  const lessons = files.map((f, i) => parseLessonMd(f.replace(/\.md$/, '').replace(/^\d+-/, ''), raws[i]))
  return linkGlossary(lessons, raws)
}

// Danh sách gọn cho lưới + sidebar — không kèm nội dung bài
export function getMlLessonList(): LessonMeta[] {
  return getMlLessons().lessons.map(({ slug, title, short, icon }) => ({ slug, title, short, icon }))
}
