'use client'

import type { ScheduleStep, Hand } from '@/lib/music/scorePlayback'
import { KEYBOARD_LAYOUT } from '@/lib/music/keyboardLayout'
import { NoteHighway } from './NoteHighway'

interface Props {
  // midi → tay đang bấm nốt đó — tô màu phím theo tay (trùng màu với NoteHighway) thay vì 1 màu cố định.
  activeMidi: ReadonlyMap<number, Hand>
  // 3 props này chỉ để vẽ NoteHighway (nốt rơi) phía trên phím — xem NoteHighway.tsx. Đặt ở đây (không
  // phải component riêng ngoài) vì highway BẮT BUỘC dùng chung 1 container với phím đàn để 2 bên luôn
  // khớp cột dọc; tách ra ngoài sẽ phải tự đồng bộ vị trí, dễ lệch.
  schedule: ScheduleStep[]
  elapsedWhole: number
  bpm: number
  // Tổng chiều cao (px) cả vùng nốt rơi + phím đàn. Không truyền thì dùng cỡ mặc định (170 + 110). Ở chế độ
  // toàn màn hình, người dùng kéo thanh chia giữa bản nhạc và phần đàn để đổi số này (xem ScorePlayer).
  height?: number
}

// Phím đàn piano 88 phím mô phỏng, sáng lên đúng những nốt đang vang khi phát bản nhạc. SVG vẽ theo
// toạ độ cố định (KEYBOARD_LAYOUT, đơn vị "px thật" ở cỡ 26px/phím trắng) nhưng luôn stretch full
// width khung chứa qua width="100%" + preserveAspectRatio="none" — coi toạ độ layout như tỉ lệ tương
// đối giữa các phím chứ không phải kích thước hiển thị thật, nên không cần cuộn ngang.
export function PianoKeyboard({ activeMidi, schedule, elapsedWhole, bpm, height }: Props) {
  // Phím trắng chiếm ~40% tổng chiều cao (trong khoảng 60–150px), phần còn lại cho nốt rơi; phím đen = 62% phím trắng.
  const whiteH = height ? Math.round(Math.min(150, Math.max(60, height * 0.4))) : 110
  const blackH = Math.round(whiteH * 0.62)
  const highwayH = height ? Math.max(40, height - whiteH) : undefined
  return (
    <div className="ms-piano-scroll">
      <NoteHighway schedule={schedule} elapsedWhole={elapsedWhole} bpm={bpm} height={highwayH} />

      <svg
        className="ms-piano-svg"
        width="100%"
        height={whiteH}
        viewBox={`0 0 ${KEYBOARD_LAYOUT.width} ${whiteH}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="Phím đàn piano mô phỏng"
      >
        {KEYBOARD_LAYOUT.keys
          .filter((k) => !k.isBlack)
          .map((k) => (
            <rect
              key={k.midi}
              x={k.x}
              y={0}
              width={k.width}
              height={whiteH}
              rx={2}
              className={`ms-key ms-key-white${activeMidi.has(k.midi) ? ` ms-key-active-${activeMidi.get(k.midi)}` : ''}`}
            />
          ))}
        {KEYBOARD_LAYOUT.keys
          .filter((k) => k.isBlack)
          .map((k) => (
            <rect
              key={k.midi}
              x={k.x}
              y={0}
              width={k.width}
              height={blackH}
              rx={1.5}
              className={`ms-key ms-key-black${activeMidi.has(k.midi) ? ` ms-key-active-${activeMidi.get(k.midi)}` : ''}`}
            />
          ))}
      </svg>
    </div>
  )
}
