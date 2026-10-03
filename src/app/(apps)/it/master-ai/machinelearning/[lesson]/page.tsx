import { notFound } from 'next/navigation'
import { LessonShell } from '@/components/lessons/LessonShell'
import { APP_BRAND } from '@/lib/apps/brand'
import { getMlLessons, ML_BASE_PATH } from '@/lib/it/machineLearning'

// Mỗi bài Machine Learning 1 URL riêng, render tĩnh lúc build. Chỉ truyền nội dung bài đang xem + danh
// sách gọn (tên/icon) của các bài khác cho sidebar.
export function generateStaticParams() {
  return getMlLessons().lessons.map((l) => ({ lesson: l.slug }))
}

export const dynamicParams = false

async function load(params: Promise<{ lesson: string }>) {
  const { lesson: slug } = await params
  const { lessons, glossary } = getMlLessons()
  const current = lessons.find((l) => l.slug === slug)
  return current ? { current, glossary, lessonList: lessons.map(({ slug, title, short, icon }) => ({ slug, title, short, icon })) } : null
}

export async function generateMetadata({ params }: { params: Promise<{ lesson: string }> }) {
  const found = await load(params)
  return { title: found ? `${found.current.short} — Machine Learning` : 'Machine Learning', description: found?.current.summary }
}

export default async function MlLessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const found = await load(params)
  if (!found) notFound()
  const { current, glossary, lessonList } = found

  return (
    <LessonShell
      app="/it"
      trail={[{ label: 'Master AI', href: '/it/master-ai' }, { label: 'Machine Learning' }]}
      accent={APP_BRAND.it}
      topicLabel="Machine Learning"
      topicIcon="📈"
      count={lessonList.length}
      basePath={ML_BASE_PATH}
      lessonList={lessonList}
      current={current}
      glossary={glossary}
      transitionPrefix="it-ml"
    />
  )
}
