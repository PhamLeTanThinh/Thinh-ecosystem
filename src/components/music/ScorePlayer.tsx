'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { OpenSheetMusicDisplay, PointF2D } from 'opensheetmusicdisplay'
import type { Smplr } from 'smplr'
import { buildPlaybackSchedule, wholeNoteSeconds, type ScheduleStep, type Hand } from '@/lib/music/scorePlayback'
import { injectSolfegeLyrics } from '@/lib/music/noteNames'
import { PianoKeyboard } from './PianoKeyboard'

const DEFAULT_BPM = 100
const MIN_BPM = 40
const MAX_BPM = 200
const LOOKAHEAD_WHOLE_SECONDS = 0.35 // khoảng "nhìn trước" khi đưa nốt vào hàng đợi Web Audio
const TICK_MS = 50

interface Props {
  slug: string
  title: string
  musicxml: string
}

type Status = 'loading' | 'ready' | 'error'

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
export function ScorePlayer({ slug, title, musicxml }: Props) {
  const [status, setStatus] = useState<Status>('loading')
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(DEFAULT_BPM)
  // midi → tay đang bấm nốt đó — dùng Map (không phải Set) để phím đàn tô đúng màu theo tay (trái/phải),
  // khớp màu với khối nốt rơi tương ứng bên NoteHighway.
  const [activeMidi, setActiveMidi] = useState<ReadonlyMap<number, Hand>>(new Map())
  // Vị trí đang phát, tính theo nốt tròn từ đầu bài — cùng đơn vị với ScheduleStep.atWhole. Chỉ dùng để
  // vẽ NoteHighway (nốt rơi); cập nhật mỗi tick giống progress nhưng giữ riêng vì đơn vị khác (0..1 vs
  // nốt tròn) và NoteHighway cần giá trị "thô" này để tự tính toạ độ rơi theo giây thật.
  const [elapsedWhole, setElapsedWhole] = useState(0)
  const [progress, setProgress] = useState(0) // 0..1
  const [totalSeconds, setTotalSeconds] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null)
  const scheduleRef = useRef<ScheduleStep[]>([])
  const pianoRef = useRef<Smplr | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  // Constructor PointF2D lấy từ chính lần import động OSMD lúc setup — cần cho handleSheetClick (bấm
  // vào nốt để tua timeline) mà không phải import tĩnh cả gói OSMD ở đầu file (gói này đụng DOM/canvas
  // ngay lúc module chạy, import tĩnh sẽ vỡ SSR — xem cách setup() cũng dynamic import bên dưới).
  const PointF2DRef = useRef<typeof PointF2D | null>(null)

  const bpmRef = useRef(bpm)
  bpmRef.current = bpm

  // Trạng thái phát nhạc — cố tình để ngoài React state vì đổi mỗi ~50ms, không cần re-render theo.
  const playRef = useRef({
    nextIdx: 0,
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
        autoResize: true,
        // Tắt followCursor lúc dựng lịch phát bên dưới — nó tự cuộn khung theo mỗi lần cursor.next(),
        // mà buildPlaybackSchedule() gọi next() hàng trăm lần liền để duyệt hết bài, nên khung sẽ bị
        // cuộn tới tận cuối bài. Chỉ bật lại sau khi đã dựng xong và con trỏ đã reset về đầu.
        followCursor: false,
        drawTitle: false,
        drawSubtitle: false,
        drawComposer: false,
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
        cursorsOptions: [{ type: 0, color: '#16a34a', alpha: 0.25, follow: true }],
      })
      osmdRef.current = osmd

      try {
        const xmlText = await fetch(musicxml).then((r) => r.text())
        if (cancelled) return
        // Tự chèn tên nốt vào XML dưới dạng lyric trước khi đưa cho OSMD — xem ghi chú ở noteNames.ts.
        const xmlDoc = injectSolfegeLyrics(xmlText)
        await osmd.load(xmlDoc)
        if (cancelled) return
        osmd.render()

        const schedule = buildPlaybackSchedule(osmd)
        scheduleRef.current = schedule
        const lastWhole = schedule.length ? schedule[schedule.length - 1].atWhole : 0
        setTotalSeconds(lastWhole * wholeNoteSeconds(bpmRef.current))

        osmd.cursor.show() // con trỏ đang ở đầu bài (buildPlaybackSchedule đã reset) — hiện ra giờ mới đúng chỗ
        osmd.FollowCursor = true
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
      pianoRef.current = null
    }
    // setup() chỉ nên chạy lại khi đổi bài hát (musicxml) — các hàm helper dùng bên trong effect này
    // đều đọc/ghi qua ref nên cố tình không đưa vào dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicxml])

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

  // Tính lại đúng "đã phát tới đâu" (theo nốt tròn) từ đồng hồ thật, rồi đồng bộ con trỏ hiển thị bằng
  // cách chạy lại từ đầu — dùng chung cho Pause / đổi tempo / Stop, tránh lệch dần theo thời gian.
  function resyncAfterStop(): number {
    const p = playRef.current
    const elapsedWhole = p.offsetWhole + (performance.now() - p.wallStart) / 1000 / wholeNoteSeconds(bpmRef.current)
    const schedule = scheduleRef.current
    let idx = schedule.findIndex((s) => s.atWhole > elapsedWhole)
    if (idx === -1) idx = schedule.length

    const osmd = osmdRef.current
    if (osmd) {
      osmd.cursor.reset()
      for (let i = 0; i < idx; i++) osmd.cursor.next()
    }
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

      const osmd = osmdRef.current
      if (osmd) {
        const cursorTimer = setTimeout(() => osmd.cursor.next(), delaySeconds * 1000)
        p.timeouts.push(cursorTimer)
      }

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
    p.offsetWhole = 0
    osmdRef.current?.cursor.reset()
    setProgress(0)
    setElapsedWhole(0)
  }

  // Tua timeline tới mốc atWhole (đơn vị nốt tròn từ đầu bài) — dùng chung cho bấm vào nốt trên khuông
  // nhạc. Luôn dừng hẳn âm thanh/hẹn giờ đang chờ trước khi nhảy vị trí (tránh nốt cũ vang chồng lên nốt
  // mới), rồi nếu đang phát thì cho chạy tiếp ngay từ vị trí mới.
  function seekToWhole(atWhole: number) {
    const schedule = scheduleRef.current
    if (schedule.length === 0) return

    clearTimers()
    pianoRef.current?.stop()
    clearActiveNotes()

    let idx = schedule.findIndex((s) => s.atWhole >= atWhole - 1e-6)
    if (idx === -1) idx = schedule.length - 1

    const p = playRef.current
    p.nextIdx = idx
    p.offsetWhole = schedule[idx].atWhole

    const osmd = osmdRef.current
    if (osmd) {
      osmd.cursor.reset()
      for (let i = 0; i < idx; i++) osmd.cursor.next()
    }

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

    seekToWhole(gNote.sourceNote.getAbsoluteTimestamp().RealValue)
  }

  async function handlePlay() {
    if (status !== 'ready' || isPlaying) return

    if (!audioCtxRef.current) {
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      const { SplendidGrandPiano } = await import('smplr')
      const piano = SplendidGrandPiano(ctx)
      pianoRef.current = piano
      await piano.ready
    } else if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume()
    }

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

  const timeLabel = useMemo(() => {
    const elapsed = progress * totalSeconds
    return `${formatTime(elapsed)} / ${formatTime(totalSeconds)}`
  }, [progress, totalSeconds])

  return (
    <div className="ms-score-player">
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
          <div className="ms-score-progress-bar">
            <div className="ms-score-progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
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
      </div>

      <div className="ms-score-sheet-frame">
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

      <PianoKeyboard activeMidi={activeMidi} schedule={scheduleRef.current} elapsedWhole={elapsedWhole} bpm={bpm} />
    </div>
  )
}
