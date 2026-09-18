import { Node, mergeAttributes } from '@tiptap/core'

// Bọc chung 1 đoạn văn/câu đề (có sẵn <mark> tô vàng đúng phần mang main idea) + 1 answerBlock ngay
// sau nó — mục đích: khi answerBlock được bấm mở (AnswerBlockView tự thêm class "ih-answer-open"),
// các <mark> nằm TRONG đoạn văn ở TRÊN (anh em/sibling, không phải con của answerBlock) cũng tự hiện
// màu vàng theo — dùng CSS :has() để "nhìn xuống" trạng thái mở của answerBlock lồng bên trong rồi
// đổi style cho mọi <mark> trong cùng khối (xem .ih-mi-check trong ielts.css). Không cần NodeView
// riêng (như AnswerBlock) vì bản thân khối này không có tương tác — chỉ là 1 lớp bọc tĩnh để CSS
// scope theo, y hệt Callout.
export const MainIdeaCheck = Node.create({
  name: 'mainIdeaCheck',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-mi-check]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'ih-mi-check', 'data-mi-check': '' }), 0]
  },
})
