import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ExampleBlockView } from './ExampleBlockView'

// Block "Ví dụ" — cần nút Sao chép tương tác nên dùng React NodeView (khác Callout tĩnh).
export const ExampleBlock = Node.create({
  name: 'exampleBlock',
  group: 'block',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-example-block]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'ih-example-block', 'data-example-block': '' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExampleBlockView)
  },
})
