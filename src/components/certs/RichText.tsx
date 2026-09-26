import { Fragment, type ReactNode } from 'react'

// Inline: ![alt](url), **đậm** và `code`. Không dùng dangerouslySetInnerHTML — nội dung được tách thành phần tử React.
export function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /(!\[[^\]]*\]\([^)\s]+\)|\*\*[^*]+\*\*|`[^`]+`)/g
  let last = 0
  let i = 0
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('![')) {
      const [, alt, src] = tok.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/)!
      out.push(
        <a key={i++} href={src} target="_blank" rel="noreferrer" className="my-2 block overflow-hidden rounded-xl border border-border" title="Mở ảnh gốc">
          <img src={src} alt={alt || 'Hình minh hoạ'} className="w-full" />
        </a>,
      )
    } else if (tok.startsWith('**')) out.push(<strong key={i++} className="font-semibold text-text">{tok.slice(2, -2)}</strong>)
    else out.push(<code key={i++} className="rounded bg-card-soft px-1.5 py-0.5 font-mono text-[0.85em] text-plum">{tok.slice(1, -1)}</code>)
    last = m.index + tok.length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const BULLET = /^\s*[-*] /

// Markdown nhẹ cho câu hỏi/giải thích: đoạn (cách nhau bằng dòng trống), xuống dòng giữ nguyên, danh sách "- ".
export function RichText({ text, className }: { text: string; className?: string }) {
  const groups: { list: boolean; lines: string[] }[] = []
  for (const raw of text.replace(/\r/g, '').split('\n')) {
    const line = raw.replace(/\s+$/, '')
    if (!line) {
      groups.push({ list: false, lines: [] })
      continue
    }
    const list = BULLET.test(line)
    const cur = groups[groups.length - 1]
    if (cur && cur.list === list && cur.lines.length) cur.lines.push(line)
    else groups.push({ list, lines: [line] })
  }
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {groups
        .filter((g) => g.lines.length)
        .map((g, i) =>
          g.list ? (
            <ul key={i} className="flex list-disc flex-col gap-1 pl-5 marker:text-plum">
              {g.lines.map((l, j) => <li key={j}>{renderInline(l.replace(BULLET, ''))}</li>)}
            </ul>
          ) : (
            <p key={i}>
              {g.lines.map((l, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  {renderInline(l)}
                </Fragment>
              ))}
            </p>
          ),
        )}
    </div>
  )
}
