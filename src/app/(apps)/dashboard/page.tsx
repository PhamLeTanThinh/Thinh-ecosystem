'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface Tool {
  href: string
  icon: string
  title: string
  description: string
  accent: string
}

const TOOLS: Tool[] = [
  { href: '/korean', icon: '한', title: 'Tiếng Hàn', description: 'Từ vựng & ngữ pháp theo 18 bài Seoul Korean 2 — flashcard, trắc nghiệm.', accent: '#ff4d6d' },
  { href: '/chinese', icon: '中', title: 'Tiếng Trung', description: 'Ôn từ vựng bằng flashcard, pinyin hiện cùng mặt Hán tự hoặc mặt tiếng Việt.', accent: '#ffb020' },
  { href: '/ielts', icon: 'EN', title: 'IELTS Hub', description: 'Kiến thức IELTS theo kỹ năng — Listening, Speaking, Reading, Writing, Từ vựng.', accent: '#22d3ee' },
  { href: '/vitrine', icon: '3D', title: 'Vitrine', description: 'Từ vựng đa ngôn ngữ (VI · EN · 日本語 · 한국어) qua không gian vật thể 3D.', accent: '#a78bfa' },
  { href: '/money', icon: '¥', title: 'Thu Chi', description: 'Theo dõi thu chi cá nhân theo ví, theo tháng.', accent: '#4ade80' },
  { href: '/habits', icon: '✓', title: 'Thói Quen', description: 'Theo dõi thói quen, streak và sức khoẻ mỗi ngày.', accent: '#60a5fa' },
  { href: '/notes', icon: '✎', title: 'Ghi Chú', description: 'Bảng ghi chú tự do, tự động nhóm theo tuần / tháng / năm.', accent: '#fb923c' },
]

// Vị trí xuất phát của từng icon trong cảnh bay-vào (act 3) — toạ độ lệch khỏi vị trí cuối
// cùng trong hàng, mỗi icon bay từ một hướng khác nhau cho có cảm giác "hội tụ".
const ICON_START = [
  { x: -260, y: -150, rot: -28 },
  { x: 240, y: -190, rot: 24 },
  { x: -340, y: 70, rot: 18 },
  { x: 320, y: 50, rot: -22 },
  { x: -200, y: 210, rot: 32 },
  { x: 180, y: 230, rot: -26 },
  { x: 0, y: -270, rot: 12 },
]

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

// Helper dùng chung: đọc % đã cuộn qua 1 track (0→1) bằng scroll listener + rAF, gọi `onUpdate`
// mỗi frame — dùng lại ở cả ToolScene lẫn từng ToolVisual (không setState, ghi thẳng vào ref/DOM).
function attachScrollProgress(track: HTMLElement, onUpdate: (p: number) => void) {
  let rafId = 0

  function update() {
    rafId = 0
    const rect = track.getBoundingClientRect()
    const total = track.offsetHeight - window.innerHeight
    const p = total > 0 ? clamp01(-rect.top / total) : 0
    onUpdate(p)
  }

  function onScroll() {
    if (!rafId) rafId = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()

  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
  }
}

export default function DashboardPage() {
  return (
    <div className="lq-root">
      {/* Filter "goo" — làm các giọt màu blur hoà vào nhau thành khối lỏng thay vì các vòng tròn rời rạc.
          Dùng chung cho cả cảnh mở đầu (CinematicIntro) lẫn nền lưới bên dưới. */}
      <svg className="lq-svg-defs" aria-hidden="true">
        <filter id="lq-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="26" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
        </filter>
      </svg>

      <div className="lq-grain" aria-hidden="true" />

      <CinematicIntro />

      {/* Mỗi công cụ 1 cảnh cuộn riêng — cuộn qua là 1 animation minh hoạ riêng cho công cụ đó
          hiện ra (chữ Hán viết từng nét, âm tiết tiếng Hàn ghép lại, khối 3D xoay...). */}
      {TOOLS.map((tool) => (
        <ToolScene key={tool.href} tool={tool} />
      ))}

      {/* Bọc riêng phần lưới + blob nền trong 1 wrapper CÙNG CẤP với CinematicIntro (không phải
          cha của nó) để đặt overflow-x:hidden ở đây — nếu đặt lên .lq-root (cha chung, cũng là
          tổ tiên của .ci-stage) thì theo spec CSS, khai overflow-x mà bỏ trống overflow-y sẽ bị
          trình duyệt tự tính overflow-y thành "auto", biến .lq-root thành 1 scroll container và
          phá position:sticky của .ci-stage bên trong CinematicIntro. */}
      <div className="lq-section">
        <div className="lq-blobs">
          <span className="lq-blob lq-blob-1" />
          <span className="lq-blob lq-blob-2" />
          <span className="lq-blob lq-blob-3" />
          <span className="lq-blob lq-blob-4" />
          <span className="lq-blob lq-blob-5" />
          <span className="lq-blob lq-blob-6" />
        </div>

        <div className="lq-content">
          <p className="lq-kicker">Chạm vào một giọt kính bên dưới để mở</p>

          <div className="lq-grid">
            {TOOLS.map((tool) => (
              <LiquidCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Cảnh mở đầu dạng "cuộn = tua phim": chiều cao track dài gấp nhiều lần màn hình, bên trong
// pin 1 khung hình cao 100vh (position: sticky) — cuộn chuột đi bao nhiêu % qua track thì
// animation tua tới bấy nhiêu %, y hệt kiểu scrollytelling (Apple, Stripe...). Đọc scroll bằng
// listener + rAF rồi set style trực tiếp qua ref (không setState) để không re-render mỗi pixel.
function CinematicIntro() {
  const trackRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const iconsWrapRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([])
  const hintRef = useRef<HTMLSpanElement>(null)
  const blobsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId = 0

    function update() {
      rafId = 0
      const track = trackRef.current
      if (!track) return
      const rect = track.getBoundingClientRect()
      const total = track.offsetHeight - window.innerHeight
      const p = total > 0 ? clamp01(-rect.top / total) : 0

      // Act 1 (0 → 0.30): tiêu đề hiện sẵn full ngay khi vào trang (chưa cuộn = p=0 vẫn phải
      // thấy được, không "fade in từ rỗng"), rồi mờ dần khi cuộn qua.
      const hOut = clamp01((p - 0.22) / 0.1)
      const hOpacity = 1 - hOut
      if (headlineRef.current) {
        headlineRef.current.style.opacity = String(hOpacity)
        headlineRef.current.style.transform = `translateY(${-hOut * 40}px) scale(${1 + 0.06 * hOut})`
      }

      // Act 2 (0.24 → 0.5): dòng phụ đề hiện lên rồi mờ đi.
      const tIn = clamp01((p - 0.24) / 0.08)
      const tOut = clamp01((p - 0.42) / 0.08)
      const tOpacity = tIn * (1 - tOut)
      if (taglineRef.current) {
        taglineRef.current.style.opacity = String(tOpacity)
        taglineRef.current.style.transform = `translateY(${(1 - tIn) * 22 - tOut * 30}px)`
      }

      // Act 3 (0.45 → 0.95): 7 icon bay hội tụ về thành 1 hàng.
      const groupIn = clamp01((p - 0.45) / 0.1)
      if (iconsWrapRef.current) iconsWrapRef.current.style.opacity = String(groupIn)
      ICON_START.forEach((start, i) => {
        const el = iconRefs.current[i]
        if (!el) return
        const localStart = 0.5 + i * 0.045
        const localP = clamp01((p - localStart) / 0.24)
        const ease = 1 - Math.pow(1 - localP, 3)
        const x = start.x * (1 - ease)
        const y = start.y * (1 - ease)
        const rot = start.rot * (1 - ease)
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${0.6 + 0.4 * ease})`
        el.style.opacity = String(clamp01(localP / 0.3 + 0.15))
      })

      // Gợi ý cuộn tiếp — chỉ hiện ở đầu, mờ dần khi đã cuộn qua act 1.
      if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp01(p / 0.12))

      // Khối lỏng nền: co lại + xoay nhẹ theo tiến trình cuộn cho có cảm giác "cả cảnh đang chuyển động".
      if (blobsRef.current) {
        blobsRef.current.style.transform = `scale(${1 - p * 0.22}) rotate(${p * 18}deg)`
        blobsRef.current.style.opacity = String(1 - p * 0.35)
      }
    }

    function onScroll() {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={trackRef} className="ci-track">
      <div className="ci-stage">
        <div ref={blobsRef} className="ci-blobs">
          <span className="lq-blob lq-blob-1" />
          <span className="lq-blob lq-blob-2" />
          <span className="lq-blob lq-blob-3" />
          <span className="lq-blob lq-blob-4" />
          <span className="lq-blob lq-blob-5" />
          <span className="lq-blob lq-blob-6" />
        </div>

        <div className="ci-content">
          <div ref={headlineRef} className="ci-headline">
            Hệ sinh thái
            <br />
            công cụ.
          </div>
          <p ref={taglineRef} className="ci-tagline">
            {TOOLS.length} công cụ cá nhân — ngôn ngữ, tài chính, thói quen, ghi chú.
          </p>
          <div ref={iconsWrapRef} className="ci-icons">
            {TOOLS.map((tool, i) => (
              <span
                key={tool.href}
                ref={(el) => {
                  iconRefs.current[i] = el
                }}
                className="ci-icon"
                style={{ background: tool.accent }}
              >
                {tool.icon}
              </span>
            ))}
          </div>
        </div>

        <span ref={hintRef} className="ci-hint">
          Cuộn xuống ↓
        </span>
      </div>
    </div>
  )
}

function LiquidCard({ tool }: { tool: Tool }) {
  const cardRef = useRef<HTMLAnchorElement>(null)

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * 100
    const my = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${mx}%`)
    el.style.setProperty('--my', `${my}%`)
  }

  return (
    <Link
      ref={cardRef}
      href={tool.href}
      className="lq-card"
      style={{ '--accent': tool.accent } as React.CSSProperties}
      onMouseMove={handleMove}
    >
      <span className="lq-card-ripple" />
      <span className="lq-card-icon">{tool.icon}</span>
      <span className="lq-card-name">{tool.title}</span>
      <p className="lq-card-desc">{tool.description}</p>
      <span className="lq-card-go">Mở →</span>
    </Link>
  )
}

type TrackRef = React.RefObject<HTMLDivElement | null>

// Cảnh riêng cho 1 công cụ: track cuộn riêng của nó (ngắn hơn CinematicIntro), pin 1 khung
// hình gồm visual minh hoạ (bên trái) + tên/mô tả/nút mở (bên phải, mờ dần vào-ra theo cuộn).
function ToolScene({ tool }: { tool: Tool }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    return attachScrollProgress(track, (p) => {
      const inP = clamp01(p / 0.12)
      const outP = clamp01((p - 0.86) / 0.14)
      const opacity = inP * (1 - outP)
      if (infoRef.current) {
        infoRef.current.style.opacity = String(opacity)
        infoRef.current.style.transform = `translateY(${(1 - inP) * 24 - outP * 20}px)`
      }
      if (ctaRef.current) {
        const ctaIn = clamp01((p - 0.5) / 0.2)
        ctaRef.current.style.opacity = String(ctaIn * (1 - outP))
      }
    })
  }, [])

  return (
    <div ref={trackRef} className="ts-track">
      <div className="ts-stage" style={{ '--accent': tool.accent } as React.CSSProperties}>
        <div className="ts-visual-wrap">
          <ToolVisual tool={tool} trackRef={trackRef} />
        </div>

        <div ref={infoRef} className="ts-info">
          <span className="ts-info-icon" style={{ background: tool.accent }}>
            {tool.icon}
          </span>
          <h2 className="ts-info-title">{tool.title}</h2>
          <p className="ts-info-desc">{tool.description}</p>
          <Link ref={ctaRef} href={tool.href} className="ts-info-cta">
            Mở {tool.title} →
          </Link>
        </div>
      </div>
    </div>
  )
}

function ToolVisual({ tool, trackRef }: { tool: Tool; trackRef: TrackRef }) {
  switch (tool.href) {
    case '/korean':
      return <KoreanVisual trackRef={trackRef} />
    case '/chinese':
      return <ChineseVisual trackRef={trackRef} />
    case '/ielts':
      return <IeltsVisual trackRef={trackRef} />
    case '/vitrine':
      return <VitrineVisual trackRef={trackRef} />
    case '/money':
      return <MoneyVisual trackRef={trackRef} />
    case '/habits':
      return <HabitsVisual trackRef={trackRef} />
    case '/notes':
      return <NotesVisual trackRef={trackRef} />
    default:
      return null
  }
}

const KOREAN_CHARS = ['한', '국', '어']

// Tiếng Hàn — từng âm tiết của "한국어" lần lượt hiện lên, như đang ghép chữ.
function KoreanVisual({ trackRef }: { trackRef: TrackRef }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    return attachScrollProgress(track, (p) => {
      const vp = clamp01((p - 0.08) / 0.62)
      KOREAN_CHARS.forEach((_, i) => {
        const el = refs.current[i]
        if (!el) return
        const local = clamp01((vp - i * 0.22) / 0.35)
        const ease = 1 - Math.pow(1 - local, 3)
        el.style.opacity = String(ease)
        el.style.transform = `translateY(${(1 - ease) * 24}px) scale(${0.6 + 0.4 * ease})`
      })
    })
  }, [trackRef])

  return (
    <div className="ts-korean">
      {KOREAN_CHARS.map((ch, i) => (
        <span
          key={ch}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="ts-korean-ch"
        >
          {ch}
        </span>
      ))}
    </div>
  )
}

// Tiếng Trung — chữ 中 được "viết" từng nét bằng stroke-dasharray/dashoffset trên path SVG:
// nét khung trước, nét sổ dọc xuyên giữa sau, đúng thứ tự viết thật của chữ 中.
function ChineseVisual({ trackRef }: { trackRef: TrackRef }) {
  const boxRef = useRef<SVGPathElement>(null)
  const midRef = useRef<SVGPathElement>(null)
  const lengths = useRef({ box: 0, mid: 0 })

  useEffect(() => {
    if (boxRef.current) lengths.current.box = boxRef.current.getTotalLength()
    if (midRef.current) lengths.current.mid = midRef.current.getTotalLength()
    const track = trackRef.current
    if (!track) return
    return attachScrollProgress(track, (p) => {
      const vp = clamp01((p - 0.08) / 0.62)
      const boxP = clamp01(vp / 0.6)
      const midP = clamp01((vp - 0.45) / 0.55)
      if (boxRef.current) {
        const len = lengths.current.box
        boxRef.current.style.strokeDasharray = `${len}`
        boxRef.current.style.strokeDashoffset = `${len * (1 - boxP)}`
      }
      if (midRef.current) {
        const len = lengths.current.mid
        midRef.current.style.strokeDasharray = `${len}`
        midRef.current.style.strokeDashoffset = `${len * (1 - midP)}`
      }
    })
  }, [trackRef])

  return (
    <svg viewBox="0 0 100 100" className="ts-hanzi">
      <path ref={boxRef} d="M22 16 H78 V84 H22 Z" className="ts-hanzi-stroke" />
      <path ref={midRef} d="M50 4 V96" className="ts-hanzi-stroke" />
    </svg>
  )
}

const IELTS_WIDTHS = [0.92, 0.6, 0.8, 0.42]

// IELTS — các dòng "văn bản" tự kéo dài ra như đang được viết, rồi 1 vệt highlight quét qua.
function IeltsVisual({ trackRef }: { trackRef: TrackRef }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])
  const highlightRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    return attachScrollProgress(track, (p) => {
      const vp = clamp01((p - 0.08) / 0.62)
      IELTS_WIDTHS.forEach((_, i) => {
        const el = refs.current[i]
        if (!el) return
        const local = clamp01((vp - i * 0.15) / 0.35)
        el.style.transform = `scaleX(${local})`
      })
      if (highlightRef.current) {
        const local = clamp01((vp - 0.62) / 0.35)
        highlightRef.current.style.opacity = String(local)
        highlightRef.current.style.transform = `scaleX(${local})`
      }
    })
  }, [trackRef])

  return (
    <div className="ts-ielts">
      {IELTS_WIDTHS.map((w, i) => (
        <span key={i} className="ts-ielts-line-track" style={{ width: `${w * 100}%` }}>
          <span
            ref={(el) => {
              refs.current[i] = el
            }}
            className="ts-ielts-line"
          />
        </span>
      ))}
      <span ref={highlightRef} className="ts-ielts-highlight" />
    </div>
  )
}

// Vitrine — khối lập phương 3D xoay theo tiến trình cuộn, mỗi mặt 1 ngôn ngữ.
function VitrineVisual({ trackRef }: { trackRef: TrackRef }) {
  const cubeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    return attachScrollProgress(track, (p) => {
      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateY(${p * 420}deg) rotateX(${20 + p * 200}deg)`
      }
    })
  }, [trackRef])

  const faces = ['VI', 'EN', '中', '한', '日', '3D']
  return (
    <div className="ts-cube-scene">
      <div ref={cubeRef} className="ts-cube">
        {faces.map((f, i) => (
          <span key={f} className={`ts-cube-face ts-cube-face-${i}`}>
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

const MONEY_HEIGHTS = [0.4, 0.65, 0.5, 0.85, 0.7]

// Thu Chi — biểu đồ cột "tăng trưởng" mọc lên lần lượt từ trái sang phải.
function MoneyVisual({ trackRef }: { trackRef: TrackRef }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    return attachScrollProgress(track, (p) => {
      const vp = clamp01((p - 0.08) / 0.62)
      MONEY_HEIGHTS.forEach((_, i) => {
        const el = refs.current[i]
        if (!el) return
        const local = clamp01((vp - i * 0.13) / 0.3)
        el.style.transform = `scaleY(${local})`
      })
    })
  }, [trackRef])

  return (
    <div className="ts-chart">
      {MONEY_HEIGHTS.map((h, i) => (
        <span key={i} className="ts-chart-track" style={{ height: `${h * 100}%` }}>
          <span
            ref={(el) => {
              refs.current[i] = el
            }}
            className="ts-chart-bar"
          />
        </span>
      ))}
    </div>
  )
}

// Thói Quen — 7 ngày trong tuần lần lượt được tích, như đang xây streak.
function HabitsVisual({ trackRef }: { trackRef: TrackRef }) {
  const days = 7
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    return attachScrollProgress(track, (p) => {
      const vp = clamp01((p - 0.08) / 0.62)
      for (let i = 0; i < days; i++) {
        const el = refs.current[i]
        if (!el) continue
        const local = clamp01((vp - i * 0.11) / 0.22)
        el.style.opacity = String(local)
        el.style.transform = `scale(${0.5 + 0.5 * local})`
      }
    })
  }, [trackRef])

  return (
    <div className="ts-streak">
      {Array.from({ length: days }).map((_, i) => (
        <span
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="ts-streak-day"
        >
          ✓
        </span>
      ))}
    </div>
  )
}

const STICKY_NOTES = [
  { rot: -7, bg: '#ffe08a' },
  { rot: 5, bg: '#ffb3c2' },
  { rot: -3, bg: '#a6e8f2' },
]

// Ghi Chú — vài mẩu sticky-note rơi vào và dán lên, mỗi cái lệch góc 1 chút cho tự nhiên.
function NotesVisual({ trackRef }: { trackRef: TrackRef }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    return attachScrollProgress(track, (p) => {
      const vp = clamp01((p - 0.08) / 0.62)
      STICKY_NOTES.forEach((n, i) => {
        const el = refs.current[i]
        if (!el) return
        const local = clamp01((vp - i * 0.22) / 0.4)
        const ease = 1 - Math.pow(1 - local, 3)
        el.style.opacity = String(ease)
        el.style.transform = `translateY(${(1 - ease) * -70}px) rotate(${n.rot * ease}deg) scale(${0.7 + 0.3 * ease})`
      })
    })
  }, [trackRef])

  return (
    <div className="ts-notes">
      {STICKY_NOTES.map((n, i) => (
        <span
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          className="ts-note"
          style={{ background: n.bg, zIndex: i }}
        />
      ))}
    </div>
  )
}
