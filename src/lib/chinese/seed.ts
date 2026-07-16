import { nanoid } from 'nanoid'
import type { ChineseCard } from './types'

export function createDefaultCards(): ChineseCard[] {
  const words: [string, string, string][] = [
    ['你好', 'nǐ hǎo', 'Xin chào'],
    ['谢谢', 'xiè xiè', 'Cảm ơn'],
    ['再见', 'zài jiàn', 'Tạm biệt'],
    ['对不起', 'duì bù qǐ', 'Xin lỗi'],
    ['老师', 'lǎo shī', 'Giáo viên'],
    ['学生', 'xué shēng', 'Học sinh'],
    ['朋友', 'péng yǒu', 'Bạn bè'],
    ['家人', 'jiā rén', 'Người nhà'],
    ['吃饭', 'chī fàn', 'Ăn cơm'],
    ['喝水', 'hē shuǐ', 'Uống nước'],
    ['学习', 'xué xí', 'Học tập'],
    ['工作', 'gōng zuò', 'Công việc'],
    ['时间', 'shí jiān', 'Thời gian'],
    ['今天', 'jīn tiān', 'Hôm nay'],
    ['明天', 'míng tiān', 'Ngày mai'],
  ]

  const now = new Date().toISOString()
  return words.map(([hanzi, pinyin, meaning], index) => ({
    id: nanoid(),
    hanzi,
    pinyin,
    meaning,
    sortOrder: index,
    createdAt: now,
  }))
}
