'use client'

import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'

// Khác AnswerBlockView (bấm đâu cũng đóng/mở): bài phân tích dài, người đọc hay bôi đen/bấm bên trong — nên chỉ
// thanh tiêu đề mới đóng/mở. Đang edit thì luôn mở.
export function SentenceAnalysisView({ node, editor }: NodeViewProps) {
  const [open, setOpen] = useState(false)
  const show = editor.isEditable || open
  const { label, sentence } = node.attrs as { label: string; sentence: string }

  return (
    <NodeViewWrapper className={`ih-sa${show ? ' ih-sa-open' : ''}`} data-sentence-analysis>
      <button
        type="button"
        className="ih-sa-head"
        contentEditable={false}
        aria-expanded={show}
        onClick={() => {
          if (!editor.isEditable) setOpen((v) => !v)
        }}
      >
        <span className="ih-sa-label">{label}</span>
        <span className="ih-sa-sentence">{sentence}</span>
        <span className="ih-sa-chevron" aria-hidden>
          {show ? '▴' : '▾'}
        </span>
      </button>
      <NodeViewContent className={`ih-sa-body${show ? '' : ' ih-sa-hidden'}`} />
    </NodeViewWrapper>
  )
}
