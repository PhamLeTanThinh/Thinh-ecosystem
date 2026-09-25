import type { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'

export type Hand = 'right' | 'left'

export interface ScheduleNote {
  midi: number
  durWhole: number
  // Khuông Sol (staff 0) = tay phải, khuông Fa (staff 1) = tay trái — dùng để tô màu nốt rơi theo tay
  // (xem NoteHighway.tsx).
  hand: Hand
}

// Một "bước" của bản nhạc: mốc thời gian tính theo đơn vị nốt tròn (whole note) kể từ đầu bài —
// độc lập với tempo, để đổi BPM khi đang phát không cần build lại lịch phát.
export interface ScheduleStep {
  atWhole: number
  notes: ScheduleNote[]
}

const MAX_STEPS_GUARD = 50_000 // chặn vòng lặp vô hạn nếu iterator của OSMD có bug lạ

// Duyệt hết khuông nhạc bằng con trỏ (Cursor) của OSMD, ghi lại mọi vị trí dừng (kể cả dấu lặng)
// cùng các nốt vang lên tại đó. Giữ cả các bước rỗng (chỉ có lặng) để lúc phát, số lần gọi
// cursor.next() luôn khớp 1-1 với index trong mảng này — nhờ vậy con trỏ hiển thị không bao giờ lệch
// so với những gì đang phát.
export function buildPlaybackSchedule(osmd: OpenSheetMusicDisplay): ScheduleStep[] {
  const cursor = osmd.cursor
  if (!cursor) return []

  cursor.reset()
  const steps: ScheduleStep[] = []
  let guard = 0

  while (!cursor.iterator.EndReached && guard < MAX_STEPS_GUARD) {
    guard++
    const atWhole = cursor.iterator.currentTimeStamp.RealValue
    const notes: ScheduleStep['notes'] = []

    for (const note of cursor.NotesUnderCursor()) {
      if (note.isRest() || note.IsGraceNote) continue
      const tie = note.NoteTie
      if (tie && tie.StartNote !== note) continue // nốt nối dây (tie) tiếp theo — đã vang từ nốt trước, không đánh lại

      const pitch = note.Pitch
      if (!pitch) continue

      // KHÔNG dùng pitch.getHalfTone() trực tiếp: nốt build tay (constructor) và nốt đọc từ XML dùng 2
      // quy ước octave nội bộ khác nhau trong OSMD (getHalfTone() của nốt đọc từ XML lệch đúng 1 quãng 8
      // so với build tay — đã kiểm chứng bằng cách so sánh với pitch.Frequency, vốn luôn đúng Hz thật bất
      // kể quy ước octave). Quy ra MIDI qua tần số là cách duy nhất đúng cho cả 2 trường hợp.
      const midi = Math.round(69 + 12 * Math.log2(pitch.Frequency / 440))
      const durWhole = Math.max((tie ? tie.Duration.RealValue : note.Length.RealValue) || 0, 0.03)
      const hand: Hand = note.ParentStaff?.idInMusicSheet === 0 ? 'right' : 'left'
      notes.push({ midi, durWhole, hand })
    }

    steps.push({ atWhole, notes })
    cursor.next()
  }

  cursor.reset()
  return steps
}

// 1 nốt tròn kéo dài bao nhiêu giây ở một tempo (bpm) cho trước — quy ước bpm tính theo nốt đen
// (chuẩn phổ biến của MusicXML/metronome), nên 1 nốt tròn = 4 phách = 240/bpm giây.
export function wholeNoteSeconds(bpm: number): number {
  return 240 / bpm
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export function midiToNoteName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1
  return `${NOTE_NAMES[midi % 12]}${octave}`
}

// Tên nốt kiểu Việt (Đô Rê Mi...) theo cao độ MIDI — dùng để dán nhãn trên khối nốt rơi (NoteHighway),
// cùng bộ tên với injectSolfegeLyrics() (lib/music/noteNames.ts) nhưng tra theo pitch-class thay vì
// theo <step> của MusicXML, vì ở đây chỉ có sẵn số MIDI.
const SOLFEGE_BY_PITCH_CLASS = ['Đô', 'Đô#', 'Rê', 'Rê#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']

export function midiToSolfege(midi: number): string {
  return SOLFEGE_BY_PITCH_CLASS[((midi % 12) + 12) % 12]
}
