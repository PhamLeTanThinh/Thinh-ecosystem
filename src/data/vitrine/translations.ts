import type { LanguageCode, Translation } from '@/lib/vitrine/types'
import { parts } from './parts'

type WordSet = Record<LanguageCode, string>

// Từ vựng theo `part.name` — tách khỏi parts.ts vì translations là bảng riêng trong
// data model thật (part_id, language_code, word), giống schema Spring Boot sẽ dùng.
const WORDS: Record<string, WordSet> = {
  // sofa
  sofa: { vi: 'Ghế sofa', en: 'Sofa', ja: 'ソファー', ko: '소파' },
  backrest: { vi: 'Tựa lưng', en: 'Backrest', ja: '背もたれ', ko: '등받이' },
  armrest: { vi: 'Tay vịn', en: 'Armrest', ja: '肘掛け', ko: '팔걸이' },
  cushion: { vi: 'Đệm ngồi', en: 'Seat cushion', ja: '座面クッション', ko: '좌석 쿠션' },
  leg: { vi: 'Chân ghế', en: 'Leg', ja: '脚', ko: '다리' },

  // giường
  mattress: { vi: 'Nệm', en: 'Mattress', ja: 'マットレス', ko: '매트리스' },
  pillow: { vi: 'Gối', en: 'Pillow', ja: '枕', ko: '베개' },
  headboard: { vi: 'Đầu giường', en: 'Headboard', ja: 'ヘッドボード', ko: '헤드보드' },
  blanket: { vi: 'Chăn', en: 'Blanket', ja: '毛布', ko: '이불' },
  lamp: { vi: 'Đèn ngủ', en: 'Bedside lamp', ja: '読書灯', ko: '스탠드' },

  // phòng tắm
  basin: { vi: 'Bồn rửa', en: 'Sink', ja: '洗面台', ko: '세면대' },
  faucet: { vi: 'Vòi nước', en: 'Faucet', ja: '蛇口', ko: '수도꼭지' },
  mirror: { vi: 'Gương', en: 'Mirror', ja: '鏡', ko: '거울' },
  towel: { vi: 'Khăn', en: 'Towel', ja: 'タオル', ko: '수건' },

  // bếp
  stove: { vi: 'Bếp', en: 'Stove', ja: 'コンロ', ko: '가스레인지' },
  pot: { vi: 'Nồi', en: 'Pot', ja: '鍋', ko: '냄비' },
  knife: { vi: 'Dao', en: 'Knife', ja: '包丁', ko: '칼' },
  'cutting-board': { vi: 'Thớt', en: 'Cutting board', ja: 'まな板', ko: '도마' },

  // thể thao
  ball: { vi: 'Quả bóng', en: 'Ball', ja: 'ボール', ko: '공' },
  'racket-frame': { vi: 'Khung vợt', en: 'Racket frame', ja: 'ラケットフレーム', ko: '라켓 프레임' },
  'racket-strings': { vi: 'Lưới vợt', en: 'Strings', ja: 'ガット', ko: '스트링' },
  'racket-handle': { vi: 'Cán vợt', en: 'Handle', ja: 'グリップ', ko: '손잡이' },
  'shoe-toe': { vi: 'Mũi giày', en: 'Toe', ja: 'つま先', ko: '앞코' },
  'shoe-sole': { vi: 'Đế giày', en: 'Sole', ja: '靴底', ko: '밑창' },
  'shoe-laces': { vi: 'Dây giày', en: 'Laces', ja: '靴ひも', ko: '신발끈' },

  // mèo
  head: { vi: 'Đầu', en: 'Head', ja: '頭', ko: '머리' },
  ear: { vi: 'Tai', en: 'Ear', ja: '耳', ko: '귀' },
  tail: { vi: 'Đuôi', en: 'Tail', ja: '尻尾', ko: '꼬리' },
  paw: { vi: 'Chân', en: 'Paw', ja: '足', ko: '발' },
}

export const translations: Translation[] = parts.flatMap((part) => {
  const words = WORDS[part.name]
  return (Object.keys(words) as LanguageCode[]).map((languageCode) => ({
    id: `t-${part.id}-${languageCode}`,
    partId: part.id,
    languageCode,
    word: words[languageCode],
  }))
})
