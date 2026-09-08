'use client'

import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'

// Dòng gợi ý ngắn trong luồng đọc chính — nội dung thật (136 câu hỏi + câu trả lời mẫu) không hiện
// ở đây, mở trong popup qua sự kiện window (NodeView và PageEditor là 2 cây React tách biệt, không
// truyền prop/state trực tiếp được, nên PageEditor.tsx nghe sự kiện này để mở modal chung 1 chỗ).
export function QuestionBankView({ node }: NodeViewProps) {
  const { title, data } = node.attrs

  function open() {
    window.dispatchEvent(new CustomEvent('ih-open-question-bank', { detail: { title, data } }))
  }

  return (
    <NodeViewWrapper className="ih-question-bank" data-question-bank onClick={open}>
      <span className="ih-question-bank-icon" aria-hidden="true">
        📚
      </span>
      <div className="ih-question-bank-text">
        <p className="ih-question-bank-title">{title || 'Ngân hàng câu hỏi luyện tập'}</p>
        <p className="ih-question-bank-hint">Bấm để mở, hoặc chọn mục này ở menu “Đang đọc” bên phải</p>
      </div>
    </NodeViewWrapper>
  )
}
