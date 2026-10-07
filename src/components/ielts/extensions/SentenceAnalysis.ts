import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { SentenceAnalysisView } from './SentenceAnalysisView'

// Khối "Phân tích 1 câu" (xương sống câu, chặt cụm, ngữ pháp, từ vựng, dịch, logic…) gắn ngay sau đoạn văn chứa câu
// đó. Bài phân tích rất dài nên THU GỌN mặc định ở chế độ xem — chỉ hiện mã câu (data-label, vd "A1") + câu gốc
// (data-sentence) ở thanh tiêu đề, bấm thanh tiêu đề mới mở. Đang edit thì luôn mở để sửa được nội dung bên trong.
export const SentenceAnalysis = Node.create({
  name: 'sentenceAnalysis',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      label: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-label') ?? '',
        renderHTML: (attrs) => ({ 'data-label': attrs.label }),
      },
      sentence: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-sentence') ?? '',
        renderHTML: (attrs) => ({ 'data-sentence': attrs.sentence }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-sentence-analysis]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'ih-sa', 'data-sentence-analysis': '' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SentenceAnalysisView)
  },
})
