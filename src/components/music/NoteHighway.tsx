'use client'

import { useMemo } from 'react'
import type { ScheduleStep, Hand } from '@/lib/music/scorePlayback'
import { wholeNoteSeconds, midiToSolfege } from '@/lib/music/scorePlayback'
import { KEYBOARD_LAYOUT, keyForMidi } from '@/lib/music/keyboardLayout'

const DEFAULT_HEIGHT = 170
const PIXELS_PER_SECOND = 130 // tốc độ rơi cố định theo giây thật — đổi tempo chỉ đổi khoảng cách giữa các nốt, không đổi tốc độ rơi
const LOOKAHEAD_EXTRA_SECONDS = 0.3 // nhìn trước thêm 0.3s để nốt không "hiện đột ngột" ngay sát mép trên
const MIN_NOTE_HEIGHT = 12

interface FlatNote {
  midi: number
  atWhole: number
  durWhole: number
  hand: Hand
}

interface Props {
  schedule: ScheduleStep[]
  elapsedWhole: number // vị trí đang phát, tính theo nốt tròn — cùng đơn vị/đồng hồ với ScorePlayer
  bpm: number
  height?: number // chiều cao vùng nốt rơi (px) — thu thấp lại ở chế độ toàn màn hình để nhường chỗ cho bản nhạc
}

// "Đường nốt rơi" kiểu Synthesia: khối nốt trôi từ trên xuống, chạm đúng cột phím của nó (vẽ trong
// PianoKeyboard, ngay bên dưới, cùng 1 container cuộn ngang — xem PianoKeyboard.tsx) đúng lúc cần chơi,
// để biết trước sắp tới nốt nào mà không phải đọc khuông nhạc. Tốc độ rơi tính bằng giây thật (không
// theo BPM) nên đổi tempo không làm nốt rơi nhanh/chậm bất thường, chỉ đổi khoảng cách giữa các nốt.
export function NoteHighway({ schedule, elapsedWhole, bpm, height: highwayHeight = DEFAULT_HEIGHT }: Props) {
  const lookaheadSeconds = highwayHeight / PIXELS_PER_SECOND + LOOKAHEAD_EXTRA_SECONDS
  // Chỉ làm phẳng lại khi đổi bài (schedule đổi tham chiếu) — không phải mỗi lần elapsedWhole nhích tới.
  const flatNotes = useMemo<FlatNote[]>(() => {
    const out: FlatNote[] = []
    for (const step of schedule) {
      for (const n of step.notes) out.push({ midi: n.midi, atWhole: step.atWhole, durWhole: n.durWhole, hand: n.hand })
    }
    return out
  }, [schedule])

  const wns = wholeNoteSeconds(bpm)

  const blocks = useMemo(() => {
    const result: { key: string; x: number; width: number; topY: number; height: number; label: string; hand: Hand }[] = []
    for (let i = 0; i < flatNotes.length; i++) {
      const n = flatNotes[i]
      const secStart = (n.atWhole - elapsedWhole) * wns
      const secEnd = (n.atWhole + n.durWhole - elapsedWhole) * wns
      if (secEnd <= 0 || secStart >= lookaheadSeconds) continue // đã chơi xong hẳn, hoặc còn quá xa chưa cần vẽ

      const key = keyForMidi(n.midi)
      if (!key) continue

      // Đáy khối = lúc nốt BẮT ĐẦU (kẹp ở đúng mép dưới khi đang kêu, secStart<=0). Đỉnh = lúc nốt KẾT
      // THÚC, nới lên đủ MIN_NOTE_HEIGHT cho nốt ngắn vẫn thấy được, rồi kẹp trong khung nhìn.
      const bottomY = highwayHeight - Math.max(secStart, 0) * PIXELS_PER_SECOND
      const rawTopY = Math.min(highwayHeight - secEnd * PIXELS_PER_SECOND, bottomY - MIN_NOTE_HEIGHT)
      const topY = Math.max(rawTopY, 0)
      const height = bottomY - topY
      if (height <= 0) continue

      result.push({
        // Chỉ atWhole+midi không đủ để làm key duy nhất — 2 bè có thể cùng đánh đúng 1 cao độ ở đúng 1
        // thời điểm (React từng cảnh báo trùng key ở trường hợp này), nên ghép thêm index trong
        // flatNotes (cố định theo thứ tự duyệt, không đổi giữa các lần render).
        key: `${n.atWhole}-${n.midi}-${i}`,
        x: key.x + 1,
        width: Math.max(key.width - 2, 2),
        topY,
        height,
        label: height >= 16 ? midiToSolfege(n.midi) : '',
        hand: n.hand,
      })
    }
    return result
  }, [flatNotes, elapsedWhole, wns, highwayHeight, lookaheadSeconds])

  return (
    <svg
      className="ms-highway-svg"
      width="100%"
      height={highwayHeight}
      viewBox={`0 0 ${KEYBOARD_LAYOUT.width} ${highwayHeight}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Xem trước các nốt sắp tới"
    >
      {blocks.map((b) => (
        <g key={b.key} className={`ms-highway-note ms-highway-note-${b.hand}`}>
          <rect x={b.x} y={b.topY} width={b.width} height={b.height} rx={3} />
          {b.label && (
            <text x={b.x + b.width / 2} y={b.topY + 11}>
              {b.label}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}
