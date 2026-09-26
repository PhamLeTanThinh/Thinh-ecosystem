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
          case 'tldr':
            return (
              <div key={i} className="rounded-2xl border border-accent/15 bg-gradient-to-br from-accent-soft to-plum-soft p-5">
                <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-plum">⚡ Hiểu nhanh</div>
                <div className="text-[15px] leading-relaxed">{inline(b.text)}</div>
              </div>
            )
          case 'steps':
            return (
              <div key={i} className="rounded-2xl border border-border bg-card-soft/60 p-4">
                <ol className="flex flex-col">
                  {b.items.map((it, j) => (
                    <li key={j} className="relative flex gap-3 pb-4 last:pb-0">
                      {j < b.items.length - 1 && <span className="absolute left-[13px] top-7 bottom-0 w-px bg-accent/20" />}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">{j + 1}</span>
                      <span className="pt-0.5 leading-relaxed">{inline(it)}</span>
                    </li>
                  ))}
                </ol>
                {b.loop && <div className="mt-3 rounded-xl bg-plum-soft px-3 py-2 text-sm font-medium text-plum">↻ {inline(b.loop)}</div>}
              </div>
            )
          case 'terms':
            return (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                {b.items.map((t, j) => (
                  <div key={j} className="rounded-xl border border-border bg-card p-3 text-sm">
                    <div className="font-semibold text-accent">{inline(t.term)}</div>
                    <div className="mt-0.5 leading-relaxed text-muted">{inline(t.meaning)}</div>
                  </div>
                ))}
              </div>
            )
          case 'example':
            return (
              <div key={i} className="overflow-hidden rounded-2xl border border-border text-sm leading-relaxed">
                <div className="bg-card-soft px-4 py-3">
                  <div className="mb-1 text-xs font-bold uppercase tracking-wider text-plum">📌 Tình huống</div>
                  <div>{inline(b.scenario)}</div>
                </div>
                <div className="flex flex-col gap-3 p-4">
                  <div className="rounded-xl border-l-4 border-jade bg-jade/10 px-3 py-2">
                    <span className="font-bold text-jade">✓ Nên làm: </span>
                    {inline(b.right)}
                  </div>
                  {b.wrong && b.wrong.length > 0 && (
                    <div className="rounded-xl border-l-4 border-rose-400 bg-rose-400/10 px-3 py-2">
                      <div className="font-bold text-rose-600">✕ Bẫy hay gặp:</div>
                      <ul className="mt-1 flex list-disc flex-col gap-1 pl-5">
                        {b.wrong.map((w, j) => <li key={j}>{inline(w)}</li>)}
                      </ul>
                    </div>
                  )}
                  <div>
                    <span className="font-bold">Vì sao? </span>
                    <span className="text-muted">{inline(b.why)}</span>
                  </div>
                </div>
              </div>
            )
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
