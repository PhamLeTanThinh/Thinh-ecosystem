'use client'

import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'

// Ẩn mặc định ở chế độ xem để người đọc tự thử trả lời Đề bài trước khi bấm xem đáp án; khi đang
// edit thì luôn hiện (editor.isEditable) để còn sửa được nội dung bên trong.
export function AnswerBlockView({ editor }: NodeViewProps) {
  const [visible, setVisible] = useState(false)
  const show = editor.isEditable || visible

  return (
    <NodeViewWrapper className={`ih-answer-block${show ? ' ih-answer-open' : ''}`} data-answer-block>
      <button type="button" className="ih-answer-toggle" contentEditable={false} onClick={() => setVisible((v) => !v)}>
        <span className={`ih-answer-toggle-caret${show ? ' open' : ''}`} aria-hidden="true" />
        {show ? 'Ẩn bài làm' : 'Xem bài làm'}
      </button>
      <NodeViewContent className={`ih-answer-content${show ? '' : ' ih-answer-hidden'}`} />
    </NodeViewWrapper>
  )
}
