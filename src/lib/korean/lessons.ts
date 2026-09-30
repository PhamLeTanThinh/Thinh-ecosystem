import { TOPIK1_LESSON_META } from './topik1'

// Bài học tiếng Hàn chia theo cấp độ TOPIK. `lesson` lưu trong KoreanCard.lesson là DUY NHẤT xuyên suốt mọi cấp độ:
//   - TOPIK II: 1-18 — "Seoul Korean 2" (Notion), danh sách cố định bên dưới.
//   - TOPIK I: 101-116 — "서울대 한국어 1A + 1B" (bài 1-16 trong sách), sinh tự động vào ./topik1.ts bởi
//     scripts/import-korean-lessons.mjs. Số hiển thị ("1과") lấy theo thứ tự trong cấp độ, xem lessonDisplayNumber.
export type TopikLevel = 'topik1' | 'topik2'

export interface LessonMeta {
  level: TopikLevel
  title: string
  titleVi?: string // bản dịch tiếng Việt của tên bài, hiện dưới tên Hangul
}

// TOPIK II — tiêu đề 18 bài lấy từ sổ tay "Seoul Korean 2" trên Notion.
const TOPIK2_LESSON_META: Record<number, LessonMeta> = {
  1: { level: 'topik2', title: '처음 뵙겠습니다', titleVi: 'Rất hân hạnh được gặp bạn' },
  2: { level: 'topik2', title: '취미가 뭐예요?', titleVi: 'Sở thích của bạn là gì?' },
  3: { level: 'topik2', title: '콘서트에 가 봤어요?', titleVi: 'Bạn đã từng đi xem concert chưa?' },
  4: { level: 'topik2', title: '옷이 좀 큰 것 같아요', titleVi: 'Hình như áo hơi rộng' },
  5: { level: 'topik2', title: '어디에 가면 좋을까요?', titleVi: 'Nên đi đâu thì hay nhỉ?' },
  6: { level: 'topik2', title: '비행기로 보내면 얼마예요?', titleVi: 'Gửi bằng máy bay thì bao nhiêu tiền?' },
  7: { level: 'topik2', title: '한옥마을이 어디에 있는지 아세요?', titleVi: 'Bạn có biết làng Hanok ở đâu không?' },
  8: { level: 'topik2', title: '정말 속상하겠어요', titleVi: 'Chắc bạn buồn lắm' },
  9: { level: 'topik2', title: '문의할 게 있는데요?', titleVi: 'Tôi có việc muốn hỏi' },
  10: { level: 'topik2', title: '뭐 먹을래?', titleVi: 'Ăn gì đây?' },
  11: { level: 'topik2', title: '운동을 좀 해 보는 게 어때요?', titleVi: 'Thử tập thể dục một chút thì sao?' },
  12: { level: 'topik2', title: '저는 좀 조용한 편이에요', titleVi: 'Tôi thuộc kiểu người khá trầm tính' },
  13: { level: 'topik2', title: '주변이 조용해서 살기 좋아요', titleVi: 'Xung quanh yên tĩnh nên sống rất thích' },
  14: { level: 'topik2', title: '여기서 사진을 찍어도 돼요?', titleVi: 'Ở đây chụp ảnh có được không?' },
  15: { level: 'topik2', title: '한국 생활에 익숙해졌어요', titleVi: 'Tôi đã quen với cuộc sống ở Hàn Quốc' },
  16: { level: 'topik2', title: '설날에는 밥 대신 떡국을 먹어요', titleVi: 'Ngày Tết ăn canh bánh gạo thay cho cơm' },
  17: { level: 'topik2', title: '비행기를 놓칠 뻔했어요', titleVi: 'Suýt nữa thì lỡ chuyến bay' },
  18: { level: 'topik2', title: '한국에 온 지 벌써 6개월이 되었어요', titleVi: 'Đến Hàn Quốc đã được 6 tháng rồi' },
}

export const LESSON_META: Record<number, LessonMeta> = { ...TOPIK1_LESSON_META, ...TOPIK2_LESSON_META }

export const LESSON_TITLES: Record<number, string> = Object.fromEntries(Object.entries(LESSON_META).map(([n, m]) => [n, m.title]))
export const LESSON_TITLES_VI: Record<number, string> = Object.fromEntries(Object.entries(LESSON_META).map(([n, m]) => [n, m.titleVi ?? '']))

export const LESSON_NUMBERS = Object.keys(LESSON_META).map(Number).sort((a, b) => a - b)

export function lessonNumbersForLevel(level: TopikLevel): number[] {
  return LESSON_NUMBERS.filter((n) => LESSON_META[n].level === level)
}

export function lessonLevel(lesson: number): TopikLevel | null {
  return LESSON_META[lesson]?.level ?? null
}

// Số bài HIỂN THỊ trong cấp độ của nó (TOPIK I lưu lesson 101-116 nhưng sách ghi 1과-16과).
export function lessonDisplayNumber(lesson: number): number {
  const level = lessonLevel(lesson)
  return level ? lessonNumbersForLevel(level).indexOf(lesson) + 1 : lesson
}

export const TOPIK_LABEL: Record<TopikLevel, string> = { topik1: 'TOPIK I', topik2: 'TOPIK II' }
