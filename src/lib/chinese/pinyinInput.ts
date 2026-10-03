import type { TypingEngine } from '@/components/shared/typing/engine'

// Luyện gõ tiếng Trung = gõ pinyin không dấu như bộ gõ pinyin thật (中国 → "zhongguo"): chỉ chữ cái thường, liền nhau,
// ü gõ bằng phím v (女 → "nv"). Dấu thanh, dấu cách, dấu câu, dấu nháy (Xī'ān) đều bỏ.
const UMLAUT_U = new RegExp('u' + String.fromCharCode(0x308), 'gi') // ü sau khi NFD

export function pinyinTarget(pinyin: string): string {
  return pinyin
    .replace(/\[\d:([^\]]+)\]/g, '$1')
    .normalize('NFD')
    .replace(UMLAUT_U, 'v')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

export const ZH_TYPING: TypingEngine = {
  speechLang: 'zh-CN',
  inputLang: 'en',
  storageKey: 'cn-typing-settings',
  keyboardName: 'Bàn phím QWERTY',
  placeholder: 'Gõ pinyin không dấu, liền nhau (ü gõ bằng v) — vd 中国 → zhongguo',
  readingLabel: 'pinyin',
  keyRows: ROWS.map((r) => [...r].map((ch): [string, string, string] => [`Key${ch.toUpperCase()}`, ch, ch])),
  keyFor: (t) => (/^[a-z]$/.test(t) ? { code: `Key${t.toUpperCase()}`, shift: false } : undefined),
  keyToToken: (e) => (/^Key[A-Z]$/.test(e.code) ? e.code.slice(3).toLowerCase() : null),
  compose: (tokens) => tokens.join(''),
  toTokens: (target) => [...target],
}
