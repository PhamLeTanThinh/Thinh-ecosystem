import { Node, mergeAttributes } from '@tiptap/core'

// Sơ đồ cây tĩnh (root → chẻ 2 nhánh → hội tụ) — toàn bộ nhãn là attribute (giống SectionHero),
// không phải nội dung có thể gõ trực tiếp, vì hình dạng cố định (1 gốc, 2 nhánh, 1 đáy). Danh sách
// bước trong mỗi nhánh mã hoá dạng chuỗi ngăn bởi "|" để tránh cần nhiều node con lồng nhau.
//
// Mỗi nhãn (root/step/bottom) bắt đầu bằng 1+ số thứ tự, cách nhau dấu phẩy, số nào là bước MẤU
// CHỐT (2, 3, 8, 13, 14) thì thêm "★" ngay sau số — ví dụ "3★ Topic sentence" hoặc "13★,14★ Kết
// bài". Số được tách ra render thành badge tròn riêng (số mấu chốt tô đậm màu rose) thay vì ký tự
// Unicode khoanh tròn (①②③…) — vừa dễ style rõ ràng hơn, vừa tránh rủi ro fallback font đã gặp.
function parseNumberedLabel(raw: string): { badges: { num: string; key: boolean }[]; text: string } {
  const m = raw.match(/^([\d,★]+)\s+(.*)$/)
  if (!m) return { badges: [], text: raw }
  const badges = m[1].split(',').map((tok) => {
    const key = tok.endsWith('★')
    return { num: key ? tok.slice(0, -1) : tok, key }
  })
  return { badges, text: m[2] }
}

function badgeSpans(badges: { num: string; key: boolean }[]) {
  return badges.map((b) => ['span', { class: 'ih-tree-badge' + (b.key ? ' ih-tree-badge-key' : '') }, b.num])
}

export const TreeOutline = Node.create({
  name: 'treeOutline',
  group: 'block',
  atom: true,

  addAttributes() {
    // rendered: false — xem giải thích trong SectionHero.ts (renderHTML tự đổ ra data-root/data-left-label/…,
    // không tắt auto-render mặc định thì mergeAttributes() chèn thêm 1 bộ attr trùng lặp).
    return {
      root: { default: '', rendered: false },
      leftLabel: { default: '', rendered: false },
      rightLabel: { default: '', rendered: false },
      leftSteps: { default: '', rendered: false },
      rightSteps: { default: '', rendered: false },
      bottom: { default: '', rendered: false },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-tree-outline]',
        getAttrs: (el) => {
          const e = el as HTMLElement
          return {
            root: e.getAttribute('data-root') || '',
            leftLabel: e.getAttribute('data-left-label') || '',
            rightLabel: e.getAttribute('data-right-label') || '',
            leftSteps: e.getAttribute('data-left-steps') || '',
            rightSteps: e.getAttribute('data-right-steps') || '',
            bottom: e.getAttribute('data-bottom') || '',
          }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const { root, leftLabel, rightLabel, leftSteps, rightSteps, bottom } = node.attrs
    const left: string[] = leftSteps ? leftSteps.split('|') : []
    const right: string[] = rightSteps ? rightSteps.split('|') : []

    const box = (raw: string) => {
      const { badges, text } = parseNumberedLabel(raw)
      return ['div', { class: 'ih-tree-box' }, ...badgeSpans(badges), ['span', { class: 'ih-tree-box-text' }, text]]
    }

    const step = (raw: string) => {
      const { badges, text } = parseNumberedLabel(raw)
      return ['p', { class: 'ih-tree-step' }, ...badgeSpans(badges), ['span', {}, text]]
    }

    const branch = (label: string, steps: string[]) => [
      'div',
      { class: 'ih-tree-branch' },
      ['div', { class: 'ih-tree-branch-connector' }],
      ['div', { class: 'ih-tree-branch-box' }, ['p', { class: 'ih-tree-branch-label' }, label], ...steps.map(step)],
      ['div', { class: 'ih-tree-branch-connector' }],
    ]

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'ih-tree',
        'data-tree-outline': '',
        'data-root': root,
        'data-left-label': leftLabel,
        'data-right-label': rightLabel,
        'data-left-steps': leftSteps,
        'data-right-steps': rightSteps,
        'data-bottom': bottom,
      }),
      box(root),
      ['div', { class: 'ih-tree-vline' }],
      ['div', { class: 'ih-tree-bracket' }],
      ['div', { class: 'ih-tree-branches' }, branch(leftLabel, left), branch(rightLabel, right)],
      ['div', { class: 'ih-tree-bracket' }],
      ['div', { class: 'ih-tree-vline' }],
      box(bottom),
    ]
  },
})
