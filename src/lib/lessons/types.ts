// Bài học dạng đọc (LessonShell + LessonArticle) — soạn bằng file Markdown rồi parse sẵn ở server
// (lib/lessons/parseLessonMd.ts) thành dữ liệu thuần, truyền xuống client component.

export interface LessonTerm {
  term: string // tên thuật ngữ, giữ nguyên tiếng Anh — cũng là khoá tra cứu ([[term]] trong bài)
  full?: string // tên đầy đủ nếu term là viết tắt, vd SGD → Stochastic Gradient Descent
  explain: string
}

export type LessonBlock =
  | { t: 'p'; text: string }
  | { t: 'h3'; text: string }
  // levels[i] = độ thụt lề của mục i (0 = cấp ngoài cùng) — danh sách lồng nhau
  | { t: 'ul'; items: string[]; levels: number[] }
  | { t: 'ol'; items: string[]; levels: number[] }
  | { t: 'code'; lang?: string; code: string }
  | { t: 'table'; head: string[]; rows: string[][] }
  // Hình minh hoạ: ![chú thích](/đường/dẫn.webp =RỘNGxCAO) — kích thước thật để giữ chỗ, tránh trang nhảy khi ảnh tải xong
  | { t: 'img'; src: string; caption: string; width?: number; height?: number }
  // Đồ thị động: !viz[chú thích](tên) — tên tra trong components/lessons/viz/registry.tsx
  | { t: 'viz'; name: string; caption: string }
  // Khối công thức $$...$$ — HTML KaTeX đã render sẵn ở server
  | { t: 'math'; html: string }
  // Hộp nổi bật: ví dụ tính tay, hình dung đời thường, mẹo, cảnh báo, công thức
  | { t: 'box'; kind: LessonBoxKind; title?: string; blocks: LessonBlock[] }

export type LessonBoxKind = 'example' | 'analogy' | 'tip' | 'warn' | 'formula'

export interface LessonSection {
  id: string
  heading: string
  blocks: LessonBlock[]
}

// Thông tin gọn của 1 bài cho lưới + sidebar (không kèm nội dung — trang bài chỉ nạp nội dung bài đang xem)
export type LessonMeta = Pick<Lesson, 'slug' | 'title' | 'short' | 'icon' | 'summary' | 'minutes'>

// 1 phần của khoá học trên lưới bài — gồm các bài từ `from` tới trước `from` của phần kế tiếp
export interface LessonGroup {
  title: string
  note?: string
  from: number
}

export interface Lesson {
  slug: string // phần cuối URL của bài, vd "linear-regression"
  title: string
  short: string // tên ngắn cho lưới bài + sidebar
  icon: string
  summary: string
  goals: string[]
  sections: LessonSection[]
  takeaways: string[]
  // Thuật ngữ khai báo trong bài + thuật ngữ bài này nhắc tới ([[...]]) nhưng khai báo ở bài khác
  terms: LessonTerm[]
  minutes: number // thời gian đọc ước tính
}
