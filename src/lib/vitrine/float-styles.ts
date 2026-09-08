export type FloatStyleId = 'scatter' | 'rise' | 'spiral' | 'zoom'

export const FLOAT_STYLE_IDS: FloatStyleId[] = ['scatter', 'rise', 'spiral', 'zoom']

export function pickRandomFloatStyle(): FloatStyleId {
  return FLOAT_STYLE_IDS[Math.floor(Math.random() * FLOAT_STYLE_IDS.length)]
}

interface FloatStyleConfig {
  distance: number
  rotate: number
  blur: number
  scale: number
  // 0 = trôi đúng theo hướng hình học (ra xa card được bấm / từ hướng scatter riêng);
  // 1 = luôn kéo theo trục dọc, dùng cho kiểu "rise".
  verticalBias: number
}

// 4 "chất" chuyển động khác nhau — chọn ngẫu nhiên mỗi lần bấm (xem flow-transition.tsx),
// nhưng CÙNG một style dùng cho cả lúc trôi ra (trang nguồn) lẫn bay vào (trang đích) vì
// style được lưu vào store dùng chung (persist qua điều hướng SPA, xem store.ts).
export const FLOAT_STYLES: Record<FloatStyleId, FloatStyleConfig> = {
  scatter: { distance: 90, rotate: 0, blur: 0, scale: 0.86, verticalBias: 0 },
  rise: { distance: 75, rotate: 0, blur: 3, scale: 0.92, verticalBias: 0.85 },
  spiral: { distance: 105, rotate: 16, blur: 2, scale: 0.78, verticalBias: 0 },
  zoom: { distance: 24, rotate: 0, blur: 5, scale: 0.5, verticalBias: 0 },
}

export interface Vec2 {
  x: number
  y: number
}

// Áp style lên 1 hướng đơn vị (unit vector) -> ra độ lệch x/y (px) + góc xoay (deg) thật
// sự dùng để animate. `index` chỉ dùng để xen kẽ chiều xoay trái/phải cho đỡ đều tăm tắp.
export function applyFloatStyle(dir: Vec2, style: FloatStyleId, index: number) {
  const cfg = FLOAT_STYLES[style]
  const dx = dir.x * (1 - cfg.verticalBias)
  const dy = dir.y * (1 - cfg.verticalBias) - cfg.verticalBias
  return {
    x: dx * cfg.distance,
    y: dy * cfg.distance,
    rotate: cfg.rotate * (index % 2 === 0 ? 1 : -1),
    blur: cfg.blur,
    scale: cfg.scale,
  }
}
