'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { OpenSheetMusicDisplay, PointF2D } from 'opensheetmusicdisplay'
import type { Smplr } from 'smplr'
import { buildPlaybackSchedule, wholeNoteSeconds, DEFAULT_BPM, type ScheduleStep, type Hand } from '@/lib/music/scorePlayback'
import { injectSolfegeLyrics } from '@/lib/music/noteNames'
import { closeDanglingOctaveShifts } from '@/lib/music/fixOmr'
import { PianoKeyboard } from './PianoKeyboard'

const MIN_BPM = 40
const MAX_BPM = 200
const LOOKAHEAD_WHOLE_SECONDS = 0.35 // khoảng "nhìn trước" khi đưa nốt vào hàng đợi Web Audio
const TICK_MS = 50

interface Props {
  slug: string
  title: string
  musicxml: string
  defaultBpm?: number
}

type Status = 'loading' | 'ready' | 'error'

const OSMD_UNIT_PX = 10 // 1 đơn vị toạ độ nội bộ OSMD = 10px ở Zoom = 1
const MIN_ZOOM = 0.5
// Chiều cao phần đàn (nốt rơi + phím) ở chế độ toàn màn hình — kéo thanh chia để đổi, nhớ lại giữa các lần mở.
const PIANO_H_DEFAULT = 190
const PIANO_H_MIN = 110
const PIANO_H_STORAGE_KEY = 'ms-piano-height'
// Người xem tự cuộn bản nhạc (lăn chuột, vuốt, kéo thanh cuộn...) → tạm ngừng tự cuộn theo con trỏ trong
// khoảng này (tính từ lần cuộn cuối), hết thì cuộn về đúng dòng đang phát.
const USER_SCROLL_HOLD_MS = 2000
const MAX_ZOOM = 1.15 // khung đủ cao (vd. toàn màn hình) thì cho phóng to hơn cỡ mặc định
const SYSTEM_TOP_EXTRA_UNITS = 4 // chừa phía trên khuông Sol cho ký hiệu 8va, nốt có dòng kẻ phụ...

interface SystemBox {
  contentTop: number // px trong .ms-score-sheet — mép trên cùng của cả dòng nhạc (gồm 8va, dòng kẻ phụ)
  staffTop: number // px — dòng kẻ trên cùng của khuông Sol (cũng là chỗ con trỏ OSMD bắt đầu)
  staffBottom: number // px — dòng kẻ dưới cùng của khuông Fa
  contentBottom: number // px — mép dưới cùng của cả dòng (gồm tên nốt Đô Rê Mi dưới khuông Fa)
}

// Toạ độ từng dòng nhạc (system = khuông Sol + khuông Fa đi cùng nhau) quy ra px theo zoom hiện tại.
function getSystemBoxes(osmd: OpenSheetMusicDisplay): SystemBox[] {
  const unit = OSMD_UNIT_PX * osmd.Zoom
  const boxes: SystemBox[] = []
  for (const page of osmd.GraphicSheet?.MusicPages ?? []) {
    for (const system of page.MusicSystems) {
      const ps = system.PositionAndShape
      const y = ps.AbsolutePosition.y
      const lines = system.StaffLines
      if (lines.length === 0) continue
      const firstY = lines[0].PositionAndShape.AbsolutePosition.y
      const lastY = lines[lines.length - 1].PositionAndShape.AbsolutePosition.y + 4 // khuông 5 dòng cao 4 đơn vị
      boxes.push({
        contentTop: (y + Math.min(ps.BorderMarginTop, firstY - y - SYSTEM_TOP_EXTRA_UNITS)) * unit,
        staffTop: firstY * unit,
        staffBottom: lastY * unit,
        contentBottom: (y + Math.max(ps.BorderMarginBottom, lastY - y + 2)) * unit,
      })
    }
  }
  return boxes
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Bản nhạc tương tác: OSMD vẽ khuông nhạc + con trỏ chạy theo nốt, smplr phát âm thanh piano thật
// qua Web Audio, PianoKeyboard sáng phím tương ứng — 3 mảnh ghép thành 1 trải nghiệm kiểu MuseScore.
//
// Kiến trúc phát nhạc: buildPlaybackSchedule() duyệt 1 lần qua Cursor của OSMD, ghi lại mọi mốc dừng
// (kể cả dấu lặng) theo đơn vị "nốt tròn" — không phụ thuộc tempo. Lúc phát, 1 interval 50ms quy đổi
// mốc đó sang giây theo bpm hiện tại rồi đẩy nốt vào piano.start() (lịch của Web Audio, chính xác tới
// mẫu) và setTimeout (chỉ để đồng bộ hiển thị — con trỏ + phím đàn sáng, không cần chính xác tuyệt đối).
// Mỗi lần Pause/đổi tempo đều tính lại đúng vị trí đang phát rồi "đồng bộ lại" con trỏ bằng cách
// reset() + next() đúng số bước đã qua, nên không bao giờ lệch dần theo thời gian.
export function ScorePlayer({ slug, title, musicxml, defaultBpm = DEFAULT_BPM }: Props) {
  const [status, setStatus] = useState<Status>('loading')
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(defaultBpm)
  // midi → tay đang bấm nốt đó — dùng Map (không phải Set) để phím đàn tô đúng màu theo tay (trái/phải),
  // khớp màu với khối nốt rơi tương ứng bên NoteHighway.
  const [activeMidi, setActiveMidi] = useState<ReadonlyMap<number, Hand>>(new Map())
  // Vị trí đang phát, tính theo nốt tròn từ đầu bài — cùng đơn vị với ScheduleStep.atWhole. Chỉ dùng để
  // vẽ NoteHighway (nốt rơi); cập nhật mỗi tick giống progress nhưng giữ riêng vì đơn vị khác (0..1 vs
  // nốt tròn) và NoteHighway cần giá trị "thô" này để tự tính toạ độ rơi theo giây thật.
  const [elapsedWhole, setElapsedWhole] = useState(0)
  const [progress, setProgress] = useState(0) // 0..1
  const [totalSeconds, setTotalSeconds] = useState(0)
  // Đang kéo thanh tiến trình: giữ vị trí xem trước (0..1), chỉ thật sự tua khi thả chuột — tránh dừng/phát
  // lại âm thanh liên tục theo mỗi lần pointermove.
  const [dragFraction, setDragFraction] = useState<number | null>(null)
  // Chế độ toàn màn hình: chỉ giữ thanh điều khiển + bản nhạc + phím đàn, bản nhạc tự phóng to theo khung.
  const [isExpanded, setIsExpanded] = useState(false)
  const [pianoHeight, setPianoHeight] = useState(PIANO_H_DEFAULT)
  const splitDragRef = useRef<{ startY: number; startH: number } | null>(null)
  const userScrollUntilRef = useRef(0) // performance.now() tới lúc nào thì còn tạm ngừng tự cuộn (xem USER_SCROLL_HOLD_MS)
  const userScrollTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const playerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null)
  const scheduleRef = useRef<ScheduleStep[]>([])
  const pianoRef = useRef<Smplr | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const audioReadyRef = useRef<Promise<void> | null>(null)
  // Constructor PointF2D lấy từ chính lần import động OSMD lúc setup — cần cho handleSheetClick (bấm
  // vào nốt để tua timeline) mà không phải import tĩnh cả gói OSMD ở đầu file (gói này đụng DOM/canvas
  // ngay lúc module chạy, import tĩnh sẽ vỡ SSR — xem cách setup() cũng dynamic import bên dưới).
  const PointF2DRef = useRef<typeof PointF2D | null>(null)

  const bpmRef = useRef(bpm)
  bpmRef.current = bpm

  // Trạng thái phát nhạc — cố tình để ngoài React state vì đổi mỗi ~50ms, không cần re-render theo.
  const playRef = useRef({
    nextIdx: 0,
    cursorIdx: 0, // con trỏ OSMD đang đứng ở bước nào của schedule (khớp 1-1 với số lần cursor.next())
    offsetWhole: 0, // vị trí đã phát tới, tính theo nốt tròn, tại thời điểm wallStart
    wallStart: 0, // performance.now() lúc bắt đầu tính offsetWhole
    intervalId: 0 as ReturnType<typeof setInterval> | 0,
    timeouts: [] as ReturnType<typeof setTimeout>[],
  })

  useEffect(() => {
    let cancelled = false

    async function setup() {
      const { OpenSheetMusicDisplay, PointF2D } = await import('opensheetmusicdisplay')
      PointF2DRef.current = PointF2D
      if (cancelled || !containerRef.current) return

      const osmd = new OpenSheetMusicDisplay(containerRef.current, {
        backend: 'svg',
        // Tự xử lý đổi kích thước (ResizeObserver trên khung, xem relayout()) thay vì autoResize của OSMD
        // — cần tính lại zoom cho vừa khung và đặt lại con trỏ đúng chỗ sau mỗi lần vẽ lại (vd. khi bật/tắt
        // toàn màn hình), autoResize chỉ vẽ lại với zoom cũ.
        autoResize: false,
        // Tắt followCursor lúc dựng lịch phát bên dưới — nó tự cuộn khung theo mỗi lần cursor.next(),
        // mà buildPlaybackSchedule() gọi next() hàng trăm lần liền để duyệt hết bài, nên khung sẽ bị
        // cuộn tới tận cuối bài. Chỉ bật lại sau khi đã dựng xong và con trỏ đã reset về đầu.
        followCursor: false,
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
        drawLyricist: false, // vd. The Beginning ghi tên tác giả vào ô "lyricist" — trang bài hát đã hiện sẵn
        drawCredits: false,
        drawPartNames: false,
        drawLyrics: true, // hiện tên nốt (Đô Rê Mi...) — xem injectSolfegeLyrics
        // File MusicXML dựng từ Audiveris (OMR) nhét sẵn rất nhiều <print><system-layout> theo đúng
        // khổ trang PDF gốc — bỏ qua, để OSMD tự ngắt dòng theo đúng độ rộng khung hiện có thay vì cố
        // theo layout tính cho khổ giấy PDF gốc (không liên quan tới khung hiện có).
        newSystemFromXML: false,
        newPageFromXML: false,
        defaultColorMusic: '#141414',
        // Cursor mặc định của OSMD tự tính sai chiều cao (ra ~1px, gần như vô hình) với bản nhạc 2
        // khuông (grand staff) — top/left thì đúng, chỉ height bị lỗi, có vẻ là bug nội bộ khi tìm
        // "reliable cursor anchor" cho hệ 2 khuông ở bản OSMD đang dùng. Không sửa được từ options nên
        // ép chiều cao lại bằng CSS (.ms-score-sheet img) — xem music.css. Ở đây chỉ chỉnh màu/độ mờ
        // cho dễ nhìn (xanh nhạt, trùng tông với phím đàn đang sáng).
        // follow: false — OSMD tự cuộn bằng scrollIntoView({block: 'center'}) căn giữa con trỏ, khung
        // thấp thì cắt mất khuông Fa (tay trái). Tự cuộn theo từng dòng nhạc thay thế, xem followCursor().
        cursorsOptions: [{ type: 0, color: '#16a34a', alpha: 0.25, follow: false }],
      })
      osmdRef.current = osmd

      try {
        const xmlText = await fetch(musicxml).then((r) => r.text())
        if (cancelled) return
        // Tự chèn tên nốt vào XML dưới dạng lyric trước khi đưa cho OSMD — xem ghi chú ở noteNames.ts.
        const xmlDoc = injectSolfegeLyrics(xmlText)
        closeDanglingOctaveShifts(xmlDoc)
        await osmd.load(xmlDoc)
        if (cancelled) return
        osmd.render()
        fitZoomToFrame(osmd)

        const schedule = buildPlaybackSchedule(osmd)
        scheduleRef.current = schedule
        playRef.current.cursorIdx = 0 // buildPlaybackSchedule() đã reset con trỏ về đầu
        const lastWhole = schedule.length ? schedule[schedule.length - 1].atWhole : 0
        setTotalSeconds(lastWhole * wholeNoteSeconds(bpmRef.current))

        osmd.cursor.show() // con trỏ đang ở đầu bài (buildPlaybackSchedule đã reset) — hiện ra giờ mới đúng chỗ
        updateCursorHeight(osmd)
        setStatus('ready')
      } catch (err) {
        console.error('[ScorePlayer] Không đọc được bản nhạc:', err)
        if (!cancelled) setStatus('error')
      }
    }

    setup()

    return () => {
      cancelled = true
      stopPlayback()
      osmdRef.current?.clear()
      osmdRef.current = null
      audioCtxRef.current?.close().catch(() => {})
      audioCtxRef.current = null
      audioReadyRef.current = null
      pianoRef.current = null
    }
    // setup() chỉ nên chạy lại khi đổi bài hát (musicxml) — các hàm helper dùng bên trong effect này
    // đều đọc/ghi qua ref nên cố tình không đưa vào dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicxml])

  // Khung bản nhạc đổi kích thước (đổi cỡ cửa sổ, bật/tắt toàn màn hình) → vẽ lại cho vừa khung mới.
  useEffect(() => {
    const frame = frameRef.current
    if (!frame || status !== 'ready') return
    let timer: ReturnType<typeof setTimeout> | undefined
    let last = { w: frame.clientWidth, h: frame.clientHeight }
    const observer = new ResizeObserver(() => {
      const size = { w: frame.clientWidth, h: frame.clientHeight }
      if (size.w === last.w && size.h === last.h) return
      last = size
      clearTimeout(timer)
      timer = setTimeout(relayout, 150)
    })
    observer.observe(frame)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
    // relayout() chỉ đọc/ghi qua ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // Đồng bộ isExpanded với trạng thái fullscreen thật của trình duyệt (vd. người dùng bấm Esc để thoát).
  useEffect(() => {
    const onChange = () => setIsExpanded(document.fullscreenElement === playerRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // Trình duyệt không hỗ trợ Fullscreen API (vd. Safari trên iPhone) → chỉ phủ kín cửa sổ bằng CSS; Esc để thoát.
  useEffect(() => {
    if (!isExpanded || document.fullscreenElement) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isExpanded])

  function clampPianoHeight(h: number) {
    // Luôn chừa cho bản nhạc ít nhất ~180px + thanh điều khiển.
    const max = Math.max(PIANO_H_MIN, window.innerHeight - 260)
    return Math.round(Math.min(max, Math.max(PIANO_H_MIN, h)))
  }

  function commitPianoHeight(h: number) {
    setPianoHeight(h)
    try {
      localStorage.setItem(PIANO_H_STORAGE_KEY, String(h))
    } catch {}
  }

  // Thanh chia giữa bản nhạc và phần đàn: kéo lên → phần đàn cao lên, kéo xuống → thấp lại. Bản nhạc tự co
  // giãn theo (ResizeObserver trên khung → relayout()).
  function handleSplitPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    splitDragRef.current = { startY: e.clientY, startH: pianoHeight }
  }

  function handleSplitPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const drag = splitDragRef.current
    if (!drag) return
    setPianoHeight(clampPianoHeight(drag.startH + (drag.startY - e.clientY)))
  }

  function handleSplitPointerUp() {
    if (!splitDragRef.current) return
    splitDragRef.current = null
    commitPianoHeight(pianoHeight)
  }

  function handleSplitKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowUp') commitPianoHeight(clampPianoHeight(pianoHeight + 20))
    else if (e.key === 'ArrowDown') commitPianoHeight(clampPianoHeight(pianoHeight - 20))
    else return
    e.preventDefault()
  }

  function toggleExpanded() {
    // Mở toàn màn hình → lấy lại chiều cao phần đàn đã kéo lần trước (tiện ích cho từng người xem, không có cũng không sao).
    if (!isExpanded) {
      try {
        const saved = Number(localStorage.getItem(PIANO_H_STORAGE_KEY))
        if (saved >= PIANO_H_MIN) setPianoHeight(clampPianoHeight(saved))
      } catch {}
    }
    const player = playerRef.current
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    } else if (!isExpanded && player?.requestFullscreen) {
      player.requestFullscreen().catch(() => setIsExpanded(true))
    } else {
      setIsExpanded((v) => !v)
    }
  }

  // Cập nhật lại tổng thời lượng hiển thị mỗi khi đổi tempo (không đụng tới lịch phát, chỉ đổi đơn vị quy đổi).
  useEffect(() => {
    const schedule = scheduleRef.current
    const lastWhole = schedule.length ? schedule[schedule.length - 1].atWhole : 0
    setTotalSeconds(lastWhole * wholeNoteSeconds(bpm))
  }, [bpm])

  function clearTimers() {
    const p = playRef.current
    if (p.intervalId) clearInterval(p.intervalId)
    p.intervalId = 0
    for (const t of p.timeouts) clearTimeout(t)
    p.timeouts = []
  }

  function clearActiveNotes() {
    setActiveMidi(new Map())
  }

  // Co/giãn bản nhạc sao cho 1 dòng nhạc (khuông Sol + khuông Fa + tên nốt) lọt trọn trong khung nhìn —
  // để lúc phát luôn thấy được cả 2 tay. Giới hạn trong [MIN_ZOOM, MAX_ZOOM].
  function fitZoomToFrame(osmd: OpenSheetMusicDisplay) {
    const frame = frameRef.current
    if (!frame) return
    const style = getComputedStyle(frame)
    const available = frame.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - 8
    // Lấy chiều cao dòng nhạc "điển hình" (phân vị 80%) thay vì dòng cao nhất — vài dòng có nốt kẻ phụ/8va
    // cao bất thường sẽ kéo cả bài nhỏ lại; các dòng đó chỉ bị khuất chút mép dưới (tên nốt tay trái).
    const heights = getSystemBoxes(osmd).map((b) => b.contentBottom - b.contentTop).sort((a, b) => a - b)
    const tallest = heights.length ? heights[Math.min(heights.length - 1, Math.floor(heights.length * 0.8))] : 0
    if (available <= 0 || tallest <= 0) return
    const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, (osmd.Zoom * available) / tallest))
    if (Math.abs(zoom - osmd.Zoom) < 0.02) return
    osmd.Zoom = zoom
    osmd.render()
  }

  // Vẽ lại bản nhạc từ cỡ mặc định rồi thu lại cho vừa khung hiện tại, xong đưa con trỏ về đúng bước
  // đang đứng (render() dựng lại con trỏ từ đầu bài nên phải tự next() lại).
  function relayout() {
    const osmd = osmdRef.current
    if (!osmd) return
    const p = playRef.current
    const idx = p.cursorIdx
    osmd.Zoom = 1
    osmd.render()
    fitZoomToFrame(osmd)
    osmd.cursor.reset()
    p.cursorIdx = 0
    osmd.cursor.show()
    updateCursorHeight(osmd)
    moveCursorTo(idx)
  }

  // Con trỏ cao đúng từ dòng kẻ trên khuông Sol tới dòng kẻ dưới khuông Fa (theo zoom hiện tại).
  function updateCursorHeight(osmd: OpenSheetMusicDisplay) {
    const box = getSystemBoxes(osmd)[0]
    if (box) containerRef.current?.style.setProperty('--ms-cursor-h', `${Math.round(box.staffBottom - box.staffTop)}px`)
  }

  // Cuộn khung để cả dòng nhạc chứa con trỏ hiện trọn (mép trên dòng sát mép trên khung) — thay cho
  // followCursor của OSMD (căn giữa con trỏ, cắt mất khuông Fa). Chỉ cuộn khi con trỏ sang dòng mới.
  function followCursor() {
    const osmd = osmdRef.current
    const frame = frameRef.current
    const sheet = containerRef.current
    const cursorEl = osmd?.cursor?.cursorElement
    if (!osmd || !frame || !sheet || !cursorEl) return
    const cursorTop = cursorEl.offsetTop
    const boxes = getSystemBoxes(osmd)
    if (boxes.length === 0) return
    let box = boxes[0]
    for (const b of boxes) if (Math.abs(b.staffTop - cursorTop) < Math.abs(box.staffTop - cursorTop)) box = b
    const target = Math.max(0, sheet.offsetTop + box.contentTop - 4)
    if (performance.now() < userScrollUntilRef.current) return // người xem đang tự cuộn xem chỗ khác
    if (Math.abs(frame.scrollTop - target) > 2) frame.scrollTo({ top: target, behavior: 'smooth' })
  }

  // Bắt các thao tác cuộn CỦA NGƯỜI XEM trên khung bản nhạc (không dùng sự kiện 'scroll' vì chính
  // followCursor() cũng gây ra nó). Mỗi lần cuộn gia hạn thêm USER_SCROLL_HOLD_MS; hết hạn mà đang phát thì
  // cuộn về dòng đang phát ngay, không đợi tới nốt kế tiếp (nốt ngân dài có thể lâu hơn 2s).
  useEffect(() => {
    const frame = frameRef.current
    if (!frame || status !== 'ready') return
    const hold = () => {
      userScrollUntilRef.current = performance.now() + USER_SCROLL_HOLD_MS
      clearTimeout(userScrollTimerRef.current)
      userScrollTimerRef.current = setTimeout(() => {
        userScrollUntilRef.current = 0
        if (playRef.current.intervalId || playRef.current.timeouts.length) followCursor()
      }, USER_SCROLL_HOLD_MS)
    }
    // Bấm thẳng vào khung (không phải vào bản nhạc bên trong) = kéo thanh cuộn.
    const onPointerDown = (e: PointerEvent) => {
      if (e.target === frame) hold()
    }
    const onKey = (e: KeyboardEvent) => {
      if (['PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' '].includes(e.key)) hold()
    }
    frame.addEventListener('wheel', hold, { passive: true })
    frame.addEventListener('touchmove', hold, { passive: true })
    frame.addEventListener('pointerdown', onPointerDown)
    frame.addEventListener('keydown', onKey)
    return () => {
      frame.removeEventListener('wheel', hold)
      frame.removeEventListener('touchmove', hold)
      frame.removeEventListener('pointerdown', onPointerDown)
      frame.removeEventListener('keydown', onKey)
      clearTimeout(userScrollTimerRef.current)
    }
  }, [status])

  // Đưa con trỏ OSMD tới đúng bước `idx` của schedule (con trỏ phải đứng TẠI nốt đang vang, không phải
  // nốt kế tiếp). Đi tiếp thì chỉ next() phần còn thiếu; lùi lại thì reset() rồi next() lại từ đầu.
  function moveCursorTo(idx: number) {
    const osmd = osmdRef.current
    const p = playRef.current
    if (!osmd) return
    if (idx < p.cursorIdx) {
      osmd.cursor.reset()
      p.cursorIdx = 0
    }
    while (p.cursorIdx < idx) {
      osmd.cursor.next()
      p.cursorIdx++
    }
    followCursor()
  }

  // Tính lại đúng "đã phát tới đâu" (theo nốt tròn) từ đồng hồ thật, rồi đồng bộ con trỏ hiển thị bằng
  // cách chạy lại từ đầu — dùng chung cho Pause / đổi tempo / Stop, tránh lệch dần theo thời gian.
  function resyncAfterStop(): number {
    const p = playRef.current
    const elapsedWhole = p.offsetWhole + (performance.now() - p.wallStart) / 1000 / wholeNoteSeconds(bpmRef.current)
    const schedule = scheduleRef.current
    let idx = schedule.findIndex((s) => s.atWhole > elapsedWhole)
    if (idx === -1) idx = schedule.length

    // idx là bước CHƯA phát — con trỏ dừng ở bước vừa phát (idx - 1), tức nốt đang vang lúc dừng.
    moveCursorTo(Math.max(0, idx - 1))
    p.nextIdx = idx
    p.offsetWhole = elapsedWhole
    setProgress(schedule.length ? Math.min(1, elapsedWhole / schedule[schedule.length - 1].atWhole) : 0)
    setElapsedWhole(elapsedWhole)
    return idx
  }

  function stopPlayback() {
    clearTimers()
    pianoRef.current?.stop()
    clearActiveNotes()
    setIsPlaying(false)
  }

  function schedulerTick() {
    const p = playRef.current
    const schedule = scheduleRef.current
    const piano = pianoRef.current
    const audioCtx = audioCtxRef.current
    if (!piano || !audioCtx) return

    const wns = wholeNoteSeconds(bpmRef.current)
    const elapsedWhole = p.offsetWhole + (performance.now() - p.wallStart) / 1000 / wns
    setProgress(schedule.length ? Math.min(1, elapsedWhole / schedule[schedule.length - 1].atWhole) : 0)
    setElapsedWhole(elapsedWhole)

    const lookaheadWhole = LOOKAHEAD_WHOLE_SECONDS / wns
    while (p.nextIdx < schedule.length && schedule[p.nextIdx].atWhole <= elapsedWhole + lookaheadWhole) {
      const step = schedule[p.nextIdx]
      const delaySeconds = Math.max(0, (step.atWhole - elapsedWhole) * wns)

      if (step.notes.length > 0) {
        for (const n of step.notes) {
          piano.start({ note: n.midi, time: audioCtx.currentTime + delaySeconds, duration: n.durWhole * wns })
        }
        const midis = step.notes.map((n) => n.midi)
        const onTimer = setTimeout(() => {
          // Gộp vào (không thay hẳn) map hiện có — nốt trước có thể ngân dài hơn và vẫn đang vang khi
          // bước này tới, không được tắt sáng phím của nó sớm.
          setActiveMidi((cur) => new Map([...cur, ...step.notes.map((n): [number, Hand] => [n.midi, n.hand])]))
        }, delaySeconds * 1000)
        const maxDur = Math.max(...step.notes.map((n) => n.durWhole)) * wns
        const offTimer = setTimeout(
          () => setActiveMidi((cur) => new Map([...cur].filter(([m]) => !midis.includes(m)))),
          (delaySeconds + maxDur) * 1000,
        )
        p.timeouts.push(onTimer, offTimer)
      }

      // Con trỏ nhảy TỚI bước này đúng lúc nó vang (trước đây gọi next() ở thời điểm này nên con trỏ
      // luôn đứng ở nốt kế tiếp — chạy trước nhạc 1 nốt).
      const stepIdx = p.nextIdx
      const cursorTimer = setTimeout(() => moveCursorTo(stepIdx), delaySeconds * 1000)
      p.timeouts.push(cursorTimer)

      p.nextIdx++
    }

    if (p.nextIdx >= schedule.length) {
      const lastStep = schedule[schedule.length - 1]
      const tailMs = lastStep ? Math.max(...lastStep.notes.map((n) => n.durWhole), 0.1) * wns * 1000 : 0
      const endTimer = setTimeout(() => {
        stopPlayback()
        resetToStart()
      }, tailMs + 60)
      playRef.current.timeouts.push(endTimer)
      clearInterval(p.intervalId)
      p.intervalId = 0
    }
  }

  function resetToStart() {
    const p = playRef.current
    p.nextIdx = 0
    p.cursorIdx = 0
    p.offsetWhole = 0
    osmdRef.current?.cursor.reset()
    followCursor()
    setProgress(0)
    setElapsedWhole(0)
  }

  // Tua timeline tới mốc atWhole (đơn vị nốt tròn từ đầu bài, đã tính các lần lặp) — dùng cho thanh tiến trình.
  function seekToWhole(atWhole: number) {
    const schedule = scheduleRef.current
    if (schedule.length === 0) return
    const idx = schedule.findIndex((s) => s.atWhole >= atWhole - 1e-6)
    seekToIndex(idx === -1 ? schedule.length - 1 : idx)
  }

  // Nhảy tới bước idx của lịch phát. Luôn dừng hẳn âm thanh/hẹn giờ đang chờ trước khi nhảy vị trí (tránh
  // nốt cũ vang chồng lên nốt mới), rồi nếu đang phát thì cho chạy tiếp ngay từ vị trí mới.
  function seekToIndex(idx: number) {
    const schedule = scheduleRef.current
    if (schedule.length === 0) return
    userScrollUntilRef.current = 0 // tua chủ động → cuộn ngay tới chỗ mới, bỏ tạm ngừng tự cuộn

    clearTimers()
    pianoRef.current?.stop()
    clearActiveNotes()

    const p = playRef.current
    p.nextIdx = idx
    p.offsetWhole = schedule[idx].atWhole
    moveCursorTo(idx)

    const lastWhole = schedule[schedule.length - 1].atWhole
    setProgress(lastWhole > 0 ? Math.min(1, p.offsetWhole / lastWhole) : 0)
    setElapsedWhole(p.offsetWhole)

    if (isPlaying) {
      p.wallStart = performance.now()
      p.intervalId = setInterval(schedulerTick, TICK_MS)
    }
  }

  // Bấm vào 1 nốt trên khuông nhạc → tua timeline tới đúng vị trí nốt đó. OSMD tự quy đổi toạ độ pixel
  // click (domToSvg → svgToOsmd) sang hệ toạ độ riêng của nó rồi tìm nốt gần nhất (GetNearestNote); từ
  // nốt đó đọc thẳng mốc thời gian tuyệt đối (Note.getAbsoluteTimestamp()) — không dùng
  // tryGetTimestampFromPosition() vì nó lỗi ("getAbsoluteTimestamp is not a function") với vài vị trí
  // click ở bản OSMD đang dùng.
  function handleSheetClick(e: React.MouseEvent<HTMLDivElement>) {
    const osmd = osmdRef.current
    const PointF2D = PointF2DRef.current
    if (!osmd || !PointF2D || status !== 'ready') return

    const graphicSheet = osmd.GraphicSheet
    const svgPoint = graphicSheet.domToSvg(new PointF2D(e.clientX, e.clientY))
    const osmdPoint = graphicSheet.svgToOsmd(svgPoint)
    const maxClickDist = new PointF2D(5, 5)
    const gNote = graphicSheet.GetNearestNote(osmdPoint, maxClickDist)
    if (!gNote?.sourceNote) return // bấm ra ngoài vùng có nốt (lề trang, khoảng trắng...) — bỏ qua

    // Mốc của nốt trên bản nhạc (chưa tính lặp) → bước ĐẦU TIÊN có cùng vị trí trên bản nhạc, tức lần chơi
    // đầu nếu nốt nằm trong đoạn lặp.
    const atSheet = gNote.sourceNote.getAbsoluteTimestamp().RealValue
    const idx = scheduleRef.current.findIndex((s) => s.atSheet >= atSheet - 1e-6)
    if (idx !== -1) seekToIndex(idx)
  }

  // Tua bằng thanh tiến trình ngang: quy vị trí 0..1 ra mốc nốt tròn rồi dùng chung seekToWhole().
  function seekToFraction(fraction: number) {
    const schedule = scheduleRef.current
    if (status !== 'ready' || schedule.length === 0) return
    const lastWhole = schedule[schedule.length - 1].atWhole
    seekToWhole(Math.min(1, Math.max(0, fraction)) * lastWhole)
  }

  function fractionFromPointer(e: React.PointerEvent<HTMLDivElement>): number {
    const rect = e.currentTarget.getBoundingClientRect()
    return rect.width > 0 ? Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) : 0
  }

  function handleSeekPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (status !== 'ready') return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragFraction(fractionFromPointer(e))
  }

  function handleSeekPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragFraction === null) return
    setDragFraction(fractionFromPointer(e))
  }

  function handleSeekPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (dragFraction === null) return
    const fraction = fractionFromPointer(e)
    setDragFraction(null)
    seekToFraction(fraction)
  }

  function handleSeekKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (totalSeconds <= 0) return
    const stepFraction = 5 / totalSeconds // ←/→ tua 5 giây
    if (e.key === 'ArrowLeft') seekToFraction(progress - stepFraction)
    else if (e.key === 'ArrowRight') seekToFraction(progress + stepFraction)
    else if (e.key === 'Home') seekToFraction(0)
    else return
    e.preventDefault()
  }

  // Khởi tạo AudioContext + tiếng piano lần đầu cần (phải từ 1 thao tác của người dùng — bấm Phát hoặc phím
  // ←/→). Giữ promise (audioReadyRef) để 2 lần gọi gần nhau không tải mẫu âm thanh 2 lần.
  async function ensureAudio() {
    if (!audioReadyRef.current) {
      audioReadyRef.current = (async () => {
        const ctx = new AudioContext()
        audioCtxRef.current = ctx
        const { SplendidGrandPiano } = await import('smplr')
        const piano = SplendidGrandPiano(ctx)
        await piano.ready
        pianoRef.current = piano
      })()
    }
    await audioReadyRef.current
    if (audioCtxRef.current?.state === 'suspended') await audioCtxRef.current.resume()
  }

  // Phím ←/→: con trỏ lùi/tiến đúng 1 nốt (bỏ qua các bước chỉ có dấu lặng). Đang phát thì nhảy tới đó và
  // phát tiếp; đang dừng thì đánh thử nốt đó + sáng phím đàn — để dò từng nốt khi tập.
  function stepByNote(direction: 1 | -1) {
    const schedule = scheduleRef.current
    if (status !== 'ready' || schedule.length === 0) return
    let idx = playRef.current.cursorIdx + direction
    while (idx >= 0 && idx < schedule.length && schedule[idx].notes.length === 0) idx += direction
    if (idx < 0 || idx >= schedule.length) return

    seekToIndex(idx)
    if (isPlaying) return

    const step = schedule[idx]
    setActiveMidi(new Map(step.notes.map((n): [number, Hand] => [n.midi, n.hand])))
    ensureAudio()
      .then(() => {
        const piano = pianoRef.current
        const wns = wholeNoteSeconds(bpmRef.current)
        // Chỉ ngân tối đa 1.5s để bấm liên tục không bị chồng tiếng quá nhiều.
        for (const n of step.notes) piano?.start({ note: n.midi, duration: Math.min(n.durWhole * wns, 1.5) })
      })
      .catch(() => {})
  }

  const stepByNoteRef = useRef(stepByNote)
  stepByNoteRef.current = stepByNote

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      // Đang gõ/chỉnh ô nhập, thanh trượt (Tempo, thanh tua có ←/→ riêng)... thì để yên cho phần tử đó.
      const t = e.target as HTMLElement | null
      if (t?.closest('input, textarea, select, [contenteditable="true"], [role="slider"]')) return
      e.preventDefault()
      stepByNoteRef.current(e.key === 'ArrowRight' ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  async function handlePlay() {
    if (status !== 'ready' || isPlaying) return

    await ensureAudio()

    // Nếu đã phát hết bài trước đó thì bắt đầu lại từ đầu.
    if (playRef.current.nextIdx >= scheduleRef.current.length) resetToStart()

    // Xoá phím sáng "đóng băng" từ lúc Pause trước đó (nếu có) — âm thanh của các nốt đó đã tắt hẳn khi
    // Pause rồi, phát tiếp thì tính lại từ nốt kế tiếp, không nối lại đúng chỗ nốt cũ đang ngân dở.
    clearActiveNotes()

    playRef.current.wallStart = performance.now()
    playRef.current.intervalId = setInterval(schedulerTick, TICK_MS)
    setIsPlaying(true)
  }

  function handlePause() {
    if (!isPlaying) return
    resyncAfterStop()
    clearTimers()
    pianoRef.current?.stop()
    // Cố tình KHÔNG clearActiveNotes() ở đây — giữ nguyên phím đang sáng lúc Pause như 1 khung hình
    // đóng băng, để biết đang dừng ở đúng chỗ nào. Âm thanh vẫn tắt hẳn (piano.stop() ở trên), chỉ hình
    // ảnh phím đàn là giữ lại; sẽ tự xoá khi bấm Phát tiếp (xem handlePlay) hoặc Về đầu.
    setIsPlaying(false)
  }

  function handleStop() {
    clearTimers()
    pianoRef.current?.stop()
    clearActiveNotes()
    setIsPlaying(false)
    resetToStart()
  }

  function handleBpmChange(next: number) {
    if (isPlaying) {
      resyncAfterStop()
      clearTimers()
      pianoRef.current?.stop()
      clearActiveNotes()
      setBpm(next)
      // resyncAfterStop() đã dùng bpm cũ để tính offsetWhole — bpm mới chỉ ảnh hưởng từ mốc này trở đi
      // (offsetWhole tính theo nốt tròn nên không phụ thuộc bpm), an toàn để đổi ngay sau đó.
      playRef.current.wallStart = performance.now()
      playRef.current.intervalId = setInterval(schedulerTick, TICK_MS)
    } else {
      setBpm(next)
    }
  }

  const shownProgress = dragFraction ?? progress

  const timeLabel = useMemo(() => {
    const elapsed = shownProgress * totalSeconds
    return `${formatTime(elapsed)} / ${formatTime(totalSeconds)}`
  }, [shownProgress, totalSeconds])

  return (
    <div ref={playerRef} className={`ms-score-player${isExpanded ? ' is-expanded' : ''}`}>
      <div className="ms-score-toolbar">
        <div className="ms-score-transport">
          {!isPlaying ? (
            <button type="button" className="ms-btn ms-btn-primary" onClick={handlePlay} disabled={status !== 'ready'}>
              ▶ Phát
            </button>
          ) : (
            <button type="button" className="ms-btn ms-btn-primary" onClick={handlePause}>
              ❚❚ Tạm dừng
            </button>
          )}
          <button type="button" className="ms-btn" onClick={handleStop} disabled={status !== 'ready'}>
            ⏹ Về đầu
          </button>
        </div>

        <div className="ms-score-progress">
          <div
            className={`ms-score-seek${dragFraction !== null ? ' is-dragging' : ''}`}
            role="slider"
            tabIndex={status === 'ready' ? 0 : -1}
            aria-label="Tua bài"
            aria-valuemin={0}
            aria-valuemax={Math.round(totalSeconds)}
            aria-valuenow={Math.round(shownProgress * totalSeconds)}
            aria-valuetext={timeLabel}
            aria-disabled={status !== 'ready'}
            onPointerDown={handleSeekPointerDown}
            onPointerMove={handleSeekPointerMove}
            onPointerUp={handleSeekPointerUp}
            onPointerCancel={() => setDragFraction(null)}
            onKeyDown={handleSeekKeyDown}
          >
            <div className="ms-score-progress-bar">
              <div className="ms-score-progress-fill" style={{ width: `${shownProgress * 100}%` }} />
            </div>
          </div>
          <span className="ms-score-time">{timeLabel}</span>
        </div>

        <label className="ms-score-tempo">
          Tempo {bpm} BPM
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            step={4}
            value={bpm}
            onChange={(e) => handleBpmChange(Number(e.target.value))}
          />
        </label>

        <button
          type="button"
          className="ms-btn ms-score-expand"
          onClick={toggleExpanded}
          aria-pressed={isExpanded}
          title={isExpanded ? 'Thoát toàn màn hình (Esc)' : 'Toàn màn hình'}
        >
          {isExpanded ? '⤡ Thu nhỏ' : '⤢ Toàn màn hình'}
        </button>
      </div>

      <div ref={frameRef} className="ms-score-sheet-frame">
        {status === 'loading' && <p className="ms-score-status">Đang đọc nốt nhạc từ bản nhạc…</p>}
        {status === 'error' && <p className="ms-score-status ms-score-status-error">Không đọc được bản nhạc này. Hãy thử xem bản PDF gốc.</p>}
        <div
          ref={containerRef}
          className="ms-score-sheet"
          aria-label={`Bản nhạc ${title} — bấm vào 1 nốt để tua tới đó`}
          data-slug={slug}
          onClick={handleSheetClick}
        />
      </div>

      {isExpanded && (
        <div
          className="ms-score-splitter"
          role="separator"
          aria-orientation="horizontal"
          aria-label="Kéo để đổi kích thước phần đàn"
          aria-valuemin={PIANO_H_MIN}
          aria-valuenow={pianoHeight}
          tabIndex={0}
          title="Kéo lên/xuống để đổi kích thước phần đàn"
          onPointerDown={handleSplitPointerDown}
          onPointerMove={handleSplitPointerMove}
          onPointerUp={handleSplitPointerUp}
          onPointerCancel={handleSplitPointerUp}
          onKeyDown={handleSplitKeyDown}
        />
      )}

      <PianoKeyboard
        activeMidi={activeMidi}
        schedule={scheduleRef.current}
        elapsedWhole={elapsedWhole}
        bpm={bpm}
        height={isExpanded ? pianoHeight : undefined}
      />
    </div>
  )
}
