'use client'

import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'

// Ẩn mặc định ở chế độ xem để người đọc tự thử trả lời Đề bài trước khi bấm xem đáp án; khi đang
// edit thì luôn hiện (editor.isEditable) để còn sửa được nội dung bên trong. Không dùng nút riêng —
// bấm bất kỳ đâu trong khung là toggle; chỉ bỏ qua khi người dùng đang bôi đen chọn chữ (drag để
// copy câu trả lời) để không bị đóng khung ngay sau khi vừa chọn xong.
export function AnswerBlockView({ editor }: NodeViewProps) {
  const [visible, setVisible] = useState(false)
  const show = editor.isEditable || visible

  function handleClick() {
    if (editor.isEditable) return
    if ((window.getSelection()?.toString().length ?? 0) > 0) return
    setVisible((v) => !v)
  }

  return (
    <NodeViewWrapper className={`ih-answer-block${show ? ' ih-answer-open' : ''}`} data-answer-block onClick={handleClick}>
      {!show && <p className="ih-answer-placeholder">Bấm để xem câu trả lời mẫu</p>}
      <NodeViewContent className={`ih-answer-content${show ? '' : ' ih-answer-hidden'}`} />
    </NodeViewWrapper>
  )
}
