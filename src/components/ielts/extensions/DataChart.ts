import { Node, mergeAttributes } from '@tiptap/core'

// Biểu đồ tĩnh (line/bar/pie-đôi) vẽ bằng SVG thuần, dựng lại số liệu đọc từ ảnh chụp sách — không
// phải ảnh chụp, để co giãn đúng theo chiều rộng trang và giữ đúng màu hệ thống. Dữ liệu mã hoá
// base64(JSON) trong 1 attribute duy nhất để tránh escape dấu ngoặc kép trong thuộc tính HTML.
type Series = { name: string; color: string; values: number[] }
// yMin tuỳ chọn — cho các chart trục bị "cắt cụt" (không bắt đầu từ 0, vd trục 80–87%) để phóng to
// đúng chênh lệch nhỏ như sách in, thay vì ép về 0 khiến các cột gần như cao bằng nhau.
type LineBarData = { categories: string[]; series: Series[]; unit?: string; yMin?: number }
type PieSlice = { name: string; color: string; values: number[] }
type PieData = { labels: string[]; slices: PieSlice[] }
type DualSeries = { name: string; color: string; unit?: string; values: number[]; yMin?: number }
// Chart 2 trục Y độc lập (vd % thất nghiệp bên trái, số người bên phải) — vẽ chung 1 vùng plot,
// mỗi đường tự co giãn theo thang riêng của nó thay vì ép chung 1 thang (vô nghĩa vì đơn vị khác).
type DualAxisData = { categories: string[]; left: DualSeries; right: DualSeries }
type ProcessStep = { icon: string; label: string }
// Sơ đồ quy trình dạng zigzag (như sách in) — icon emoji thay cho hình vẽ tay minh hoạ (không khả
// thi vẽ lại chi tiết bằng SVG path), đánh số theo đúng thứ tự bước, mũi tên nối theo hình chữ Z.
type ProcessLinearData = { steps: ProcessStep[]; cols?: number }
// Sơ đồ vòng đời dạng tròn — các bước xếp đều quanh 1 vòng tròn, nối bằng cung mũi tên, có thể ghi
// thời lượng giữa các bước (durations[i] = thời gian từ bước i sang bước i+1).
type ProcessCircularData = { steps: ProcessStep[]; durations?: string[]; centerLabel?: string }
// Sơ đồ bản đồ (Lesson 14 — Map) — mỗi "panel" là 1 khung bản đồ con (vd "1980" / "Now", "Before" /
// "After"), vẽ dạng sơ đồ mặt bằng đơn giản: zone (vùng chức năng, hình chữ nhật có nhãn), path
// (đường/lối đi), icon (điểm đánh dấu nhỏ), la bàn, thanh tỉ lệ — không vẽ chi tiết như tranh minh
// hoạ gốc, chỉ giữ đúng cấu trúc/vị trí tương đối để đọc hiểu & làm bài luyện tập.
type MapZone = { x: number; y: number; w: number; h: number; label: string; color?: string }
// curve: true vẽ qua các điểm bằng đường cong mượt (đường/lối đi trong sách hầu như không thẳng
// tuyệt đối) thay vì polyline gãy khúc. style 'river' vẽ dải xanh dày để đọc rõ là dòng sông.
type MapPathSeg = { points: [number, number][]; style?: 'road' | 'track' | 'path' | 'river'; label?: string; curve?: boolean }
// Đường vành đai hình oval (vd ring road bao quanh khu trung tâm) — không biểu diễn được bằng dãy
// điểm thẳng nên tách riêng thành 1 loại path khác, vẽ bằng <ellipse>.
type MapRing = { cx: number; cy: number; rx: number; ry: number; label?: string }
type MapIcon = { x: number; y: number; icon: string; label?: string; scale?: number }
// panelShape thay panel nền hình chữ nhật mặc định bằng 1 polygon tuỳ ý (vd hình đảo bất định) —
// nền ngoài polygon vẫn là màu "biển" của rect gốc, polygon vẽ đè lên như 1 vùng đất riêng.
type MapPanel = {
  title: string
  w: number
  h: number
  zones: MapZone[]
  paths?: MapPathSeg[]
  rings?: MapRing[]
  icons?: MapIcon[]
  compass?: boolean
  scaleLabel?: string
  panelShape?: { points: [number, number][]; fill: string }
  bgColor?: string
}
type MapDiagramData = { panels: MapPanel[] }

// Sơ đồ luồng (box → mũi tên → box, có thể rẽ nhánh rồi hội tụ lại) — dùng cho các sơ đồ khái niệm
// (không phải số liệu) như "quy trình học kỹ năng mới", "cách phân loại câu hỏi rồi chọn cấu trúc
// trả lời". Nhiều "lane" (hàng) xếp chồng cho các sơ đồ có 2+ luồng song song (vd tiêu chí A ảnh
// hưởng tiêu chí B, và tiêu chí C ảnh hưởng tiêu chí D, vẽ thành 2 hàng riêng trong cùng 1 hình).
type FlowNode = { type: 'box'; text: string; arrowLabel?: string } | { type: 'split'; branches: string[]; arrowLabel?: string }
type FlowChainData = { lanes: FlowNode[][] }

// Sơ đồ "Direct Response" riêng cho Speaking Lesson 1 — sao lại ĐÚNG bảng màu + bố cục trong sách
// gốc (nền hồng, box "?" đen, pill đỏ mận, badge số viền đen) thay vì bảng màu xanh lá mặc định
// của flowChain, vì ảnh chụp sách có phong cách riêng cho đúng 2 sơ đồ này.
type DRStepsData = { qLabel: string; topLabels: [string, string]; answerLabel: string; elaborateLabel: string }
type DRRow =
  | { kind: 'desc'; text: string }
  | { kind: 'plain'; text: string }
  | { kind: 'labeled'; label: string; text: string }
  | { kind: 'icon'; icon: 'up' | 'down'; text: string }
type DRColumn = { title: string; rows: DRRow[] }
type DRTypesData = { qLabel: string; headerLabel: string; columns: DRColumn[] }

// Tên/label tới từ dữ liệu tuỳ ý (vd "Food & Beverage") — SVG là XML nên "&"/"<"/">" chưa escape
// sẽ làm trình duyệt coi data:image/svg+xml là XML lỗi và không render (img.naturalWidth = 0),
// không báo lỗi console rõ ràng nào cả.
function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function base64Encode(str: string): string {
  if (typeof window === 'undefined') return Buffer.from(str, 'utf-8').toString('base64')
  return btoa(unescape(encodeURIComponent(str)))
}

function encodeData(obj: unknown): string {
  return base64Encode(JSON.stringify(obj))
}

function decodeData(b64: string): unknown {
  if (!b64) return null
  try {
    const json = typeof window === 'undefined' ? Buffer.from(b64, 'base64').toString('utf-8') : decodeURIComponent(escape(atob(b64)))
    return JSON.parse(json)
  } catch {
    return null
  }
}

// Chọn bước lưới "tròn" (2, 5, 10, 20…) theo khoảng giá trị — thay vì chia cứng thành 5 đoạn bằng
// nhau (dễ ra bước lẻ như 6, 6.6…), khớp đúng kiểu trục mà sách in (bước 10 cho thang 0-100, bước
// 5 cho thang 0-30, bước 2 cho thang 0-16).
function niceStep(maxVal: number, targetTicks = 10): number {
  if (maxVal <= 0) return 1
  const roughStep = maxVal / targetTicks
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)))
  const residual = roughStep / magnitude
  let niceResidual: number
  if (residual > 5) niceResidual = 10
  else if (residual > 2) niceResidual = 5
  else if (residual > 1) niceResidual = 2
  else niceResidual = 1
  return niceResidual * magnitude
}

function renderLineChart(data: LineBarData, title: string): string {
  const { categories, series, unit } = data
  const width = 640
  const height = 380
  const pad = { top: 16, right: 20, bottom: 64, left: 42 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom
  const yMin = data.yMin ?? 0
  const maxVal = Math.max(...series.flatMap((s) => s.values), 0)
  const range = Math.max(maxVal - yMin, 0)
  const step = niceStep(range || 1)
  let gridN = Math.ceil(range / step) || 1
  if (data.yMin !== undefined) gridN += 1 // thêm 1 nấc rỗng phía trên cho trục bị cắt cụt, giống sách
  const yMax = yMin + gridN * step
  const xStep = categories.length > 1 ? chartW / (categories.length - 1) : chartW
  const xPos = (i: number) => pad.left + i * xStep
  const yPos = (v: number) => pad.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH

  let grid = ''
  for (let i = 0; i <= gridN; i++) {
    const v = yMin + step * i
    const y = yPos(v)
    grid += `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e6e2da" stroke-width="1"/>`
    grid += `<text x="${pad.left - 8}" y="${y + 3}" font-size="10" text-anchor="end" fill="#5b6884">${formatGridLabel(v, step)}</text>`
  }

  const xLabels = categories
    .map((c, i) => `<text x="${xPos(i)}" y="${height - pad.bottom + 18}" font-size="10" text-anchor="middle" fill="#5b6884">${escapeXml(c)}</text>`)
    .join('')

  const lines = series
    .map((s) => {
      const pts = s.values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ')
      const dots = s.values.map((v, i) => `<circle cx="${xPos(i)}" cy="${yPos(v)}" r="3" fill="${s.color}"/>`).join('')
      return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5"/>${dots}`
    })
    .join('')

  const legendY = height - 24
  const legend = series
    .map((s, i) => {
      const lx = pad.left + i * (chartW / series.length)
      return `<g transform="translate(${lx}, ${legendY})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}</text></g>`
    })
    .join('')

  const unitLabel = unit ? `<text x="${pad.left}" y="${pad.top - 4}" font-size="10" fill="#5b6884">${escapeXml(unit)}</text>` : ''

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${grid}${unitLabel}<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/><line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/>${xLabels}${lines}${legend}</svg>`
}

function renderBarChart(data: LineBarData, title: string): string {
  const { categories, series, unit } = data
  const width = 640
  const height = 400
  const pad = { top: 16, right: 20, bottom: 84, left: 42 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom
  const yMin = data.yMin ?? 0
  const maxVal = Math.max(...series.flatMap((s) => s.values), 0)
  const range = Math.max(maxVal - yMin, 0)
  const step = niceStep(range || 1)
  let gridN = Math.ceil(range / step) || 1
  if (data.yMin !== undefined) gridN += 1
  const yMax = yMin + gridN * step
  const groupW = chartW / categories.length
  const barW = (groupW * 0.72) / series.length
  const groupPad = groupW * 0.14
  const yPos = (v: number) => pad.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH

  let grid = ''
  for (let i = 0; i <= gridN; i++) {
    const v = yMin + step * i
    const y = yPos(v)
    grid += `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e6e2da" stroke-width="1"/>`
    grid += `<text x="${pad.left - 8}" y="${y + 3}" font-size="10" text-anchor="end" fill="#5b6884">${formatGridLabel(v, step)}</text>`
  }

  const bars = categories
    .map((cat, ci) => {
      const groupX = pad.left + ci * groupW + groupPad
      const catBars = series
        .map((s, si) => {
          const x = groupX + si * barW
          const v = s.values[ci] ?? 0
          const y = yPos(v)
          const h = height - pad.bottom - y
          return `<rect x="${x}" y="${y}" width="${Math.max(barW - 2, 1)}" height="${h}" fill="${s.color}"/>`
        })
        .join('')
      const label = `<text x="${pad.left + ci * groupW + groupW / 2}" y="${height - pad.bottom + 16}" font-size="10.5" text-anchor="middle" fill="#2b3a55" font-weight="600">${escapeXml(cat)}</text>`
      return catBars + label
    })
    .join('')

  const legendY = height - 24
  const legend = series
    .map((s, i) => {
      const lx = pad.left + i * (chartW / series.length)
      return `<g transform="translate(${lx}, ${legendY})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}</text></g>`
    })
    .join('')

  const unitLabel = unit ? `<text x="${pad.left}" y="${pad.top - 4}" font-size="10" fill="#5b6884">${escapeXml(unit)}</text>` : ''

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${grid}${unitLabel}<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/><line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/>${bars}${legend}</svg>`
}

// Số thập phân trên nhãn gridline phải theo ĐÚNG bước lưới (step) — trước đây luôn Math.round(v),
// nên khi step lẻ (vd 0.5) hai nhãn liền kề (0.5 và 1) cùng làm tròn về "1", nhãn trùng nhau trông
// như trục chỉ có nấc nguyên (sai hẳn thang 0/0.5/1/1.5/... của sách).
function formatGridLabel(v: number, step: number): string {
  const decimals = Number.isInteger(step) ? 0 : 1
  const rounded = Math.round(v * 10 ** decimals) / 10 ** decimals
  const intPart = Math.trunc(rounded)
  const withComma = Math.abs(intPart) >= 1000 ? intPart.toLocaleString('en-US') : String(intPart)
  if (Number.isInteger(rounded)) return withComma
  const decPart = Math.abs(rounded - intPart).toFixed(decimals).split('.')[1]
  return `${withComma}.${decPart}`
}

// 2 đường số liệu đơn vị khác nhau (vd % và số người) trên CÙNG 1 chart — mỗi đường tự co giãn
// theo thang riêng (trục trái/phải độc lập), không ép chung 1 thang như renderLineChart (vô nghĩa
// vì đơn vị khác — xem ghi chú SP2 Lesson 10: không so sánh trực tiếp số liệu 2 trục khác nhau).
function renderDualLineChart(data: DualAxisData, title: string): string {
  const { categories, left, right } = data
  const width = 640
  const height = 380
  const pad = { top: 16, right: 58, bottom: 64, left: 46 }
  const chartW = width - pad.left - pad.right
  const chartH = height - pad.top - pad.bottom

  function axisScale(s: DualSeries) {
    const yMin = s.yMin ?? 0
    const maxVal = Math.max(...s.values, 0)
    const range = Math.max(maxVal - yMin, 0)
    const step = niceStep(range || 1)
    const gridN = Math.ceil(range / step) || 1
    return { yMin, yMax: yMin + gridN * step, step, gridN }
  }

  const leftScale = axisScale(left)
  const rightScale = axisScale(right)
  const xStep = categories.length > 1 ? chartW / (categories.length - 1) : chartW
  const xPos = (i: number) => pad.left + i * xStep
  const yPosOf = (scale: { yMin: number; yMax: number }) => (v: number) =>
    pad.top + chartH - ((v - scale.yMin) / (scale.yMax - scale.yMin)) * chartH
  const yPosLeft = yPosOf(leftScale)
  const yPosRight = yPosOf(rightScale)

  let grid = ''
  for (let i = 0; i <= leftScale.gridN; i++) {
    const v = leftScale.yMin + i * leftScale.step
    const y = yPosLeft(v)
    grid += `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e6e2da" stroke-width="1"/>`
    grid += `<text x="${pad.left - 8}" y="${y + 3}" font-size="10" text-anchor="end" fill="${left.color}">${formatGridLabel(v, leftScale.step)}</text>`
  }
  for (let i = 0; i <= rightScale.gridN; i++) {
    const v = rightScale.yMin + i * rightScale.step
    const y = yPosRight(v)
    grid += `<text x="${width - pad.right + 8}" y="${y + 3}" font-size="10" text-anchor="start" fill="${right.color}">${formatGridLabel(v, rightScale.step)}</text>`
  }

  const xLabels = categories
    .map((c, i) => `<text x="${xPos(i)}" y="${height - pad.bottom + 18}" font-size="10" text-anchor="middle" fill="#5b6884">${escapeXml(c)}</text>`)
    .join('')

  function lineFor(s: DualSeries, yPos: (v: number) => number, dashed: boolean) {
    const pts = s.values.map((v, i) => `${xPos(i)},${yPos(v)}`).join(' ')
    const dots = s.values.map((v, i) => `<circle cx="${xPos(i)}" cy="${yPos(v)}" r="3" fill="${s.color}"/>`).join('')
    const dash = dashed ? ' stroke-dasharray="6,4"' : ''
    return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5"${dash}/>${dots}`
  }

  const lines = lineFor(left, yPosLeft, false) + lineFor(right, yPosRight, true)

  const legendY = height - 24
  const legend = [left, right]
    .map((s, i) => {
      const lx = pad.left + i * (chartW / 2)
      return `<g transform="translate(${lx}, ${legendY})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}${s.unit ? ` (${escapeXml(s.unit)})` : ''}</text></g>`
    })
    .join('')

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${grid}<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/><line x1="${width - pad.right}" y1="${pad.top}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/><line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#2b3a55" stroke-width="1"/>${xLabels}${lines}${legend}</svg>`
}

function formatValue(v: number): string {
  const rounded = Math.round(v * 10) / 10
  const isInt = Number.isInteger(rounded)
  const [intPart, decPart] = (isInt ? String(rounded) : rounded.toFixed(1)).split('.')
  const withComma = Math.abs(Number(intPart)) >= 1000 ? Number(intPart).toLocaleString('en-US') : intPart
  return decPart ? `${withComma}.${decPart}` : withComma
}

// Bar chart NẰM NGANG — dùng cho bảng-kèm-thanh dạng "rank" (vd Combo 2C SP1: 10 nước × 2 chỉ số),
// nơi mỗi hàng in kèm con số chính xác ngay cạnh đầu thanh thay vì đọc theo trục X chung — giống hệt
// cách sách trình bày (không có gridline trục X, chỉ có số ở cuối mỗi thanh).
function renderHBarChart(data: LineBarData, title: string): string {
  const { categories, series } = data
  const width = 640
  const rowH = 32
  const barH = 11
  const pad = { top: 12, right: 78, bottom: 34, left: 118 }
  const chartW = width - pad.left - pad.right
  const height = pad.top + categories.length * rowH + pad.bottom
  const maxVal = Math.max(...series.flatMap((s) => s.values), 0) || 1
  const xScale = (v: number) => (v / maxVal) * chartW

  const rows = categories
    .map((cat, ci) => {
      const rowY = pad.top + ci * rowH
      const bars = series
        .map((s, si) => {
          const v = s.values[ci] ?? 0
          const w = Math.max(xScale(v), 1)
          const y = rowY + si * (barH + 3)
          return `<rect x="${pad.left}" y="${y}" width="${w}" height="${barH}" fill="${s.color}"/><text x="${pad.left + w + 6}" y="${y + barH - 2}" font-size="9.5" fill="#2b3a55">${formatValue(v)}</text>`
        })
        .join('')
      const label = `<text x="${pad.left - 8}" y="${rowY + barH + 3}" font-size="10.5" text-anchor="end" fill="#2b3a55" font-weight="600">${escapeXml(cat)}</text>`
      return bars + label
    })
    .join('')

  const legendY = height - 18
  const legend = series
    .map((s, i) => {
      const lx = pad.left + i * (chartW / series.length)
      return `<g transform="translate(${lx}, ${legendY})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}</text></g>`
    })
    .join('')

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${rows}${legend}</svg>`
}

// N pie tròn cùng hàng (N = labels.length) — không chỉ 2, vì có bài (Graph 05, Lesson 10) so sánh 3
// pie (Sodium/Fat/Sugar) cùng lúc. Bán kính tự co theo N để N pie vẫn đọc được trên cùng 1 hàng.
function renderPieDouble(data: PieData, title: string): string {
  const { labels, slices } = data
  const n = labels.length
  const r = n <= 2 ? 84 : n === 3 ? 62 : 50
  const cy = r + 46
  const colW = n <= 2 ? 290 : 210
  const width = Math.max(640, n * colW)
  const centers = labels.map((_, i) => (i + 0.5) * (width / n))
  const legendTop = cy + r + 40
  const height = legendTop + slices.length * 18 + 10

  function piePaths(cx: number, values: number[]) {
    const total = values.reduce((a, b) => a + b, 0) || 1
    let angle = -90
    return values.map((v) => {
      const slice = (v / total) * 360
      const startAngle = angle
      const endAngle = angle + slice
      angle = endAngle
      const rad = (d: number) => (d * Math.PI) / 180
      const x1 = cx + r * Math.cos(rad(startAngle))
      const y1 = cy + r * Math.sin(rad(startAngle))
      const x2 = cx + r * Math.cos(rad(endAngle))
      const y2 = cy + r * Math.sin(rad(endAngle))
      const largeArc = slice > 180 ? 1 : 0
      const mid = rad((startAngle + endAngle) / 2)
      const lx = cx + r * 0.65 * Math.cos(mid)
      const ly = cy + r * 0.65 * Math.sin(mid)
      return { path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`, lx, ly, v }
    })
  }

  const drawPie = (paths: ReturnType<typeof piePaths>) =>
    paths
      .map(
        (p, i) =>
          `<path d="${p.path}" fill="${slices[i].color}" stroke="#fdfcfa" stroke-width="2"/><text x="${p.lx}" y="${p.ly}" font-size="${n <= 2 ? 11 : 9.5}" font-weight="700" text-anchor="middle" fill="#fff">${p.v}%</text>`,
      )
      .join('')

  const pies = centers
    .map((cx, i) => {
      const paths = piePaths(cx, slices.map((s) => s.values[i]))
      return `${drawPie(paths)}<text x="${cx}" y="${cy + r + 22}" font-size="12" font-weight="700" text-anchor="middle" fill="#2b3a55">${escapeXml(labels[i])}</text>`
    })
    .join('')

  const legend = slices
    .map((s, i) => `<g transform="translate(24, ${legendTop + i * 18})"><rect width="10" height="10" rx="2" fill="${s.color}"/><text x="14" y="9" font-size="10.5" fill="#2b3a55">${escapeXml(s.name)}</text></g>`)
    .join('')

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${pies}${legend}</svg>`
}

// Thư viện icon vẽ tay bằng SVG thuần (không dùng emoji) — mỗi icon là 1 nhóm hình khối đơn giản
// trong khung 64×64, tông màu trùng bảng màu hệ thống (xanh lá/cam), phong cách flat-icon tối giản
// nhưng vẫn là hình vẽ thật thay vì ký tự văn bản, khớp yêu cầu "vẽ lại như sách" cho sơ đồ Process.
const PROCESS_ICONS: Record<string, string> = {
  orangeTree: `<ellipse cx="32" cy="52" rx="15" ry="3" fill="#dce4d0"/><rect x="29" y="34" width="6" height="16" rx="1" fill="#8b6b47"/><circle cx="32" cy="22" r="17" fill="#63A375"/><circle cx="22" cy="18" r="3" fill="#E08D3C"/><circle cx="42" cy="16" r="3" fill="#E08D3C"/><circle cx="30" cy="30" r="3" fill="#E08D3C"/><circle cx="40" cy="28" r="3" fill="#E08D3C"/>`,
  truck: `<rect x="6" y="28" width="16" height="16" rx="1" fill="#fff" stroke="#178A5A" stroke-width="2"/><circle cx="10" cy="18" r="4" fill="#E08D3C"/><circle cx="18" cy="20" r="3" fill="#E08D3C"/><rect x="22" y="20" width="32" height="24" rx="1" fill="#fff" stroke="#178A5A" stroke-width="2"/><circle cx="16" cy="46" r="4" fill="#2b3a55"/><circle cx="44" cy="46" r="4" fill="#2b3a55"/><rect x="6" y="44" width="48" height="3" fill="#2b3a55" opacity="0.15"/>`,
  grading: `<rect x="6" y="40" width="52" height="7" rx="3" fill="#dce4d0"/><circle cx="16" cy="36" r="3" fill="#E08D3C"/><circle cx="26" cy="36" r="3" fill="#E08D3C"/><circle cx="36" cy="36" r="3" fill="#E08D3C"/><circle cx="46" cy="36" r="3" fill="#E08D3C"/><circle cx="18" cy="16" r="5" fill="#63A375"/><path d="M10,32 Q10,20 18,21 Q26,20 26,32 Z" fill="#63A375"/><circle cx="44" cy="16" r="5" fill="#178A5A"/><path d="M36,32 Q36,20 44,21 Q52,20 52,32 Z" fill="#178A5A"/>`,
  sortingCrate: `<rect x="8" y="12" width="48" height="34" rx="2" fill="#fff" stroke="#178A5A" stroke-width="2"/><line x1="8" y1="29" x2="56" y2="29" stroke="#178A5A" stroke-width="1.5" opacity="0.4"/><line x1="24" y1="12" x2="24" y2="46" stroke="#178A5A" stroke-width="1.5" opacity="0.4"/><line x1="40" y1="12" x2="40" y2="46" stroke="#178A5A" stroke-width="1.5" opacity="0.4"/><circle cx="16" cy="20" r="3" fill="#E08D3C"/><circle cx="32" cy="20" r="3" fill="#E08D3C"/><circle cx="48" cy="20" r="3" fill="#E08D3C"/><circle cx="16" cy="37" r="3" fill="#E08D3C"/><circle cx="48" cy="37" r="3" fill="#E08D3C"/>`,
  extractor: `<rect x="12" y="42" width="40" height="8" rx="1" fill="#178A5A"/><rect x="20" y="16" width="24" height="8" rx="1" fill="#63A375"/><rect x="26" y="24" width="12" height="18" fill="#fff" stroke="#178A5A" stroke-width="2"/><path d="M44,30 q6,0 6,4 t-6,4" fill="none" stroke="#63A375" stroke-width="2.5"/>`,
  evaporationCoils: `<path d="M14,14 v10 a6,6 0 0 0 12,0 v-4 a6,6 0 0 1 12,0 v4 a6,6 0 0 0 12,0 v-4 a6,6 0 0 1 12,0 v10" fill="none" stroke="#B45309" stroke-width="4" stroke-linecap="round"/><circle cx="14" cy="46" r="3" fill="#3E63DD"/><circle cx="50" cy="46" r="3" fill="#3E63DD"/>`,
  concentrateBox: `<path d="M12,26 L52,26 L47,48 L17,48 Z" fill="#F3C98B" stroke="#B45309" stroke-width="2"/><path d="M17,32 q5,-4 10,0 t10,0 t10,0" fill="none" stroke="#B45309" stroke-width="2"/><circle cx="24" cy="40" r="1.6" fill="#B45309"/><circle cx="34" cy="42" r="1.6" fill="#B45309"/>`,
  coldStorage: `<rect x="10" y="12" width="18" height="38" rx="2" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="36" y="12" width="18" height="38" rx="2" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="13" y="38" width="12" height="4" fill="#63A375"/><rect x="39" y="38" width="12" height="4" fill="#63A375"/><path d="M19,20 l0,8 M15,24 l8,0" stroke="#3E63DD" stroke-width="1.6"/><path d="M45,20 l0,8 M41,24 l8,0" stroke="#3E63DD" stroke-width="1.6"/>`,
  canningMachine: `<rect x="8" y="42" width="48" height="8" fill="#63A375"/><path d="M10,50 l4,-8 M18,50 l4,-8 M26,50 l4,-8 M34,50 l4,-8 M42,50 l4,-8 M50,50 l4,-8" stroke="#178A5A" stroke-width="1.2" opacity="0.5"/><rect x="16" y="24" width="10" height="18" rx="1" fill="#C9667A"/><rect x="27" y="18" width="10" height="24" rx="1" fill="#C9667A"/><rect x="38" y="24" width="10" height="18" rx="1" fill="#C9667A"/><rect x="30" y="12" width="4" height="6" fill="#63A375"/>`,
  ship: `<path d="M8,38 L56,38 L50,50 L14,50 Z" fill="#178A5A"/><rect x="18" y="26" width="10" height="12" fill="#63A375"/><rect x="30" y="26" width="10" height="12" fill="#E08D3C"/><line x1="44" y1="16" x2="44" y2="38" stroke="#2b3a55" stroke-width="2"/><path d="M4,46 q6,-4 12,0 t12,0 t12,0 t12,0" fill="none" stroke="#3E63DD" stroke-width="2"/>`,
  tap: `<rect x="29" y="8" width="6" height="18" rx="1" fill="#63A375"/><rect x="29" y="24" width="18" height="6" rx="1" fill="#63A375"/><rect x="21" y="20" width="6" height="12" rx="1" fill="#178A5A"/><path d="M40,32 q3,6 0,11" fill="none" stroke="#3E63DD" stroke-width="2.5"/><path d="M38,44 q2,-4 4,0 q2,4 -2,6 q-4,-2 -2,-6" fill="#3E63DD"/>`,
  juiceCarton: `<path d="M20,16 L32,8 L44,16 L44,52 L20,52 Z" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="24" y="26" width="16" height="4" fill="#63A375"/><rect x="24" y="34" width="16" height="4" fill="#E08D3C"/><circle cx="32" cy="44" r="4" fill="#E08D3C" opacity="0.6"/>`,
  beeAdult: `<ellipse cx="32" cy="32" rx="16" ry="11" fill="#F3C24A"/><path d="M18,26 a16,11 0 0 1 0,12 M26,22 a16,11 0 0 1 0,20 M34,21 a16,11 0 0 1 0,22" fill="none" stroke="#2b3a55" stroke-width="3"/><ellipse cx="20" cy="20" rx="7" ry="5" fill="#eaf1ff" opacity="0.8"/><ellipse cx="30" cy="16" rx="7" ry="5" fill="#eaf1ff" opacity="0.8"/><circle cx="46" cy="30" r="3" fill="#2b3a55"/>`,
  beeEgg: `<ellipse cx="32" cy="32" rx="6" ry="14" fill="#F3E9C9" stroke="#B45309" stroke-width="1.5"/>`,
  beeLarva: `<path d="M20,40 q0,-24 22,-24 q10,0 8,10 q-2,8 -12,8 q-8,0 -6,8 q1,6 8,6" fill="none" stroke="#B7C99A" stroke-width="8" stroke-linecap="round"/>`,
  beeNymph: `<path d="M18,36 q2,-22 26,-20" fill="none" stroke="#8FAE72" stroke-width="9" stroke-linecap="round"/><circle cx="20" cy="34" r="5" fill="#8FAE72"/><circle cx="44" cy="17" r="4" fill="#8FAE72"/>`,
  beeYoungAdult: `<ellipse cx="32" cy="32" rx="14" ry="10" fill="#D9E3A6"/><path d="M20,26 a14,10 0 0 1 0,12 M28,22 a14,10 0 0 1 0,20" fill="none" stroke="#5b6884" stroke-width="2.5"/><ellipse cx="22" cy="21" rx="6" ry="4" fill="#eaf1ff" opacity="0.7"/>`,
  storageSilos: `<rect x="10" y="18" width="12" height="26" rx="6" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="24" y="18" width="12" height="26" rx="6" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="13" y="34" width="6" height="8" fill="#63A375"/><rect x="27" y="34" width="6" height="8" fill="#63A375"/><rect x="38" y="34" width="18" height="10" rx="1" fill="#63A375"/><circle cx="42" cy="46" r="3" fill="#2b3a55"/><circle cx="52" cy="46" r="3" fill="#2b3a55"/>`,
  mixer: `<rect x="16" y="20" width="32" height="22" rx="10" fill="#63A375"/><path d="M24,26 q8,10 16,0 M24,34 q8,10 16,0" stroke="#fff" stroke-width="2" fill="none"/><rect x="28" y="42" width="8" height="8" fill="#178A5A"/>`,
  doughSheets: `<circle cx="16" cy="30" r="9" fill="#B45309"/><circle cx="48" cy="30" r="9" fill="#B45309"/><rect x="16" y="26" width="32" height="8" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/>`,
  doughStrips: `<rect x="10" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/><rect x="20" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/><rect x="30" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/><rect x="40" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/><rect x="50" y="16" width="6" height="32" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.5"/>`,
  noodleDiscs: `<circle cx="32" cy="32" r="20" fill="none" stroke="#178A5A" stroke-width="2"/><path d="M16,26 q6,-6 10,0 t10,0 t10,0 M16,32 q6,-6 10,0 t10,0 t10,0 M16,38 q6,-6 10,0 t10,0 t10,0" stroke="#E08D3C" stroke-width="1.6" fill="none"/>`,
  cookingOil: `<path d="M10,26 L54,26 L48,48 L16,48 Z" fill="#F3C98B" stroke="#B45309" stroke-width="2"/><path d="M16,32 q6,-5 12,0 t12,0 t12,0" fill="none" stroke="#B45309" stroke-width="1.8"/><circle cx="22" cy="40" r="6" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.2"/><circle cx="36" cy="40" r="6" fill="#F3E9C9" stroke="#E08D3C" stroke-width="1.2"/>`,
  vegetables: `<circle cx="18" cy="34" r="6" fill="#63A375"/><circle cx="30" cy="30" r="5" fill="#B45309"/><path d="M40,20 L48,36 L32,36 Z" fill="#178A5A"/><circle cx="46" cy="42" r="5" fill="#E08D3C"/>`,
  labelling: `<rect x="18" y="14" width="28" height="36" rx="4" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="18" y="26" width="28" height="12" fill="#63A375"/><path d="M24,32 l4,4 l8,-8" stroke="#fff" stroke-width="2.4" fill="none"/>`,
  rain: `<ellipse cx="24" cy="20" rx="12" ry="9" fill="#dce8f2"/><ellipse cx="38" cy="18" rx="14" ry="10" fill="#dce8f2"/><ellipse cx="32" cy="24" rx="16" ry="10" fill="#dce8f2"/><line x1="20" y1="38" x2="16" y2="48" stroke="#3E63DD" stroke-width="2.4" stroke-linecap="round"/><line x1="32" y1="38" x2="28" y2="48" stroke="#3E63DD" stroke-width="2.4" stroke-linecap="round"/><line x1="44" y1="38" x2="40" y2="48" stroke="#3E63DD" stroke-width="2.4" stroke-linecap="round"/>`,
  houseDrain: `<path d="M18,30 L32,16 L46,30 L46,50 L18,50 Z" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="24" y="38" width="16" height="10" fill="#63A375"/><rect x="8" y="50" width="48" height="5" rx="1" fill="#8b95ab"/><line x1="12" y1="52.5" x2="52" y2="52.5" stroke="#5b6884" stroke-width="1" stroke-dasharray="2,2"/>`,
  recyclingPlant: `<rect x="8" y="22" width="48" height="20" rx="2" fill="#fff" stroke="#178A5A" stroke-width="2"/><line x1="20" y1="22" x2="20" y2="42" stroke="#178A5A" stroke-width="1.5"/><line x1="32" y1="22" x2="32" y2="42" stroke="#178A5A" stroke-width="1.5"/><line x1="44" y1="22" x2="44" y2="42" stroke="#178A5A" stroke-width="1.5"/><circle cx="14" cy="32" r="3" fill="#8b95ab"/><circle cx="26" cy="32" r="3" fill="#B45309"/><circle cx="38" cy="32" r="3" fill="#63A375"/><circle cx="50" cy="32" r="3" fill="#3E63DD"/>`,
  chlorineBottle: `<rect x="26" y="10" width="8" height="6" fill="#63A375"/><path d="M24,16 h12 l2,6 v26 a2,2 0 0 1 -2,2 h-12 a2,2 0 0 1 -2,-2 v-26 Z" fill="#178A5A"/><circle cx="20" cy="18" r="1.6" fill="#3E63DD"/><circle cx="44" cy="20" r="1.6" fill="#3E63DD"/><circle cx="18" cy="26" r="1.6" fill="#3E63DD"/>`,
  waterStorage: `<rect x="10" y="16" width="44" height="30" rx="3" fill="#63A375"/><circle cx="20" cy="26" r="2" fill="#dce4d0"/><circle cx="32" cy="30" r="2" fill="#dce4d0"/><circle cx="44" cy="24" r="2" fill="#dce4d0"/><circle cx="26" cy="38" r="2" fill="#dce4d0"/><circle cx="40" cy="36" r="2" fill="#dce4d0"/><path d="M10,42 q11,-4 22,0 t22,0" fill="none" stroke="#3E63DD" stroke-width="2"/>`,
  houseSunny: `<circle cx="48" cy="12" r="6" fill="#F3C24A"/><line x1="48" y1="2" x2="48" y2="0" stroke="#F3C24A" stroke-width="0"/><path d="M18,30 L32,16 L46,30 L46,50 L18,50 Z" fill="#fff" stroke="#178A5A" stroke-width="2"/><rect x="28" y="40" width="8" height="10" fill="#63A375"/><line x1="32" y1="52" x2="32" y2="60" stroke="#3E63DD" stroke-width="2" marker-end="url(#pArrow)"/>`,
  car: `<path d="M10,38 L14,26 Q18,20 28,20 L38,20 Q46,20 50,26 L54,38 Z" fill="#3E63DD" stroke="#2b3a55" stroke-width="1.5"/><rect x="18" y="22" width="26" height="10" rx="2" fill="#dce8f2"/><circle cx="18" cy="40" r="5" fill="#2b3a55"/><circle cx="46" cy="40" r="5" fill="#2b3a55"/>`,
  coffeeCup: `<path d="M18,24 h24 v18 a12,12 0 0 1 -24,0 Z" fill="#8b6b47" stroke="#5a4429" stroke-width="1.5"/><path d="M42,28 q10,0 10,9 t-10,9" fill="none" stroke="#5a4429" stroke-width="2.5"/><path d="M22,16 q3,-4 0,-8 M30,16 q3,-4 0,-8 M38,16 q3,-4 0,-8" fill="none" stroke="#B45309" stroke-width="1.6" stroke-linecap="round"/>`,
  mountain: `<path d="M4,50 L22,18 L34,36 L44,20 L60,50 Z" fill="#8FAE9E" stroke="#5b6884" stroke-width="1.5"/><path d="M22,18 L27,26 L17,26 Z" fill="#fff"/><path d="M44,20 L48,27 L40,27 Z" fill="#fff"/>`,
  houseCluster: `<path d="M8,40 L18,28 L28,40 L28,52 L8,52 Z" fill="#fff" stroke="#178A5A" stroke-width="1.6"/><path d="M30,36 L40,22 L50,36 L50,52 L30,52 Z" fill="#fff" stroke="#178A5A" stroke-width="1.6"/><path d="M46,42 L54,32 L62,42 L62,52 L46,52 Z" fill="#fff" stroke="#178A5A" stroke-width="1.6"/>`,
}
function processIcon(name: string): string {
  return PROCESS_ICONS[name] ?? `<circle cx="32" cy="32" r="18" fill="#dce4d0"/>`
}

function wrapLabel(text: string, maxChars: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (test.length > maxChars && cur) {
      lines.push(cur)
      cur = w
    } else {
      cur = test
    }
  }
  if (cur) lines.push(cur)
  return lines
}

function renderProcessLinear(data: ProcessLinearData, title: string): string {
  const { steps } = data
  const cols = data.cols ?? 3
  const rows = Math.ceil(steps.length / cols)
  const cellW = 170
  const cellH = 138
  const pad = { top: 24, left: 20, right: 20, bottom: 24 }
  const width = pad.left + cols * cellW + pad.right
  const height = pad.top + rows * cellH + pad.bottom

  // Zigzag chữ Z: hàng chẵn đi trái→phải, hàng lẻ đi phải→trái — giống đúng cách sách trình bày.
  function posFor(i: number) {
    const row = Math.floor(i / cols)
    const posInRow = i % cols
    const col = row % 2 === 0 ? posInRow : cols - 1 - posInRow
    return { cx: pad.left + col * cellW + cellW / 2, cy: pad.top + row * cellH + cellH / 2, row }
  }

  let cards = ''
  let arrows = ''
  steps.forEach((s, i) => {
    const { cx, cy } = posFor(i)
    const lines = wrapLabel(s.label, 15)
    const labelSvg = lines.map((l, li) => `<tspan x="${cx}" dy="${li === 0 ? 0 : 12}">${escapeXml(l)}</tspan>`).join('')
    const scale = 0.62
    const iconX = cx - 32 * scale
    const iconY = cy - 6 - 32 * scale
    cards += `<g><circle cx="${cx - 40}" cy="${cy - 40}" r="12" fill="#178A5A"/><text x="${cx - 40}" y="${cy - 36}" font-size="11.5" font-weight="700" text-anchor="middle" fill="#fff">${i + 1}</text><g transform="translate(${iconX},${iconY}) scale(${scale})">${processIcon(s.icon)}</g><text x="${cx}" y="${cy + 28}" font-size="9.5" text-anchor="middle" fill="#2b3a55">${labelSvg}</text></g>`
  })

  for (let i = 0; i < steps.length - 1; i++) {
    const a = posFor(i)
    const b = posFor(i + 1)
    if (a.row === b.row) {
      const dir = b.cx > a.cx ? 1 : -1
      arrows += `<line x1="${a.cx + dir * 42}" y1="${a.cy}" x2="${b.cx - dir * 42}" y2="${a.cy}" stroke="#63A375" stroke-width="2.5" marker-end="url(#pArrow)"/>`
    } else {
      const midY = (a.cy + 44 + (b.cy - 44)) / 2
      const bend = b.cx > a.cx ? 34 : -34
      arrows += `<path d="M${a.cx},${a.cy + 44} Q${a.cx + bend},${midY} ${b.cx},${b.cy - 44}" fill="none" stroke="#63A375" stroke-width="2.5" marker-end="url(#pArrow)"/>`
    }
  }

  const defs = `<defs><marker id="pArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#63A375"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${arrows}${cards}</svg>`
}

function renderProcessCircular(data: ProcessCircularData, title: string): string {
  const { steps, durations, centerLabel } = data
  const n = steps.length
  const width = 560
  const height = 560
  const cx = width / 2
  const cy = height / 2
  const R = 200
  const arcR = R - 48

  function angleFor(i: number) {
    return -90 + (i * 360) / n
  }
  function ptOn(radius: number, angle: number) {
    const rad = (angle * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  let items = ''
  steps.forEach((s, i) => {
    const { x, y } = ptOn(R, angleFor(i))
    const lines = wrapLabel(s.label, 13)
    const labelSvg = lines.map((l, li) => `<tspan x="${x}" dy="${li === 0 ? 0 : 12}">${escapeXml(l)}</tspan>`).join('')
    const scale = 0.5
    const iconX = x - 32 * scale
    const iconY = y - 16 - 32 * scale
    items += `<g><g transform="translate(${iconX},${iconY}) scale(${scale})">${processIcon(s.icon)}</g><text x="${x}" y="${y + 16}" font-size="10" text-anchor="middle" fill="#2b3a55" font-weight="600">${labelSvg}</text></g>`
  })

  let arcs = ''
  for (let i = 0; i < n; i++) {
    const aAngle = angleFor(i)
    const bAngle = angleFor((i + 1) % n)
    const aa = ptOn(arcR, aAngle)
    const bb = ptOn(arcR, i === n - 1 ? bAngle + 360 : bAngle)
    arcs += `<path d="M${aa.x},${aa.y} A${arcR},${arcR} 0 0 1 ${bb.x},${bb.y}" fill="none" stroke="#63A375" stroke-width="2.5" marker-end="url(#pArrow2)"/>`
    if (durations?.[i]) {
      const midAngle = i === n - 1 ? (aAngle + bAngle + 360) / 2 : (aAngle + bAngle) / 2
      const mid = ptOn(arcR, midAngle)
      arcs += `<text x="${mid.x}" y="${mid.y}" font-size="9.5" text-anchor="middle" fill="#5b6884">${escapeXml(durations[i])}</text>`
    }
  }

  const defs = `<defs><marker id="pArrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#63A375"/></marker></defs>`
  const center = centerLabel
    ? wrapLabel(centerLabel, 18)
        .map((l, li) => `<tspan x="${cx}" dy="${li === 0 ? 0 : 13}">${escapeXml(l)}</tspan>`)
        .join('')
    : ''
  const centerText = centerLabel
    ? `<text x="${cx}" y="${cy - 6}" font-size="11.5" text-anchor="middle" fill="#2b3a55" font-weight="700">${center}</text>`
    : ''

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${arcs}${items}${centerText}</svg>`
}

function renderMapDiagram(data: MapDiagramData, title: string): string {
  const { panels } = data
  const gap = 28
  const padOuter = { top: 26, left: 10, right: 10, bottom: 10 }
  const totalW = panels.reduce((s, p) => s + p.w, 0) + gap * (panels.length - 1) + padOuter.left + padOuter.right
  const maxH = Math.max(...panels.map((p) => p.h))
  const totalH = maxH + padOuter.top + padOuter.bottom

  function zoneColor(c?: string) {
    return c ?? '#eef1e8'
  }

  // Đường cong mượt qua N điểm: nối từng cặp điểm bằng 1 quadratic bezier có điểm điều khiển là
  // điểm giữa 2 mốc kề nhau — không cần spline phức tạp, đủ để lối đi/con đường trông tự nhiên hơn.
  function smoothPath(points: [number, number][]): string {
    if (points.length < 2) return ''
    let d = `M${points[0][0]},${points[0][1]}`
    for (let i = 1; i < points.length; i++) {
      const [px, py] = points[i - 1]
      const [cx, cy] = points[i]
      const mx = (px + cx) / 2
      const my = (py + cy) / 2
      d += ` Q${px},${py} ${mx},${my}`
    }
    const last = points[points.length - 1]
    d += ` T${last[0]},${last[1]}`
    return d
  }

  function drawPanel(p: MapPanel, offsetX: number): string {
    let out = `<rect x="${offsetX}" y="${padOuter.top}" width="${p.w}" height="${p.h}" fill="${p.bgColor ?? '#fdfcfa'}" stroke="#2b3a55" stroke-width="1.5"/>`
    out += `<text x="${offsetX + p.w / 2}" y="${padOuter.top - 8}" font-size="12" font-weight="700" text-anchor="middle" fill="#2b3a55">${escapeXml(p.title)}</text>`

    if (p.panelShape) {
      const pts = p.panelShape.points.map(([px, py]) => `${offsetX + px},${padOuter.top + py}`).join(' ')
      out += `<polygon points="${pts}" fill="${p.panelShape.fill}" stroke="#178A5A" stroke-width="1.5"/>`
    }

    for (const z of p.zones) {
      const zx = offsetX + z.x
      const zy = padOuter.top + z.y
      out += `<rect x="${zx}" y="${zy}" width="${z.w}" height="${z.h}" fill="${zoneColor(z.color)}" stroke="#178A5A" stroke-width="1" opacity="0.9"/>`
      const lines = wrapLabel(z.label, Math.max(8, Math.floor(z.w / 6)))
      const lx = zx + z.w / 2
      const ly = zy + z.h / 2 - ((lines.length - 1) * 10) / 2 + 3
      lines.forEach((l, li) => {
        out += `<text x="${lx}" y="${ly + li * 10}" font-size="8.5" text-anchor="middle" fill="#2b3a55">${escapeXml(l)}</text>`
      })
    }

    for (const ring of p.rings ?? []) {
      const rcx = offsetX + ring.cx
      const rcy = padOuter.top + ring.cy
      out += `<ellipse cx="${rcx}" cy="${rcy}" rx="${ring.rx}" ry="${ring.ry}" fill="none" stroke="#B45309" stroke-width="3" stroke-dasharray="6,4"/>`
      if (ring.label) out += `<text x="${rcx}" y="${rcy - ring.ry - 4}" font-size="8" text-anchor="middle" fill="#5b6884">${escapeXml(ring.label)}</text>`
    }

    for (const seg of p.paths ?? []) {
      const shifted = seg.points.map(([px, py]) => [offsetX + px, padOuter.top + py] as [number, number])
      const isRiver = seg.style === 'river'
      const dash = seg.style === 'track' ? ' stroke-dasharray="5,3"' : seg.style === 'path' ? ' stroke-dasharray="2,3"' : ''
      const strokeW = seg.style === 'road' ? 4 : isRiver ? 6 : 2
      const strokeColor = seg.style === 'road' ? '#B45309' : isRiver ? '#7fb3e0' : '#5b6884'
      if (seg.curve) {
        out += `<path d="${smoothPath(shifted)}" fill="none" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round"${dash}/>`
      } else {
        const pts = shifted.map(([px, py]) => `${px},${py}`).join(' ')
        out += `<polyline points="${pts}" fill="none" stroke="${strokeColor}" stroke-width="${strokeW}" stroke-linecap="round"${dash}/>`
      }
      if (seg.label) {
        const first = seg.points[0]
        const last = seg.points[seg.points.length - 1]
        const mx = (first[0] + last[0]) / 2
        const my = (first[1] + last[1]) / 2
        out += `<text x="${offsetX + mx}" y="${padOuter.top + my - (isRiver ? 9 : 5)}" font-size="8" text-anchor="middle" fill="#5b6884">${escapeXml(seg.label)}</text>`
      }
    }

    for (const ic of p.icons ?? []) {
      const ix = offsetX + ic.x
      const iy = padOuter.top + ic.y
      const sc = ic.scale ?? 0.28
      out += `<g transform="translate(${ix - 9 * (sc / 0.28)},${iy - 9 * (sc / 0.28)}) scale(${sc})">${processIcon(ic.icon)}</g>`
      if (ic.label) out += `<text x="${ix}" y="${iy + 9 * (sc / 0.28) + 8}" font-size="7.5" text-anchor="middle" fill="#2b3a55">${escapeXml(ic.label)}</text>`
    }

    if (p.compass) {
      const cx = offsetX + p.w - 22
      const cy = padOuter.top + 20
      out += `<line x1="${cx}" y1="${cy + 10}" x2="${cx}" y2="${cy - 10}" stroke="#2b3a55" stroke-width="1.4"/><path d="M${cx},${cy - 12} l4,7 l-4,-2 l-4,2 Z" fill="#2b3a55"/><text x="${cx}" y="${cy + 20}" font-size="8" text-anchor="middle" fill="#2b3a55" font-weight="700">N</text>`
    }

    if (p.scaleLabel) {
      const sx = offsetX + 10
      const sy = padOuter.top + p.h - 10
      out += `<line x1="${sx}" y1="${sy}" x2="${sx + 40}" y2="${sy}" stroke="#2b3a55" stroke-width="2"/><line x1="${sx}" y1="${sy - 3}" x2="${sx}" y2="${sy + 3}" stroke="#2b3a55" stroke-width="1.4"/><line x1="${sx + 40}" y1="${sy - 3}" x2="${sx + 40}" y2="${sy + 3}" stroke="#2b3a55" stroke-width="1.4"/><text x="${sx + 20}" y="${sy - 5}" font-size="7" text-anchor="middle" fill="#5b6884">${escapeXml(p.scaleLabel)}</text>`
    }

    return out
  }

  let body = ''
  let cursorX = padOuter.left
  for (const p of panels) {
    body += drawPanel(p, cursorX)
    cursorX += p.w + gap
  }

  return `<svg viewBox="0 0 ${totalW} ${totalH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${body}</svg>`
}

function multilineWrap(text: string, maxChars: number): string[] {
  return text.split('\n').flatMap((line) => wrapLabel(line, maxChars))
}

function renderFlowChain(data: FlowChainData, title: string): string {
  const { lanes } = data
  const boxW = 176
  const boxH = 52
  const gapX = 60
  const laneGap = 40
  const miniH = 30
  const miniGap = 8
  const pad = { top: 22, left: 20, right: 20, bottom: 16 }

  const maxNodes = Math.max(...lanes.map((l) => l.length), 1)
  const width = pad.left + maxNodes * boxW + (maxNodes - 1) * gapX + pad.right

  function laneHeight(lane: FlowNode[]): number {
    const splitSizes = lane.filter((n): n is Extract<FlowNode, { type: 'split' }> => n.type === 'split').map((n) => n.branches.length)
    const maxBranches = Math.max(1, ...splitSizes)
    return Math.max(boxH, maxBranches * miniH + (maxBranches - 1) * miniGap)
  }

  const laneHeights = lanes.map(laneHeight)
  const laneCenterYs: number[] = []
  let cursorY = pad.top
  for (const h of laneHeights) {
    laneCenterYs.push(cursorY + h / 2)
    cursorY += h + laneGap
  }
  const height = cursorY - laneGap + pad.bottom

  let body = ''
  lanes.forEach((lane, li) => {
    const cy = laneCenterYs[li]
    let x = pad.left
    lane.forEach((node, ni) => {
      if (ni > 0) {
        const prevRight = x - gapX
        body += `<line x1="${prevRight}" y1="${cy}" x2="${x}" y2="${cy}" stroke="#63A375" stroke-width="2.2" marker-end="url(#fArrow)"/>`
        if (node.arrowLabel) {
          const midX = (prevRight + x) / 2
          const lines = wrapLabel(node.arrowLabel, 22)
          body += lines
            .map((l, k) => `<text x="${midX}" y="${cy - 9 - (lines.length - 1 - k) * 11}" font-size="9.5" text-anchor="middle" fill="#5b6884">${escapeXml(l)}</text>`)
            .join('')
        }
      }
      if (node.type === 'box') {
        body += `<rect x="${x}" y="${cy - boxH / 2}" width="${boxW}" height="${boxH}" rx="10" fill="#fff" stroke="#178A5A" stroke-width="2"/>`
        const lines = multilineWrap(node.text, 20)
        const startY = cy - ((lines.length - 1) * 13) / 2 + 4
        body += lines
          .map((l, k) => `<text x="${x + boxW / 2}" y="${startY + k * 13}" font-size="11.5" text-anchor="middle" fill="#2b3a55" font-weight="600">${escapeXml(l)}</text>`)
          .join('')
      } else {
        const n = node.branches.length
        const totalH = n * miniH + (n - 1) * miniGap
        const top = cy - totalH / 2
        const stemX = x + 14
        body += `<line x1="${x}" y1="${cy}" x2="${stemX}" y2="${cy}" stroke="#63A375" stroke-width="1.6" stroke-dasharray="3,3"/>`
        node.branches.forEach((b, bi) => {
          const by = top + bi * (miniH + miniGap)
          body += `<line x1="${stemX}" y1="${cy}" x2="${stemX}" y2="${by + miniH / 2}" stroke="#63A375" stroke-width="1.6" stroke-dasharray="3,3"/>`
          body += `<line x1="${stemX}" y1="${by + miniH / 2}" x2="${stemX + 10}" y2="${by + miniH / 2}" stroke="#63A375" stroke-width="1.6" stroke-dasharray="3,3"/>`
          body += `<rect x="${stemX + 10}" y="${by}" width="${boxW - 24}" height="${miniH}" rx="8" fill="#f4f1ea" stroke="#B45309" stroke-width="1.6"/>`
          const lines = wrapLabel(b, 18)
          const sy = by + miniH / 2 - ((lines.length - 1) * 11) / 2 + 4
          body += lines
            .map((l, k) => `<text x="${stemX + 10 + (boxW - 24) / 2}" y="${sy + k * 11}" font-size="10" text-anchor="middle" fill="#2b3a55">${escapeXml(l)}</text>`)
            .join('')
        })
      }
      x += boxW + gapX
    })
  })

  const defs = `<defs><marker id="fArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#63A375"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

// Bảng màu riêng cho 2 sơ đồ Direct Response (Speaking Lesson 1) — dùng lại đúng "rose" + "ink" đã
// có sẵn trong bảng màu app (ielts.css) để nhất quán, không tự chế màu mới, và KHÔNG sao chép màu
// đỏ mận/nền hồng của sách gốc (thiết kế riêng của NXB) — chỉ giữ đúng cấu trúc/bố cục/nội dung.
const DR_ROSE = '#c9667a'
const DR_INK = '#2b3a55'
const DR_INK_SOFT = '#5b6884'
const DR_BOX = '#f4f1ea'
const DR_BORDER = 'rgba(43,58,85,0.22)'

function renderDRSteps(data: DRStepsData, title: string): string {
  const { qLabel, topLabels, answerLabel, elaborateLabel } = data
  const pad = 22
  const qW = 60
  const qH = 54
  const pillW = 150
  const pillH = 50
  const gap1 = 66
  const gap2 = 76
  const topBoxH = 44
  const topGapY = 30

  const qX = pad
  const pill1X = qX + qW + gap1
  const pill2X = pill1X + pillW + gap2
  const width = pill2X + pillW + pad
  const topY = pad
  const cy = topY + topBoxH + topGapY + qH / 2
  const height = cy + qH / 2 + pad

  const badge1X = qX + qW + gap1 / 2
  const badge2X = pill1X + pillW + gap2 / 2
  const box1W = 148
  const box2W = 190

  function topBox(cx: number, w: number, text: string): string {
    const x = cx - w / 2
    const lines = wrapLabel(text, 22)
    const lh = 13
    const startY = topY + topBoxH / 2 - ((lines.length - 1) * lh) / 2 + 4
    let s = `<rect x="${x}" y="${topY}" width="${w}" height="${topBoxH}" rx="9" fill="#fff" stroke="${DR_BORDER}" stroke-width="1.5"/>`
    s += lines.map((l, k) => `<text x="${cx}" y="${startY + k * lh}" font-size="10.5" text-anchor="middle" fill="${DR_INK}" font-weight="600">${escapeXml(l)}</text>`).join('')
    return s
  }

  function pill(x: number, text: string): string {
    const lines = wrapLabel(text, 16)
    const lh = 14
    const startY = cy - ((lines.length - 1) * lh) / 2 + 4
    let s = `<rect x="${x}" y="${cy - pillH / 2}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${DR_ROSE}"/>`
    s += lines.map((l, k) => `<text x="${x + pillW / 2}" y="${startY + k * lh}" font-size="12.5" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(l)}</text>`).join('')
    return s
  }

  let body = ''
  body += topBox(badge1X, box1W, topLabels[0])
  body += topBox(badge2X, box2W, topLabels[1])

  // đường nét đứt: từ badge lên box chú thích phía trên
  body += `<line x1="${badge1X}" y1="${cy - 17}" x2="${badge1X}" y2="${topY + topBoxH + 3}" stroke="${DR_INK_SOFT}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#drArrowV)"/>`
  body += `<line x1="${badge2X}" y1="${cy - 33}" x2="${badge2X}" y2="${topY + topBoxH + 3}" stroke="${DR_INK_SOFT}" stroke-width="1.4" stroke-dasharray="3,3" marker-end="url(#drArrowV)"/>`

  // box "?"
  body += `<rect x="${qX}" y="${cy - qH / 2}" width="${qW}" height="${qH}" rx="12" fill="${DR_INK}"/>`
  body += `<text x="${qX + qW / 2}" y="${cy + 7}" font-size="20" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(qLabel)}</text>`

  // mũi tên "?" → pill 1, badge số 1 nằm ngay trên đường mũi tên
  body += `<line x1="${qX + qW}" y1="${cy}" x2="${pill1X}" y2="${cy}" stroke="${DR_ROSE}" stroke-width="2.2" marker-end="url(#drArrow)"/>`
  body += `<circle cx="${badge1X}" cy="${cy}" r="10" fill="#fff" stroke="${DR_INK}" stroke-width="1.6"/>`
  body += `<text x="${badge1X}" y="${cy + 4}" font-size="10.5" text-anchor="middle" fill="${DR_INK}" font-weight="700">1</text>`

  body += pill(pill1X, answerLabel)

  // mũi tên pill1 → pill2, badge số 2 nằm phía trên đường mũi tên (nối bằng 1 đoạn thẳng ngắn)
  body += `<line x1="${pill1X + pillW}" y1="${cy}" x2="${pill2X}" y2="${cy}" stroke="${DR_ROSE}" stroke-width="2.2" marker-end="url(#drArrow)"/>`
  body += `<line x1="${badge2X}" y1="${cy - 15}" x2="${badge2X}" y2="${cy - 2}" stroke="${DR_INK}" stroke-width="1.4"/>`
  body += `<circle cx="${badge2X}" cy="${cy - 25}" r="10" fill="#fff" stroke="${DR_INK}" stroke-width="1.6"/>`
  body += `<text x="${badge2X}" y="${cy - 21}" font-size="10.5" text-anchor="middle" fill="${DR_INK}" font-weight="700">2</text>`

  body += pill(pill2X, elaborateLabel)

  // Marker orient="auto" luôn xoay theo trục +x cục bộ của marker khớp với hướng thật của đường vẽ
  // — mũi tên phải được vẽ "chĩa theo +x" (giống drArrow) thì mới tự xoay đúng hướng bất kể ngang
  // hay dọc; vẽ mũi tên "chĩa lên" (theo -y) như trước sẽ bị lệch 90° sau khi auto-rotate.
  const defs = `<defs><marker id="drArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_ROSE}"/></marker><marker id="drArrowV" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_INK_SOFT}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

function renderDRTypes(data: DRTypesData, title: string): string {
  const { qLabel, headerLabel, columns } = data
  const pad = 22
  const qW = 60
  const qH = 50
  const qGap = 34
  const colW = 202
  const colGap = 14
  const headerH = 36
  const titleH = 30
  const rowGap = 8

  const gridX = pad + qW + qGap
  const width = gridX + columns.length * colW + (columns.length - 1) * colGap + pad

  function rowHeight(row: DRRow): number {
    if (row.kind === 'labeled') return wrapLabel(row.label, 20).length * 12 + 6 + wrapLabel(row.text, 20).length * 12 + 14
    const lines = wrapLabel(row.text, 20).length
    return Math.max(34, lines * 13 + 16)
  }
  function colHeight(col: DRColumn): number {
    return titleH + rowGap + col.rows.reduce((sum, r) => sum + rowHeight(r) + rowGap, 0)
  }
  const bodyH = Math.max(...columns.map(colHeight))
  const headerY = pad
  const gridY = headerY + headerH + 14
  const height = gridY + bodyH + pad

  let body = ''

  // header đỏ (rose) trải hết chiều rộng khu 3 cột
  const headerX = gridX
  const headerW = columns.length * colW + (columns.length - 1) * colGap
  body += `<rect x="${headerX}" y="${headerY}" width="${headerW}" height="${headerH}" rx="10" fill="${DR_ROSE}"/>`
  body += `<text x="${headerX + headerW / 2}" y="${headerY + headerH / 2 + 5}" font-size="13" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(headerLabel)}</text>`

  // box "?" bên trái, mũi tên chỉ vào header
  const qY = headerY + headerH / 2 - qH / 2
  body += `<rect x="${pad}" y="${qY}" width="${qW}" height="${qH}" rx="12" fill="${DR_INK}"/>`
  body += `<text x="${pad + qW / 2}" y="${qY + qH / 2 + 6}" font-size="18" text-anchor="middle" fill="#fff" font-weight="700">${escapeXml(qLabel)}</text>`
  body += `<line x1="${pad + qW}" y1="${headerY + headerH / 2}" x2="${headerX}" y2="${headerY + headerH / 2}" stroke="${DR_ROSE}" stroke-width="2.2" marker-end="url(#drArrow2)"/>`

  columns.forEach((col, ci) => {
    const cx = gridX + ci * (colW + colGap)
    // tiêu đề cột: nền trắng, viền + chữ rose
    body += `<rect x="${cx}" y="${gridY}" width="${colW}" height="${titleH}" rx="${titleH / 2}" fill="#fff" stroke="${DR_ROSE}" stroke-width="1.8"/>`
    body += `<text x="${cx + colW / 2}" y="${gridY + titleH / 2 + 4}" font-size="11.5" text-anchor="middle" fill="${DR_ROSE}" font-weight="700">${escapeXml(col.title)}</text>`

    let ry = gridY + titleH + rowGap
    for (const row of col.rows) {
      const h = rowHeight(row)
      if (row.kind === 'desc' || row.kind === 'plain') {
        const lines = wrapLabel(row.text, 20)
        const lh = 12.5
        const startY = ry + h / 2 - ((lines.length - 1) * lh) / 2 + 4
        body += `<rect x="${cx}" y="${ry}" width="${colW}" height="${h}" rx="8" fill="${DR_BOX}"/>`
        body += lines
          .map((l, k) => `<text x="${cx + colW / 2}" y="${startY + k * lh}" font-size="10" text-anchor="middle" fill="${row.kind === 'desc' ? DR_INK_SOFT : DR_INK}">${escapeXml(l)}</text>`)
          .join('')
      } else if (row.kind === 'labeled') {
        const labelLines = wrapLabel(row.label, 20)
        const boxLines = wrapLabel(row.text, 20)
        const labelH = labelLines.length * 12 + 4
        const boxH = h - labelH - 6
        body += labelLines
          .map((l, k) => `<text x="${cx}" y="${ry + 10 + k * 12}" font-size="9.5" text-anchor="start" fill="${DR_INK}" font-weight="600">${escapeXml(l)}</text>`)
          .join('')
        const boxY = ry + labelH + 6
        const startY = boxY + boxH / 2 - ((boxLines.length - 1) * 12) / 2 + 4
        body += `<rect x="${cx}" y="${boxY}" width="${colW}" height="${boxH}" rx="8" fill="${DR_BOX}"/>`
        body += boxLines
          .map((l, k) => `<text x="${cx + colW / 2}" y="${startY + k * 12}" font-size="9.5" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`)
          .join('')
      } else {
        const icon = row.icon === 'up' ? '↑' : '↓'
        const iconColor = row.icon === 'up' ? DR_ROSE : DR_INK_SOFT
        const lines = wrapLabel(row.text, 17)
        const lh = 12.5
        const startY = ry + h / 2 - ((lines.length - 1) * lh) / 2 + 4
        body += `<rect x="${cx}" y="${ry}" width="${colW}" height="${h}" rx="8" fill="${DR_BOX}"/>`
        body += `<text x="${cx + 16}" y="${ry + h / 2 + 5}" font-size="14" text-anchor="middle" fill="${iconColor}" font-weight="700">${icon}</text>`
        body += lines
          .map((l, k) => `<text x="${cx + 16 + (colW - 16) / 2}" y="${startY + k * lh}" font-size="10" text-anchor="middle" fill="${DR_INK}">${escapeXml(l)}</text>`)
          .join('')
      }
      ry += h + rowGap
    }
  })

  const defs = `<defs><marker id="drArrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${DR_ROSE}"/></marker></defs>`
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(title)}" style="width:100%;height:auto;display:block;">${defs}${body}</svg>`
}

export const DataChart = Node.create({
  name: 'dataChart',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      chartType: { default: 'line' },
      title: { default: '' },
      data: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-chart]',
        getAttrs: (el) => {
          const e = el as HTMLElement
          return {
            chartType: e.getAttribute('data-chart-type') || 'line',
            title: e.getAttribute('data-title') || '',
            data: e.getAttribute('data-payload') || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const { chartType, title, data } = node.attrs
    const parsed = decodeData(data)
    let svg = ''
    if (parsed) {
      if (chartType === 'bar') svg = renderBarChart(parsed as LineBarData, title)
      else if (chartType === 'barH') svg = renderHBarChart(parsed as LineBarData, title)
      else if (chartType === 'pieDouble') svg = renderPieDouble(parsed as PieData, title)
      else if (chartType === 'lineDual') svg = renderDualLineChart(parsed as DualAxisData, title)
      else if (chartType === 'processLinear') svg = renderProcessLinear(parsed as ProcessLinearData, title)
      else if (chartType === 'processCircular') svg = renderProcessCircular(parsed as ProcessCircularData, title)
      else if (chartType === 'mapDiagram') svg = renderMapDiagram(parsed as MapDiagramData, title)
      else if (chartType === 'flowChain') svg = renderFlowChain(parsed as FlowChainData, title)
      else if (chartType === 'drSteps') svg = renderDRSteps(parsed as DRStepsData, title)
      else if (chartType === 'drTypes') svg = renderDRTypes(parsed as DRTypesData, title)
      else svg = renderLineChart(parsed as LineBarData, title)
    }
    // renderHTML's array format chỉ chèn được text (bị escape) hoặc node con, không chèn được HTML
    // thô — nên nhúng SVG dưới dạng data URI trong <img>, trình duyệt tự vẽ ra, không cần NodeView.
    const src = svg ? `data:image/svg+xml;base64,${base64Encode(svg)}` : ''

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'ih-chart',
        'data-chart': '',
        'data-chart-type': chartType,
        'data-title': title,
        'data-payload': data,
      }),
      ['p', { class: 'ih-chart-title' }, title],
      ['img', { class: 'ih-chart-svg', src, alt: title }],
    ]
  },
})

export { encodeData }
