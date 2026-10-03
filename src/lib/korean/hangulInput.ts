import type { TypingEngine } from '@/components/shared/typing/engine'

// Bộ gõ Hangul 2-beolsik (두벌식) tích hợp cho màn luyện gõ — người học gõ trên bàn phím QWERTY bình thường (không cần
// bật bộ gõ tiếng Hàn của hệ điều hành): mỗi phím vật lý (KeyboardEvent.code) → 1 jamo, chuỗi jamo được ghép thành
// âm tiết theo đúng cách bộ gõ thật làm (phụ âm cuối nhảy sang âm tiết sau khi gõ nguyên âm, nguyên âm/phụ âm cuối kép…).
// "Token" = 1 lần nhấn phím: 1 jamo cơ bản (ㄲ ㅆ ㅒ… là 1 phím có Shift) hoặc 1 ký tự thường (dấu cách, số).

export const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
export const JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
export const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

const COMPOUND_V: Record<string, string> = { ㅗㅏ: 'ㅘ', ㅗㅐ: 'ㅙ', ㅗㅣ: 'ㅚ', ㅜㅓ: 'ㅝ', ㅜㅔ: 'ㅞ', ㅜㅣ: 'ㅟ', ㅡㅣ: 'ㅢ' }
const COMPOUND_T: Record<string, string> = { ㄱㅅ: 'ㄳ', ㄴㅈ: 'ㄵ', ㄴㅎ: 'ㄶ', ㄹㄱ: 'ㄺ', ㄹㅁ: 'ㄻ', ㄹㅂ: 'ㄼ', ㄹㅅ: 'ㄽ', ㄹㅌ: 'ㄾ', ㄹㅍ: 'ㄿ', ㄹㅎ: 'ㅀ', ㅂㅅ: 'ㅄ' }
const SPLIT: Record<string, string[]> = Object.fromEntries(
  [...Object.entries(COMPOUND_V), ...Object.entries(COMPOUND_T)].map(([parts, c]) => [c, [...parts]]),
)

// Bàn phím 2-beolsik: [mã phím, jamo thường, jamo khi giữ Shift]
export const KEY_ROWS: [string, string, string][][] = [
  [['KeyQ', 'ㅂ', 'ㅃ'], ['KeyW', 'ㅈ', 'ㅉ'], ['KeyE', 'ㄷ', 'ㄸ'], ['KeyR', 'ㄱ', 'ㄲ'], ['KeyT', 'ㅅ', 'ㅆ'], ['KeyY', 'ㅛ', 'ㅛ'], ['KeyU', 'ㅕ', 'ㅕ'], ['KeyI', 'ㅑ', 'ㅑ'], ['KeyO', 'ㅐ', 'ㅒ'], ['KeyP', 'ㅔ', 'ㅖ']],
  [['KeyA', 'ㅁ', 'ㅁ'], ['KeyS', 'ㄴ', 'ㄴ'], ['KeyD', 'ㅇ', 'ㅇ'], ['KeyF', 'ㄹ', 'ㄹ'], ['KeyG', 'ㅎ', 'ㅎ'], ['KeyH', 'ㅗ', 'ㅗ'], ['KeyJ', 'ㅓ', 'ㅓ'], ['KeyK', 'ㅏ', 'ㅏ'], ['KeyL', 'ㅣ', 'ㅣ']],
  [['KeyZ', 'ㅋ', 'ㅋ'], ['KeyX', 'ㅌ', 'ㅌ'], ['KeyC', 'ㅊ', 'ㅊ'], ['KeyV', 'ㅍ', 'ㅍ'], ['KeyB', 'ㅠ', 'ㅠ'], ['KeyN', 'ㅜ', 'ㅜ'], ['KeyM', 'ㅡ', 'ㅡ']],
]

// jamo → phím cần nhấn (shift = cần giữ Shift)
export const JAMO_KEY: Record<string, { code: string; shift: boolean }> = {}
for (const row of KEY_ROWS) {
  for (const [code, base, shifted] of row) {
    JAMO_KEY[base] ??= { code, shift: false }
    if (shifted !== base) JAMO_KEY[shifted] = { code, shift: true }
  }
}

const CODE_JAMO: Record<string, [string, string]> = Object.fromEntries(KEY_ROWS.flat().map(([code, b, s]) => [code, [b, s]]))

// Phím vật lý → token (null = phím không dùng để gõ)
export function keyToToken(e: { code: string; key: string; shiftKey: boolean }): string | null {
  const jamo = CODE_JAMO[e.code]
  if (jamo) return e.shiftKey ? jamo[1] : jamo[0]
  if (e.code === 'Space') return ' '
  if (e.key.length === 1 && !/[a-z]/i.test(e.key)) return e.key // số, dấu câu
  return null
}

const isVowel = (j: string) => JUNG.includes(j)
const isConsonant = (j: string) => CHO.includes(j) || j in COMPOUND_T

// Chuỗi token → văn bản đã ghép âm tiết (giống ô nhập của bộ gõ thật)
export function composeTokens(tokens: string[]): string {
  let out = ''
  let cho: string | null = null
  let jung: string | null = null
  let jong: string[] = []

  function flush() {
    if (cho && jung) {
      const t = jong.length === 2 ? COMPOUND_T[jong.join('')] : (jong[0] ?? '')
      out += String.fromCharCode(0xac00 + (CHO.indexOf(cho) * 21 + JUNG.indexOf(jung)) * 28 + JONG.indexOf(t))
    } else if (cho) {
      out += cho
    } else if (jung) {
      out += jung
    }
    cho = null
    jung = null
    jong = []
  }

  for (const tk of tokens) {
    if (isVowel(tk)) {
      if (cho && !jung) {
        jung = tk
      } else if (cho && jung && jong.length > 0) {
        // phụ âm cuối (hoặc nửa sau của phụ âm cuối kép) nhảy sang làm phụ âm đầu của âm tiết mới
        const moved = jong.pop()!
        flush()
        cho = moved
        jung = tk
      } else if (jung) {
        const comb: string | undefined = COMPOUND_V[jung + tk]
        if (comb) jung = comb
        else {
          flush()
          jung = tk
        }
      } else {
        jung = tk
      }
    } else if (isConsonant(tk)) {
      if (cho && jung) {
        if (jong.length === 0 && JONG.includes(tk)) jong = [tk]
        else if (jong.length === 1 && COMPOUND_T[jong[0] + tk]) jong = [jong[0], tk]
        else {
          flush()
          cho = tk
        }
      } else {
        flush()
        cho = tk
      }
    } else {
      flush()
      out += tk
    }
  }
  flush()
  return out
}

// Văn bản → chuỗi token (phím) cần gõ — để so tiến độ và gợi ý phím tiếp theo trên bàn phím ảo
export function textToTokens(text: string): string[] {
  const out: string[] = []
  for (const ch of text) {
    const code = ch.charCodeAt(0) - 0xac00
    if (code >= 0 && code < 11172) {
      const cho = CHO[Math.floor(code / 588)]
      const jung = JUNG[Math.floor((code % 588) / 28)]
      const jong = JONG[code % 28]
      out.push(cho, ...(SPLIT[jung] ?? [jung]))
      if (jong) out.push(...(SPLIT[jong] ?? [jong]))
    } else {
      out.push(...(SPLIT[ch] ?? [ch]))
    }
  }
  return out
}

// Câu/từ gốc → chuỗi cần gõ: bỏ dấu câu, bỏ phần thay thế trong [], lấy phương án đầu của "A / B",
// bỏ ngoặc tròn nhưng giữ chữ bên trong ("(만나서) 반가워요" → "만나서 반가워요", "(1인)분" → "1인분").
export function typingTarget(raw: string): string {
  return raw
    .replace(/\[\d:([^\]]+)\]/g, '$1') // mã tô ngữ pháp trong hội thoại
    .replace(/\[[^\]]*\]/g, '')
    .split(/\s+\/\s+|\//)[0]
    .replace(/[()]/g, '')
    .replace(/[.,!?~…"“”'‘’:;·]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Bộ gõ cho màn luyện gõ dùng chung (components/shared/typing)
export const KO_TYPING: TypingEngine = {
  speechLang: 'ko-KR',
  inputLang: 'ko',
  storageKey: 'kr-typing-settings',
  keyboardName: 'Bàn phím 2-beolsik',
  placeholder: 'Gõ bằng bàn phím (bộ gõ tiếng Hàn tích hợp — không cần đổi bộ gõ của máy)',
  keyRows: KEY_ROWS,
  keyFor: (t) => JAMO_KEY[t],
  keyToToken,
  compose: composeTokens,
  toTokens: textToTokens,
}
