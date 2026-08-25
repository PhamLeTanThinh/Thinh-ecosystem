// Tiêu đề 18 bài — lấy từ sổ tay "Seoul Korean 2" trên Notion. Đây là danh sách bài cố định
// của giáo trình, không lưu trong DB như card/progress/settings.
export const LESSON_TITLES: Record<number, string> = {
  1: '처음 뵙겠습니다',
  2: '취미가 뭐예요?',
  3: '콘서트에 가 봤어요?',
  4: '옷이 좀 큰 것 같아요',
  5: '어디에 가면 좋을까요?',
  6: '비행기로 보내면 얼마예요?',
  7: '한옥마을이 어디에 있는지 아세요?',
  8: '정말 속상하겠어요',
  9: '문의할 게 있는데요?',
  10: '뭐 먹을래?',
  11: '운동을 좀 해 보는 게 어때요?',
  12: '저는 좀 조용한 편이에요',
  13: '주변이 조용해서 살기 좋아요',
  14: '여기서 사진을 찍어도 돼요?',
  15: '한국 생활에 익숙해졌어요',
  16: '설날에는 밥 대신 떡국을 먹어요',
  17: '비행기를 놓칠 뻔했어요',
  18: '한국에 온 지 벌써 6개월이 되었어요',
}

export const LESSON_NUMBERS = Object.keys(LESSON_TITLES).map(Number).sort((a, b) => a - b)
