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
  2: { level: 'hsk12', title: '你家都有什么人？' },
  3: { level: 'hsk12', title: '这是什么书？' },
  4: { level: 'hsk12', title: '你会说汉语吗？' },
  5: { level: 'hsk12', title: '今天是几月几号？' },
  6: { level: 'hsk12', title: '现在几点了？' },
  7: { level: 'hsk12', title: '苹果多少钱一斤？' },
  8: { level: 'hsk12', title: '今天的天气怎么样？' },
  9: { level: 'hsk12', title: '请问，医院在哪儿？' },
  10: { level: 'hsk12', title: '你在做什么呢？' },
  11: { level: 'hsk12', title: '你们买了什么？' },
  12: { level: 'hsk12', title: '这几件衣服怎么样？' },
  13: { level: 'hsk12', title: '再来两份炒米饭' },
  14: { level: 'hsk12', title: '还有二十分钟就上课了' },
  15: { level: 'hsk12', title: '她比我们小五岁' },
  16: { level: 'hsk12', title: '我在找房子' },
  17: { level: 'hsk12', title: '我的电脑坏了' },
  18: { level: 'hsk12', title: '我紧张地骑着自行车去他家' },
  19: { level: 'hsk12', title: '你去过中国吗？' },
  20: { level: 'hsk12', title: '你怎么了？' },
  21: { level: 'hsk12', title: '我要买两张去广州的票' },
  22: { level: 'hsk12', title: '你们有空房间吗？' },
  23: { level: 'hsk12', title: '年轻人得多运动运动' },
  24: { level: 'hsk12', title: '她工作又认真又热情' },
  25: { level: 'hsk12', title: '火车快要来了' },
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
