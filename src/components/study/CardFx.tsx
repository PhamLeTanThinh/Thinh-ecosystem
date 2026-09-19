import type { CSSProperties } from 'react'
import type { CardEffect } from '@/lib/apps/tools'

// Hiệu ứng hạt riêng của từng thẻ ở /study: hoa anh đào rơi, tàn lửa bay lên, tuyết rơi, nốt nhạc bay lên.
// Thuần CSS — mỗi hạt là 1 <i> với các biến CSS (vị trí, cỡ, thời lượng, độ trễ, biên độ lắc) còn hình dạng
// và chuyển động nằm ở study.css. Là server component nên hạt có sẵn trong HTML đầu tiên; giá trị "ngẫu
// nhiên" sinh từ hạt giống cố định (không dùng Math.random) để mỗi lần render ra đúng như nhau.

interface Config {
  count: number
  size: [number, number] // cqw (đơn vị theo bề rộng thẻ) nên hạt co giãn cùng thẻ
  duration: [number, number] // giây
  sway: [number, number] // cqw: biên độ lắc ngang
  glyphs?: string[]
}

const CONFIG: Record<CardEffect, Config> = {
  sakura: { count: 14, size: [3.2, 5.4], duration: [8, 14], sway: [3, 9] },
  embers: { count: 18, size: [1.7, 3.4], duration: [6, 11], sway: [2, 6] },
  snow: { count: 20, size: [1.1, 2.7], duration: [7, 13], sway: [1.5, 4.5] },
  notes: { count: 10, size: [4.6, 7], duration: [8, 13], sway: [2, 6], glyphs: ['♪', '♫', '♩', '♬'] },
}

// Bộ sinh số giả ngẫu nhiên có hạt giống (mulberry32).
function seeded(seed: number) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const between = (rand: () => number, [a, b]: [number, number]) => a + rand() * (b - a)

export function CardFx({ effect }: { effect: CardEffect }) {
  const cfg = CONFIG[effect]
  const rand = seeded([...effect].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))

  return (
    <span className={`sd-fx sd-fx-${effect}`} aria-hidden="true">
      {Array.from({ length: cfg.count }, (_, i) => {
        const duration = between(rand, cfg.duration)
        const style = {
          '--x': `${(2 + rand() * 94).toFixed(1)}%`,
          '--s': `${between(rand, cfg.size).toFixed(2)}cqw`,
          '--d': `${duration.toFixed(1)}s`,
          // Độ trễ ÂM: hạt đã "bay giữa chừng" ngay từ lúc tải trang thay vì cùng xuất hiện ở mép.
          '--delay': `${(-rand() * duration).toFixed(1)}s`,
          '--sw': `${between(rand, cfg.sway).toFixed(1)}cqw`,
          ...(cfg.glyphs ? { '--g': `"${cfg.glyphs[i % cfg.glyphs.length]}"` } : {}),
        } as CSSProperties
        return <i key={i} style={style} />
      })}
    </span>
  )
}
