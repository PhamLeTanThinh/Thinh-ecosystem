import { Node, mergeAttributes } from '@tiptap/core'

export type CalloutVariant = 'tip' | 'mistake' | 'prompt'

// Callout tĩnh (không cần tương tác) — style khác biệt hoàn toàn qua CSS attribute selector
// `[data-callout]`, icon 💡/⚠️ chèn bằng ::before nên không cần custom NodeView.
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    // rendered: false — xem giải thích trong SectionHero.ts (renderHTML tự đổ ra data-callout, không
    // tắt auto-render mặc định thì mergeAttributes() chèn thêm 1 attr variant="…" trùng lặp — đây
    // chính là lý do nội dung tay từng viết có `variant=""` thừa trên mọi callout).
    return {
      variant: { default: 'tip' as CalloutVariant, rendered: false },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-callout]', getAttrs: (el) => ({ variant: (el as HTMLElement).getAttribute('data-callout') }) }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'ih-callout', 'data-callout': node.attrs.variant }), 0]
  },
})
