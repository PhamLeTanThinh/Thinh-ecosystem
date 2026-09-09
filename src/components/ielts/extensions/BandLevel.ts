import { Node, mergeAttributes } from '@tiptap/core'

// Band description — thay cho bảng xám lặp lại nhàm chán: mỗi band là 1 "thẻ" màu riêng
// (đỏ cam thấp -> xanh lá cao), số Band hiện qua CSS ::before đọc trực tiếp attribute `data-band`.
export const BandLevel = Node.create({
  name: 'bandLevel',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    // rendered: false — xem giải thích trong SectionHero.ts (renderHTML tự đổ ra data-band, không
    // tắt auto-render mặc định thì mergeAttributes() chèn thêm 1 attr band="…" trùng lặp).
    return {
      band: { default: '7', rendered: false },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-band]', getAttrs: (el) => ({ band: (el as HTMLElement).getAttribute('data-band') }) }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'ih-band', 'data-band': node.attrs.band }), 0]
  },
})
