import { HSK3_LESSON_META } from './hsk3'

// Bài học tiếng Trung chia theo cấp độ HSK — CHỈ thêm bài vào đây khi đã có nội dung thật (xác nhận
// qua ảnh giáo trình), giống cách lib/korean/lessons.ts lấy từ "Seoul Korean 2". Chưa có bài nào
// thì KHÔNG tạo placeholder rỗng — tránh hiển thị bài học giả trong Sidebar.
// HSK 3 (cuốn "Tăng tốc", bài 26-50) sinh tự động vào ./hsk3.ts bởi scripts/import-chinese-lessons.mjs.
export type HskLevel = 'hsk12' | 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6'

export const HSK_LEVELS: { key: HskLevel; label: string }[] = [
  { key: 'hsk12', label: 'HSK 1+2' },
  { key: 'hsk3', label: 'HSK 3' },
  { key: 'hsk4', label: 'HSK 4' },
  { key: 'hsk5', label: 'HSK 5' },
  { key: 'hsk6', label: 'HSK 6' },
]

export interface LessonMeta {
  level: HskLevel
  title: string
  titleVi?: string // bản dịch tiếng Việt của tên bài, hiện dưới tên chữ Hán
}

// key = lesson number lưu trong ChineseCard.lesson (duy nhất xuyên suốt mọi cấp độ).
export const LESSON_META: Record<number, LessonMeta> = {
  1: { level: 'hsk12', title: '你叫什么名字？', titleVi: 'Bạn tên là gì?' },
  2: { level: 'hsk12', title: '你家都有什么人？', titleVi: 'Nhà bạn có những ai?' },
  3: { level: 'hsk12', title: '这是什么书？', titleVi: 'Đây là sách gì?' },
  4: { level: 'hsk12', title: '你会说汉语吗？', titleVi: 'Bạn biết nói tiếng Trung không?' },
  5: { level: 'hsk12', title: '今天是几月几号？', titleVi: 'Hôm nay là ngày mấy tháng mấy?' },
  6: { level: 'hsk12', title: '现在几点了？', titleVi: 'Bây giờ là mấy giờ rồi?' },
  7: { level: 'hsk12', title: '苹果多少钱一斤？', titleVi: 'Táo bao nhiêu tiền một cân?' },
  8: { level: 'hsk12', title: '今天的天气怎么样？', titleVi: 'Thời tiết hôm nay thế nào?' },
  9: { level: 'hsk12', title: '请问，医院在哪儿？', titleVi: 'Xin hỏi, bệnh viện ở đâu?' },
  10: { level: 'hsk12', title: '你在做什么呢？', titleVi: 'Bạn đang làm gì thế?' },
  11: { level: 'hsk12', title: '你们买了什么？', titleVi: 'Các bạn đã mua gì?' },
  12: { level: 'hsk12', title: '这几件衣服怎么样？', titleVi: 'Mấy bộ quần áo này thế nào?' },
  13: { level: 'hsk12', title: '再来两份炒米饭', titleVi: 'Cho thêm hai suất cơm rang' },
  14: { level: 'hsk12', title: '还有二十分钟就上课了', titleVi: 'Còn hai mươi phút nữa là vào học rồi' },
  15: { level: 'hsk12', title: '她比我们小五岁', titleVi: 'Cô ấy kém chúng tôi năm tuổi' },
  16: { level: 'hsk12', title: '我在找房子', titleVi: 'Tôi đang tìm nhà' },
  17: { level: 'hsk12', title: '今天早上就换好了', titleVi: 'Sáng nay đã đổi xong rồi' },
  18: { level: 'hsk12', title: '我紧张地骑着自行车去他家', titleVi: 'Tôi hồi hộp đạp xe đến nhà anh ấy' },
  19: { level: 'hsk12', title: '你去过中国吗？', titleVi: 'Bạn đã từng đến Trung Quốc chưa?' },
  20: { level: 'hsk12', title: '都九点了，怎么还没来上课？', titleVi: 'Đã chín giờ rồi, sao vẫn chưa đến lớp?' },
  21: { level: 'hsk12', title: '我要买两张去广州的票', titleVi: 'Tôi muốn mua hai vé đi Quảng Châu' },
  22: { level: 'hsk12', title: '一间单人房三百块一天', titleVi: 'Một phòng đơn ba trăm tệ một ngày' },
  23: { level: 'hsk12', title: '年轻人得多运动运动', titleVi: 'Người trẻ phải vận động nhiều vào' },
  24: { level: 'hsk12', title: '她工作又认真又热情', titleVi: 'Cô ấy làm việc vừa chăm chỉ vừa nhiệt tình' },
  25: { level: 'hsk12', title: '时间过得真快', titleVi: 'Thời gian trôi thật nhanh' },
  ...HSK3_LESSON_META,
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

// Số bài HIỂN THỊ trong cấp độ của nó (HSK 3 lưu lesson 26-50 nhưng giáo trình ghi Bài 1-25).
export function lessonDisplayNumber(lesson: number): number {
  const meta = LESSON_META[lesson]
  return meta ? lessonNumbersForLevel(meta.level).indexOf(lesson) + 1 : lesson
}

export function lessonTitleVi(lesson: number): string {
  return LESSON_META[lesson]?.titleVi ?? ''
}

export function levelLabel(lesson: number): string {
  if (lesson === UNSORTED_LESSON) return LESSON_TITLES[UNSORTED_LESSON]
  const meta = LESSON_META[lesson]
  return meta ? HSK_LEVELS.find((l) => l.key === meta.level)?.label ?? '' : ''
}
