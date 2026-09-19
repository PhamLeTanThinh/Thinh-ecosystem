// Toán học vị trí nốt trên khuông nhạc — dùng chung cho MusicStaff (vẽ SVG) và trang luyện tập
// "Học nốt nhạc". Không phụ thuộc React nên có thể unit-test độc lập nếu cần sau này.

export type NoteLetter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type Clef = 'treble' | 'bass'

// Dấu hoá: thăng (♯) / giáng (♭) chỉ đổi CAO ĐỘ, KHÔNG đổi vị trí trên khuông — F♯ vẫn nằm đúng vị
// trí dòng/khe của nốt F tự nhiên, chỉ thêm ký hiệu # hoặc b vẽ bên trái đầu nốt (xem MusicStaff.tsx).
export type Accidental = 'natural' | 'sharp' | 'flat'

export interface Note {
  letter: NoteLetter
  octave: number
  accidental: Accidental
}

export const NOTE_LETTERS: NoteLetter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

// Tên gọi kiểu Việt Nam (Đô Rê Mi...) hiện kèm bên dưới chữ cái quốc tế trên nút chọn đáp án.
export const SOLFEGE: Record<NoteLetter, string> = {
  C: 'Đô',
  D: 'Rê',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
}

// Hậu tố tiếng Việt cho dấu hoá, ghép sau tên Đô-Rê-Mi (vd "Fa thăng", "Si giáng"). Rỗng cho nốt tự nhiên.
export const ACCIDENTAL_WORD: Record<Accidental, string> = {
  natural: '',
  sharp: 'thăng',
  flat: 'giáng',
}

// Ký hiệu ghi kèm chữ cái quốc tế (vd "F♯", "B♭"). Rỗng cho nốt tự nhiên.
export const ACCIDENTAL_SYMBOL: Record<Accidental, string> = {
  natural: '',
  sharp: '♯',
  flat: '♭',
}

// Nhãn đầy đủ hiện trên nút đáp án / câu phản hồi, vd "F♯ (Fa thăng)".
export function noteLabel(letter: NoteLetter, accidental: Accidental): string {
  const solfege = accidental === 'natural' ? SOLFEGE[letter] : `${SOLFEGE[letter]} ${ACCIDENTAL_WORD[accidental]}`
  return `${letter}${ACCIDENTAL_SYMBOL[accidental]} (${solfege})`
}

const LETTER_INDEX: Record<NoteLetter, number> = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 }

// Chỉ số tuyệt đối tăng dần đều theo cao độ (không phân biệt dòng/khe) — dùng để so sánh và tính
// khoảng cách giữa 2 nốt bất kỳ, kể cả khác quãng 8. Dấu hoá không ảnh hưởng tới vị trí trên khuông
// nên KHÔNG tham gia vào chỉ số này (xem ghi chú ở type Accidental).
function absoluteIndex(note: Pick<Note, 'letter' | 'octave'>): number {
  return LETTER_INDEX[note.letter] + note.octave * 7
}

function noteFromAbsoluteIndex(abs: number, accidental: Accidental): Note {
  const letterIndex = ((abs % 7) + 7) % 7
  const octave = Math.floor(abs / 7)
  return { letter: NOTE_LETTERS[letterIndex], octave, accidental }
}

// Nốt nằm trên dòng kẻ dưới cùng (bước 0) của mỗi khoá nhạc — mốc để tính staffStep.
const CLEF_BOTTOM_LINE: Record<Clef, Note> = {
  treble: { letter: 'E', octave: 4, accidental: 'natural' }, // khoá Sol (Treble) — tay phải
  bass: { letter: 'G', octave: 2, accidental: 'natural' }, // khoá Fa (Bass) — tay trái
}

// staffStep: 0 = dòng kẻ dưới cùng, mỗi bước = 1 bậc liền kề trên khuông (dòng kẻ và khe xen kẽ
// nhau — bước chẵn luôn là dòng kẻ, bước lẻ luôn là khe), số âm/dương lớn = càng xa khuông nhạc.
export function staffStep(note: Note, clef: Clef): number {
  return absoluteIndex(note) - absoluteIndex(CLEF_BOTTOM_LINE[clef])
}

// Danh sách các bước cần vẽ dòng kẻ phụ (ledger line) để tới được vị trí `step` — rỗng nếu nốt
// nằm trong phạm vi 5 dòng kẻ chính (0..8).
export function ledgerSteps(step: number): number[] {
  const steps: number[] = []
  if (step > 8) {
    const upper = step % 2 === 0 ? step : step - 1
    for (let s = 10; s <= upper; s += 2) steps.push(s)
  } else if (step < 0) {
    const lower = step % 2 === 0 ? step : step + 1
    for (let s = -2; s >= lower; s -= 2) steps.push(s)
  }
  return steps
}

// Phạm vi nốt để random khi luyện tập: từ 1 dòng kẻ phụ dưới khuông tới 2 dòng kẻ phụ trên khuông
// (15 nốt liên tiếp) — đủ rộng để luyện nhận biết cả nốt trong khuông lẫn nốt có dòng kẻ phụ. Luôn
// sinh dạng tự nhiên; dấu hoá được gắn thêm lúc random (randomNote), không thuộc phạm vi cố định này.
function buildRange(clef: Clef): Note[] {
  const bottomAbs = absoluteIndex(CLEF_BOTTOM_LINE[clef])
  const startAbs = bottomAbs - 2
  const notes: Note[] = []
  for (let abs = startAbs; abs <= startAbs + 14; abs++) {
    notes.push(noteFromAbsoluteIndex(abs, 'natural'))
  }
  return notes
}

export const NOTE_RANGES: Record<Clef, Note[]> = {
  treble: buildRange('treble'),
  bass: buildRange('bass'),
}

export function isSameNote(a: Note, b: Note): boolean {
  return a.letter === b.letter && a.octave === b.octave && a.accidental === b.accidental
}

const MIXED_ACCIDENTALS: Accidental[] = ['natural', 'sharp', 'flat']

// Chế độ dấu hoá của cả phiên luyện tập (không phải chọn riêng cho từng câu nữa):
// - 'off'   : luôn ra nốt tự nhiên (mặc định, giống trước khi có dấu hoá).
// - 'sharp' : luôn ra nốt thăng — nút đáp án tự hiện sẵn dấu ♯, không cần chọn thêm.
// - 'flat'  : luôn ra nốt giáng — nút đáp án tự hiện sẵn dấu ♭.
// - 'mixed' : trộn cả 3 loại, mỗi câu ra ngẫu nhiên 1 loại — đáp án liệt kê đủ cả 3 hàng
//             (tự nhiên/thăng/giáng) để bấm thẳng, không cần bước "chọn dấu hoá" riêng trước.
export type AccidentalMode = 'off' | 'sharp' | 'flat' | 'mixed'

// Các lựa chọn đáp án tương ứng với 1 chế độ — trang luyện tập dựng nút đáp án trực tiếp từ đây,
// không cần người học tự "gắn" dấu hoá vào câu trả lời trước khi bấm chữ cái nữa.
export function answerChoicesForMode(mode: AccidentalMode): { letter: NoteLetter; accidental: Accidental }[] {
  if (mode === 'mixed') {
    return MIXED_ACCIDENTALS.flatMap((accidental) => NOTE_LETTERS.map((letter) => ({ letter, accidental })))
  }
  const accidental: Accidental = mode === 'sharp' ? 'sharp' : mode === 'flat' ? 'flat' : 'natural'
  return NOTE_LETTERS.map((letter) => ({ letter, accidental }))
}

export interface RandomNoteOptions {
  exclude?: Note
  accidentalMode?: AccidentalMode
}

// Random nốt mới trong phạm vi luyện tập — tránh lặp lại đúng nốt vừa hỏi (nếu truyền `exclude`)
// để người học không "đoán mò" khi 2 câu liên tiếp giống hệt nhau.
export function randomNote(clef: Clef, options: RandomNoteOptions = {}): Note {
  const { exclude, accidentalMode = 'off' } = options
  const range = NOTE_RANGES[clef]

  function pick(): Note {
    const base = range[Math.floor(Math.random() * range.length)]
    const accidental =
      accidentalMode === 'mixed'
        ? MIXED_ACCIDENTALS[Math.floor(Math.random() * MIXED_ACCIDENTALS.length)]
        : accidentalMode === 'sharp'
          ? 'sharp'
          : accidentalMode === 'flat'
            ? 'flat'
            : 'natural'
    return { ...base, accidental }
  }

  let note = pick()
  if (exclude) {
    let guard = 0
    while (isSameNote(note, exclude) && guard < 10) {
      note = pick()
      guard++
    }
  }
  return note
}
