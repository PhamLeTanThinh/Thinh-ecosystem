import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AnswerBlockView } from './AnswerBlockView'

// Khối "Bài làm" trong các mục Practice — ẩn mặc định ở chế độ xem (trừ lúc đang edit) kèm nút bấm
// để hiện, giúp người đọc tự thử trả lời Đề bài trước khi xem đáp án thay vì thấy ngay.
export const AnswerBlock = Node.create({
  name: 'answerBlock',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-answer-block]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'ih-answer-block', 'data-answer-block': '' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(AnswerBlockView)
  },
})
