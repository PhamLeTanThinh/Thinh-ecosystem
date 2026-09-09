import { Node, mergeAttributes } from '@tiptap/core'

// Ghi chú lề kiểu "examiner's note" — đường kẻ dọc như dấu ngoặc "┌...└" (vẽ bằng CSS, không dùng
// ký tự Unicode vẽ khung vì không co giãn tốt), có nhãn ở trên và số tham chiếu nhỏ ở dưới.
export const MarginNote = Node.create({
  name: 'marginNote',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    // rendered: false — xem giải thích trong SectionHero.ts (renderHTML tự đổ ra data-label/data-ref,
    // không tắt auto-render mặc định thì mergeAttributes() chèn thêm 1 bộ attr trùng lặp).
    return {
      label: { default: "examiner's note", rendered: false },
      ref: { default: '', rendered: false },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-margin-note]',
        getAttrs: (el) => ({
          label: (el as HTMLElement).getAttribute('data-label'),
          ref: (el as HTMLElement).getAttribute('data-ref'),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'ih-margin-note',
        'data-margin-note': '',
        'data-label': node.attrs.label,
        'data-ref': node.attrs.ref,
      }),
      0,
    ]
  },
})
