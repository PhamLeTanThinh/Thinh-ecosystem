import { Node, mergeAttributes } from '@tiptap/core'

// Khối mở đầu 1 tiêu chí (TR/CC/LR/GRA) kiểu "chapter opener" biên tập: số thứ tự lớn + mã viết
// tắt ở góc, rồi tới tiêu đề to + câu hỏi gợi mở. Số/mã lấy qua CSS ::before/::after attr(), 2 khối
// con bên trong (content: 'block+') là tiêu đề + câu hỏi, gõ/sửa bình thường như mọi block khác.
export const SectionHero = Node.create({
  name: 'sectionHero',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      index: { default: '01' },
      acronym: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-section-hero]',
        getAttrs: (el) => ({
          index: (el as HTMLElement).getAttribute('data-index'),
          acronym: (el as HTMLElement).getAttribute('data-acronym'),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'ih-hero',
        'data-section-hero': '',
        'data-index': node.attrs.index,
        'data-acronym': node.attrs.acronym,
      }),
      0,
    ]
  },
})
