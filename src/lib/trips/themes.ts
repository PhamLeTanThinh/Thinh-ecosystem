// Theme riêng cho từng chuyến (/trips) — đổi màu, font, hoạ tiết nền (CSS `.tp-theme-<key>` trong trips.css) và
// cách gọi tên (bảng dưới). Thêm theme mới: thêm 1 mục ở đây + 1 khối `.tp-theme-<key>` trong trips.css.

export type TripThemeKey = 'flight' | 'road' | 'trek' | 'beach'

export interface TripTheme {
  key: TripThemeKey
  name: string
  emoji: string
  blurb: string
  swatch: [string, string, string] // màu xem trước ở ô chọn theme: đậm, chính, nhấn
  tag: string // chữ trên dải đầu vé
  vehicle: string // phương tiện chạy trên đường tiến độ
  destination: string // điểm đích của đường tiến độ
  dateLabels: [string, string] // mốc ngày đi / về (chỉ với loại "Chuyến đi")
  people: string // nhãn số người trên vé
  person: string // nhãn trên thẻ từng thành viên
  addPeople: string // placeholder ô thêm thành viên
  leftGroup: string // tiêu đề nhóm người đã rời
  log: string // tiêu đề lịch trình thu chi
  upcoming: string // tiêu đề nhóm khoản sắp tới
  leg: string // "Chặng 01" ở tab chia tiền
  stamp: string // dấu mộc khi đã đóng quỹ
  settled: string // dòng phụ khi mọi người đã hoà
  emptyLog: string // icon lịch trình trống
}

export const TRIP_THEMES: TripTheme[] = [
  {
    key: 'flight',
    name: 'Bay',
    emoji: '✈️',
    blurb: 'Boarding pass, đường bay',
    swatch: ['#13314a', '#0f6e78', '#f2a33a'],
    tag: 'Boarding pass',
    vehicle: '✈️',
    destination: '📍',
    dateLabels: ['Khởi hành', 'Trở về'],
    people: 'Hành khách',
    person: 'Hành khách',
    addPeople: 'Thêm hành khách (nhiều tên cách nhau dấu phẩy)',
    leftGroup: 'Đã rời đoàn',
    log: '🧭 Lịch trình thu chi',
    upcoming: '⏳ Sắp tới',
    leg: 'Chặng bay',
    stamp: 'ARRIVED',
    settled: 'Không ai nợ ai — hạ cánh an toàn.',
    emptyLog: '🗺️',
  },
  {
    key: 'road',
    name: 'Phượt xe',
    emoji: '🚗',
    blurb: 'Road trip, cung đường nhựa',
    swatch: ['#22252b', '#c2410c', '#facc15'],
    tag: 'Road trip',
    vehicle: '🚗',
    destination: '🏁',
    dateLabels: ['Xuất phát', 'Về nhà'],
    people: 'Ghế xe',
    person: 'Bạn đồng hành',
    addPeople: 'Thêm người lên xe (nhiều tên cách nhau dấu phẩy)',
    leftGroup: 'Đã xuống xe',
    log: '🛣️ Nhật ký cung đường',
    upcoming: '⛽ Sắp tới',
    leg: 'Trạm dừng',
    stamp: 'FINISH',
    settled: 'Không ai nợ ai — về tới nhà rồi!',
    emptyLog: '🛣️',
  },
  {
    key: 'trek',
    name: 'Trekking',
    emoji: '🥾',
    blurb: 'Lên rừng, leo núi, cắm trại',
    swatch: ['#1f3a2b', '#2f6b3f', '#d9a441'],
    tag: 'Trail permit',
    vehicle: '🥾',
    destination: '⛺',
    dateLabels: ['Vào rừng', 'Xuống núi'],
    people: 'Thành viên đoàn',
    person: 'Trekker',
    addPeople: 'Thêm người vào đoàn (nhiều tên cách nhau dấu phẩy)',
    leftGroup: 'Đã xuống núi trước',
    log: '🗺️ Nhật ký trek',
    upcoming: '🎒 Sắp tới',
    leg: 'Lối mòn',
    stamp: 'SUMMIT',
    settled: 'Không ai nợ ai — chinh phục xong đỉnh!',
    emptyLog: '🏕️',
  },
  {
    key: 'beach',
    name: 'Biển',
    emoji: '🏖️',
    blurb: 'Nắng, cát, sóng biển',
    swatch: ['#0b4f6c', '#0891b2', '#fb923c'],
    tag: 'Beach pass',
    vehicle: '⛵',
    destination: '🏝️',
    dateLabels: ['Ra biển', 'Về bờ'],
    people: 'Thuỷ thủ',
    person: 'Thuỷ thủ',
    addPeople: 'Thêm thuỷ thủ (nhiều tên cách nhau dấu phẩy)',
    leftGroup: 'Đã lên bờ',
    log: '🌊 Nhật ký biển',
    upcoming: '🐚 Sắp tới',
    leg: 'Con sóng',
    stamp: 'ALOHA',
    settled: 'Không ai nợ ai — chill thôi!',
    emptyLog: '🐚',
  },
]

export const DEFAULT_THEME: TripThemeKey = 'flight'

export function isTripTheme(v: unknown): v is TripThemeKey {
  return TRIP_THEMES.some((t) => t.key === v)
}

export function themeOf(key: string | null | undefined): TripTheme {
  return TRIP_THEMES.find((t) => t.key === key) ?? TRIP_THEMES[0]
}
