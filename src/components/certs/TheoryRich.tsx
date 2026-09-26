import type { ReactNode } from 'react'
import type { TheoryBlock } from '@/lib/certs/ccaf-theory'

// Inline: **đậm** và `code`. Không dùng dangerouslySetInnerHTML — nội dung được tách thành phần tử React.
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let i = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) out.push(<strong key={i++} className="font-semibold text-text">{tok.slice(2, -2)}</strong>)
    else out.push(<code key={i++} className="rounded bg-card-soft px-1.5 py-0.5 font-mono text-[0.85em] text-plum">{tok.slice(1, -1)}</code>)
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const TONE = {
  tip: { icon: '💡', box: 'border-sky-200 bg-sky-50', title: 'text-sky-800' },
  warn: { icon: '⚠️', box: 'border-gold/30 bg-gold/5', title: 'text-gold' },
  exam: { icon: '🎯', box: 'border-plum/20 bg-plum-soft', title: 'text-plum' },
} as const

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function TheoryBlocks({ blocks }: { blocks: TheoryBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h':
            return (
              <h2 key={i} id={slugify(b.text)} className="mt-6 scroll-mt-6 border-b border-border pb-2 text-lg font-bold first:mt-0">
                {b.text}
              </h2>
            )
          case 'p':
            return <p key={i} className="leading-relaxed">{inline(b.text)}</p>
          case 'list': {
            const Tag = b.ordered ? 'ol' : 'ul'
            return (
              <Tag key={i} className={`flex flex-col gap-2 pl-5 leading-relaxed ${b.ordered ? 'list-decimal' : 'list-disc'} marker:text-plum`}>
                {b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}
              </Tag>
            )
          }
          case 'table':
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                  <thead className="bg-card-soft">
                    <tr>{b.headers.map((h, j) => <th key={j} className="border-b border-border px-3 py-2 font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="align-top odd:bg-card even:bg-bg/40">
                        {r.map((c, k) => <td key={k} className="border-t border-border px-3 py-2 leading-relaxed">{inline(c)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case 'callout': {
            const t = TONE[b.tone]
            return (
              <div key={i} className={`rounded-xl border p-4 text-sm leading-relaxed ${t.box}`}>
                <div className={`mb-1 font-bold ${t.title}`}>{t.icon} {b.title}</div>
                <div>{inline(b.text)}</div>
              </div>
            )
          }
          case 'code':
            return (
              <figure key={i}>
                {b.caption && <figcaption className="mb-1 text-xs text-muted">{b.caption}</figcaption>}
                <pre className="overflow-x-auto rounded-xl bg-midnight p-4 text-xs leading-relaxed text-slate-100"><code>{b.text}</code></pre>
              </figure>
            )
        }
      })}
    </div>
  )
}
