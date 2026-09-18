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
    // rendered: false — renderHTML() bên dưới tự đổ ra data-index/data-acronym; không tắt auto-render
    // mặc định thì mergeAttributes() chèn thêm 1 bộ index="…" acronym="…" trùng lặp mỗi khi
    // editor.getHTML() chạy lại (vd bấm "Chỉnh sửa" rồi "Xong" dù không sửa gì).
    return {
      index: { default: '01', rendered: false },
      acronym: { default: '', rendered: false },
      // wide — tuỳ chọn bỏ giới hạn max-width 460px của câu hook (2nd child, xem ielts.css) cho hero
      // nào câu hook dài/nhiều thông tin hơn bình thường. Mặc định false để không đổi giao diện các
      // hero đã có sẵn ở mọi bài học khác — chỉ bật khi tác giả chủ động cần.
      wide: { default: false, rendered: false },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-section-hero]',
        getAttrs: (el) => ({
          index: (el as HTMLElement).getAttribute('data-index'),
          acronym: (el as HTMLElement).getAttribute('data-acronym'),
          wide: (el as HTMLElement).hasAttribute('data-wide'),
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
        ...(node.attrs.wide ? { 'data-wide': '' } : {}),
      }),
      0,
    ]
  },
})
