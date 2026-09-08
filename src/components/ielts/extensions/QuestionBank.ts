import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { QuestionBankView } from './QuestionBankView'

// Ngân hàng câu hỏi luyện tập (vd Small Practice 5) — quá dài để nhét thẳng vào luồng đọc chính,
// nên tách thành 1 node riêng: hiện 1 dòng gợi ý ngắn trong bài, còn nội dung đầy đủ (câu hỏi +
// câu trả lời mẫu, ẩn/hiện từng câu) mở trong popup — trigger chính đặt ở menu "Đang đọc" bên phải
// (PageEditor.tsx quét node này khi build mục lục), bấm thẳng vào dòng gợi ý trong bài cũng mở được.
// Dữ liệu mã hoá base64(JSON) giống DataChart, tránh escape dấu ngoặc kép trong thuộc tính HTML.
export const QuestionBank = Node.create({
  name: 'questionBank',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      title: { default: '' },
      data: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-question-bank]',
        getAttrs: (el) => {
          const e = el as HTMLElement
          return {
            title: e.getAttribute('data-title') || '',
            data: e.getAttribute('data-payload') || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const { title, data } = node.attrs
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'ih-question-bank',
        'data-question-bank': '',
        'data-title': title,
        'data-payload': data,
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(QuestionBankView)
  },
})
