import { ledgerSteps, staffStep, type Clef, type Note } from '@/lib/music/notes'

const LINE_GAP = 18 // khoảng cách giữa 2 dòng kẻ liền kề
const HALF_GAP = LINE_GAP / 2
const STAFF_WIDTH = 260
const NOTE_X = 148
const PAD_TOP = 88
const PAD_BOTTOM = 88

interface Props {
  clef: Clef
  note: Note
  tone?: 'default' | 'correct' | 'wrong'
}

// Khuông nhạc 5 dòng kẻ + khoá + 1 nốt duy nhất, vẽ hoàn toàn bằng SVG (không phụ thuộc font nhạc
// riêng ngoài 2 ký tự Unicode của khoá Sol/Fa — line kẻ, dòng kẻ phụ và nốt đều là hình học thuần).
export function MusicStaff({ clef, note, tone = 'default' }: Props) {
  const step = staffStep(note, clef)
  const bottomLineY = PAD_TOP + 4 * LINE_GAP
  const noteY = bottomLineY - step * HALF_GAP
  const height = PAD_TOP + 4 * LINE_GAP + PAD_BOTTOM
  const lineYs = [0, 1, 2, 3, 4].map((i) => bottomLineY - i * LINE_GAP)
  const ledgers = ledgerSteps(step)
  const stemUp = step < 4

  const noteColor = tone === 'correct' ? '#16a34a' : tone === 'wrong' ? '#dc2626' : '#141414'
  // Dấu hoá chỉ đổi cao độ, KHÔNG đổi vị trí trên khuông — vẽ ký hiệu #/b bên trái đầu nốt, cùng
  // hàng ngang với đầu nốt, giữ nguyên staffStep đã tính ở trên (xem ghi chú type Accidental).
  const accidentalSymbol = note.accidental === 'sharp' ? '♯' : note.accidental === 'flat' ? '♭' : ''

  return (
    <svg viewBox={`0 0 ${STAFF_WIDTH} ${height}`} width="100%" role="img" aria-label={`Khuông nhạc khoá ${clef === 'treble' ? 'Sol' : 'Fa'}`}>
      {lineYs.map((y) => (
        <line key={y} x1={20} y1={y} x2={STAFF_WIDTH - 20} y2={y} stroke="#141414" strokeWidth={1.4} />
      ))}

      <text
        x={30}
        y={clef === 'treble' ? bottomLineY + LINE_GAP * 0.35 : bottomLineY - LINE_GAP + LINE_GAP * 0.55}
        fontSize={clef === 'treble' ? LINE_GAP * 4.7 : LINE_GAP * 3.2}
        fontFamily="Georgia, 'Times New Roman', serif"
        fill="#141414"
      >
        {clef === 'treble' ? '\u{1D11E}' : '\u{1D122}'}
      </text>

      {ledgers.map((s) => (
        <line key={s} x1={NOTE_X - 15} y1={bottomLineY - s * HALF_GAP} x2={NOTE_X + 15} y2={bottomLineY - s * HALF_GAP} stroke="#141414" strokeWidth={1.4} />
      ))}

      {accidentalSymbol && (
        <text x={NOTE_X - 26} y={noteY + 7} fontSize={22} fontFamily="Georgia, 'Times New Roman', serif" fill={noteColor} textAnchor="middle">
          {accidentalSymbol}
        </text>
      )}

      <line
        x1={stemUp ? NOTE_X + 9.5 : NOTE_X - 9.5}
        y1={noteY}
        x2={stemUp ? NOTE_X + 9.5 : NOTE_X - 9.5}
        y2={stemUp ? noteY - 34 : noteY + 34}
        stroke={noteColor}
        strokeWidth={1.6}
      />
      <ellipse cx={NOTE_X} cy={noteY} rx={10} ry={7.4} fill={noteColor} transform={`rotate(-16 ${NOTE_X} ${noteY})`} />
    </svg>
  )
}
