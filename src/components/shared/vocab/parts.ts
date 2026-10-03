// Cấu tạo từ (word breakdown) của thẻ từ vựng Korean/Chinese — lưu ở cột `parts` dạng JSON WordPart[].
// Dữ liệu soạn sẵn trong scripts/vocab-parts/<app>/L###.json, áp vào DB bằng scripts/apply-vocab-parts.mjs.
// Vd 신분증 = 신분 (身分, thân phận) + 증 (證, chứng: giấy chứng nhận); 身份证 = 身份 (shēnfèn) + 证 (zhèng).
export interface WordPart {
  p: string // thành phần, viết như trong từ (신분 / 身份)
  h?: string // chữ Hán của thành phần Hán Hàn (Korean) — vd 身分
  py?: string // pinyin của thành phần (Chinese)
  hv?: string // âm Hán Việt — vd 'thân phận'
  m: string // nghĩa của thành phần trong từ này
}

export function parseParts(json: string | undefined): WordPart[] | undefined {
  if (!json) return undefined
  try {
    const parts = JSON.parse(json) as WordPart[]
    return Array.isArray(parts) && parts.length > 1 ? parts : undefined
  } catch {
    return undefined
  }
}
