// Toạ độ 88 phím đàn (A0 → C8) — dùng chung giữa PianoKeyboard (vẽ phím) và NoteHighway (nốt rơi phía
// trên), để nốt rơi luôn rơi TRÚNG cột phím tương ứng. Tách riêng file này để 2 component không tự tính
// 2 lần ra 2 kết quả lệch nhau.
export const MIN_MIDI = 21 // A0
export const MAX_MIDI = 108 // C8
export const WHITE_KEY_W = 26
export const BLACK_KEY_W = 16
const WHITE_PITCH_CLASSES = new Set([0, 2, 4, 5, 7, 9, 11])

export interface PianoKey {
  midi: number
  isBlack: boolean
  x: number
  width: number
}

// Phím trắng xếp liên tiếp theo whiteIndex, phím đen chèn giữa — công thức "x = whiteIndex*W - đen/2"
// đặt mỗi phím đen đúng vào ranh giới bên phải phím trắng liền trước, xấp xỉ rất sát cách bố trí phím
// đàn thật mà không cần bảng lệch riêng cho từng nhóm 2/3 phím đen.
function buildKeyboardLayout(): { keys: PianoKey[]; width: number } {
  const keys: PianoKey[] = []
  let whiteIndex = 0
  for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi++) {
    const pc = midi % 12
    if (WHITE_PITCH_CLASSES.has(pc)) {
      keys.push({ midi, isBlack: false, x: whiteIndex * WHITE_KEY_W, width: WHITE_KEY_W })
      whiteIndex++
    } else {
      keys.push({ midi, isBlack: true, x: whiteIndex * WHITE_KEY_W - BLACK_KEY_W / 2, width: BLACK_KEY_W })
    }
  }
  return { keys, width: whiteIndex * WHITE_KEY_W }
}

export const KEYBOARD_LAYOUT = buildKeyboardLayout()

const KEY_BY_MIDI = new Map(KEYBOARD_LAYOUT.keys.map((k) => [k.midi, k]))

export function keyForMidi(midi: number): PianoKey | undefined {
  return KEY_BY_MIDI.get(midi)
}
