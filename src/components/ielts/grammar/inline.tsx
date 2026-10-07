import { Fragment, type ReactNode } from 'react'

// Nội dung ngữ pháp chỉ dùng **đậm** — tách thành <strong> thay vì dangerouslySetInnerHTML.
export function bold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>,
  )
}
