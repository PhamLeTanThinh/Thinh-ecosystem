'use client'

import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react'

export function ExampleBlockView({ node }: NodeViewProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard
      .writeText(node.textContent)
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1200)
      })
      .catch(() => {})
  }

  return (
    <NodeViewWrapper className="ih-example-block" data-example-block>
      <button type="button" className="ih-example-copy" contentEditable={false} onClick={handleCopy}>
        {copied ? 'Đã chép' : 'Sao chép'}
      </button>
      <NodeViewContent className="ih-example-content" />
    </NodeViewWrapper>
  )
}
