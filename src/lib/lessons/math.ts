import katex from 'katex'

// Công thức toán trong bài học: viết LaTeX trong Markdown — `$...$` trong câu, `$$...$$` thành khối riêng.
// Render sẵn bằng KaTeX lúc parse (ở server, lúc build) nên trình duyệt chỉ cần CSS/font của KaTeX.
// HTML của công thức trong câu được gói giữa 2 ký tự đánh dấu (vùng Private Use của Unicode, không bao giờ
// xuất hiện trong nội dung) để LessonArticle nhận ra và chèn nguyên khối HTML.
export const MATH_OPEN = ''
export const MATH_CLOSE = ''

export function renderMath(tex: string, display: boolean): string {
  return katex.renderToString(tex.trim(), { displayMode: display, throwOnError: false, strict: 'ignore' })
}

// Thay `$...$` bằng HTML đã render — bỏ qua phần nằm trong `code`
export function mathify(text: string): string {
  return text
    .split(/(`[^`]+`)/)
    .map((part) => (part.startsWith('`') ? part : part.replace(/\$([^$\n]+?)\$/g, (_, tex: string) => MATH_OPEN + renderMath(tex, false) + MATH_CLOSE)))
    .join('')
}
