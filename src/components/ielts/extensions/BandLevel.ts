import { Node, mergeAttributes } from '@tiptap/core'

// Band description — thay cho bảng xám lặp lại nhàm chán: mỗi band là 1 "thẻ" màu riêng
// (đỏ cam thấp -> xanh lá cao), số Band hiện qua CSS ::before đọc trực tiếp attribute `data-band`.
export const BandLevel = Node.create({
  name: 'bandLevel',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      band: { default: '7' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-band]', getAttrs: (el) => ({ band: (el as HTMLElement).getAttribute('data-band') }) }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'ih-band', 'data-band': node.attrs.band }), 0]
  },
})
