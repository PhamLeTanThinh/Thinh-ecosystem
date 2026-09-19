// Bài học tiếng Trung chia theo cấp độ HSK — CHỈ thêm bài vào đây khi đã có nội dung thật (xác nhận
// qua ảnh giáo trình), giống cách lib/korean/lessons.ts lấy từ "Seoul Korean 2". Chưa có bài nào
// thì KHÔNG tạo placeholder rỗng — tránh hiển thị bài học giả trong Sidebar.
export type HskLevel = 'hsk12' | 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6'

export const HSK_LEVELS: { key: HskLevel; label: string }[] = [
  { key: 'hsk12', label: 'HSK 1+2' },
  { key: 'hsk3', label: 'HSK 3' },
  { key: 'hsk4', label: 'HSK 4' },
  { key: 'hsk5', label: 'HSK 5' },
  { key: 'hsk6', label: 'HSK 6' },
]

interface LessonMeta {
  level: HskLevel
  title: string
}

// key = lesson number lưu trong ChineseCard.lesson (duy nhất xuyên suốt mọi cấp độ).
export const LESSON_META: Record<number, LessonMeta> = {
  1: { level: 'hsk12', title: '你叫什么名字？' },
}

// Thẻ chưa được gán vào bài nào (vd: dữ liệu cũ trước khi có khái niệm "bài học") nằm ở đây,
// tách biệt hẳn khỏi các bài học thật để không lẫn vào nội dung Bài 1/2/3... — không thuộc
// LESSON_META/HSK_LEVELS nên không hiện trong các nhóm HSK ở Sidebar.
export const UNSORTED_LESSON = 0

export const LESSON_TITLES: Record<number, string> = {
  [UNSORTED_LESSON]: 'Chưa phân loại',
  ...Object.fromEntries(Object.entries(LESSON_META).map(([n, m]) => [n, m.title])),
}

export const LESSON_NUMBERS = Object.keys(LESSON_META).map(Number).sort((a, b) => a - b)

export function lessonNumbersForLevel(level: HskLevel): number[] {
  return LESSON_NUMBERS.filter((n) => LESSON_META[n].level === level)
}

export function levelLabel(lesson: number): string {
  if (lesson === UNSORTED_LESSON) return LESSON_TITLES[UNSORTED_LESSON]
  const meta = LESSON_META[lesson]
  return meta ? HSK_LEVELS.find((l) => l.key === meta.level)?.label ?? '' : ''
}
