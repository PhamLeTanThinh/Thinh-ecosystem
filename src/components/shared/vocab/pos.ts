// Từ loại (word form) của thẻ từ vựng Korean/Chinese — lưu ở cột `pos` dạng mã cách nhau dấu phẩy ("v,n").
// Dữ liệu do scripts/apply-vocab-pos.mjs tính (quy tắc + scripts/vocab-examples/<app>/pos.json).
export const POS_LABELS: Record<string, string> = {
  n: 'danh từ',
  v: 'động từ',
  adj: 'tính từ',
  adv: 'phó từ',
  pron: 'đại từ',
  num: 'số từ',
  mw: 'lượng từ',
  det: 'định từ',
  conj: 'liên từ',
  prep: 'giới từ',
  part: 'trợ từ',
  interj: 'thán từ',
  phrase: 'cụm từ',
  struct: 'cấu trúc',
  idiom: 'thành ngữ',
  expr: 'câu giao tiếp',
  morph: 'từ tố Hán',
}

export function parsePos(pos: string | undefined): string[] {
  return (pos ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p in POS_LABELS)
}
