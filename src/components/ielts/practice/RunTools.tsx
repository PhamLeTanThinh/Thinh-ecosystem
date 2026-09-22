'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { RunPrefs } from '@/lib/ielts/practice'
import { HL_COLORS, type Tool } from './passageSelection'

function Ico({ children, size = 18 }: { children: ReactNode; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

// Giữ nguyên vùng bôi đen khi bấm nút trên thanh công cụ: mousedown mặc định sẽ xoá vùng chọn của trang.
const keepSelection = (e: React.MouseEvent) => e.preventDefault()

// Đóng dropdown khi bấm ra ngoài phần tử `ref`.
function useOutside(ref: React.RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [ref, open, close])
}

interface LeftProps {
  tool: Tool
  color: string
  lookupDisabled: boolean
  onTool: (t: Tool) => void
  onColor: (c: string) => void
  onNote: () => void
  onLookup: () => void
  onClose: () => void
}

// Nhóm công cụ bên trái: thoát | chọn · màu · Highlight · Ghi chú · xoá highlight | Tra nghĩa.
export function ToolsLeft({ tool, color, lookupDisabled, onTool, onColor, onNote, onLookup, onClose }: LeftProps) {
  const [colorOpen, setColorOpen] = useState(false)
  const colorRef = useRef<HTMLDivElement>(null)
  useOutside(colorRef, colorOpen, () => setColorOpen(false))

  return (
    <div className="ih-run-tools">
      <button type="button" className="ih-run-close" aria-label="Thoát" onClick={onClose}>
        ✕
      </button>
      <span className="ih-run-sep" />

      <button type="button" className={`ih-tool-btn icon${tool === 'select' ? ' active' : ''}`} title="Chọn" aria-label="Chọn" aria-pressed={tool === 'select'} onMouseDown={keepSelection} onClick={() => onTool('select')}>
        <Ico>
          <path d="M5 3l14 8-6 2-2 6z" fill="currentColor" />
        </Ico>
      </button>

      <div className="ih-tool-group">
        <div className="ih-tool-color" ref={colorRef}>
          <button type="button" className="ih-tool-btn icon" title="Màu highlight" aria-label="Màu highlight" onMouseDown={keepSelection} onClick={() => setColorOpen((v) => !v)}>
            <span className="ih-tool-dot" style={{ background: color }} />
          </button>
          {colorOpen && (
            <div className="ih-run-drop ih-tool-colors" role="menu">
              {HL_COLORS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  role="menuitem"
                  title={c.label}
                  aria-label={c.label}
                  className={`ih-tool-swatch${c.color === color ? ' on' : ''}`}
                  style={{ background: c.color }}
                  onMouseDown={keepSelection}
                  onClick={() => {
                    onColor(c.color)
                    setColorOpen(false)
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <button type="button" className={`ih-tool-btn${tool === 'highlight' ? ' active' : ''}`} aria-pressed={tool === 'highlight'} onMouseDown={keepSelection} onClick={() => onTool('highlight')}>
          <Ico>
            <path d="M4 20h5L20 9l-5-5L4 15z" />
            <path d="M13 6l5 5" />
          </Ico>
          <span className="ih-tool-label">Highlight</span>
        </button>
        <button type="button" className="ih-tool-btn" onMouseDown={keepSelection} onClick={onNote}>
          <Ico>
            <rect x="4" y="4" width="16" height="13" rx="2" />
            <path d="M8 9h8M8 13h5M9 17l-1 3 4-3" />
          </Ico>
          <span className="ih-tool-label">Ghi chú</span>
        </button>
        <button type="button" className={`ih-tool-btn icon${tool === 'erase' ? ' active' : ''}`} title="Xoá highlight" aria-label="Xoá highlight" aria-pressed={tool === 'erase'} onMouseDown={keepSelection} onClick={() => onTool('erase')}>
          <Ico>
            <path d="M4 15l8-8 7 7-5 5H8z" />
            <path d="M11 20h9" />
          </Ico>
        </button>
      </div>

      <button
        type="button"
        className="ih-tool-btn outline"
        disabled={lookupDisabled}
        title={lookupDisabled ? 'Không có hỗ trợ tra nghĩa ở chế độ Thi thật' : 'Bôi đen một từ rồi bấm để tra nghĩa'}
        onMouseDown={keepSelection}
        onClick={onLookup}
      >
        <Ico>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4.2-4.2" />
        </Ico>
        <span className="ih-tool-label">Tra nghĩa</span>
      </button>
    </div>
  )
}

interface RightProps {
  prefs: RunPrefs
  flagged: boolean
  onPrefs: (p: RunPrefs) => void
  onFlag: () => void
}

// Nhóm bên phải: xếp dọc/chia đôi · cỡ chữ Aa · đánh dấu cờ câu đang làm · chế độ tối.
export function ToolsRight({ prefs, flagged, onPrefs, onFlag }: RightProps) {
  const [fontOpen, setFontOpen] = useState(false)
  const fontRef = useRef<HTMLDivElement>(null)
  useOutside(fontRef, fontOpen, () => setFontOpen(false))
  const step = (d: number) => onPrefs({ ...prefs, fontStep: Math.max(-1, Math.min(3, prefs.fontStep + d)) })

  return (
    <div className="ih-run-tools right">
      <button type="button" className={`ih-tool-btn icon${prefs.stack ? ' active' : ''}`} title={prefs.stack ? 'Chia đôi màn hình' : 'Xếp bài đọc trên, câu hỏi dưới'} aria-label="Đổi bố cục" onClick={() => onPrefs({ ...prefs, stack: !prefs.stack })}>
        <Ico>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d={prefs.stack ? 'M3 12h18' : 'M12 4v16'} />
        </Ico>
      </button>

      <div className="ih-tool-color" ref={fontRef}>
        <button type="button" className="ih-tool-btn icon" title="Cỡ chữ" aria-label="Cỡ chữ" onClick={() => setFontOpen((v) => !v)}>
          <span className="ih-tool-aa">Aa</span>
        </button>
        {fontOpen && (
          <div className="ih-run-drop ih-tool-font right">
            <button type="button" onClick={() => step(-1)} disabled={prefs.fontStep <= -1} aria-label="Giảm cỡ chữ">
              A−
            </button>
            <span>{Math.round((1 + prefs.fontStep * 0.12) * 100)}%</span>
            <button type="button" onClick={() => step(1)} disabled={prefs.fontStep >= 3} aria-label="Tăng cỡ chữ">
              A+
            </button>
          </div>
        )}
      </div>

      <button type="button" className={`ih-tool-btn icon${flagged ? ' flagged' : ''}`} title="Đánh dấu câu đang làm để xem lại" aria-label="Đánh dấu câu" aria-pressed={flagged} onClick={onFlag}>
        <Ico>
          <path d="M6 21V4h11l-2.5 4L17 12H6" fill={flagged ? 'currentColor' : 'none'} />
        </Ico>
      </button>

      <button type="button" className="ih-tool-btn icon" title={prefs.dark ? 'Chế độ sáng' : 'Chế độ tối'} aria-label="Đổi chế độ sáng/tối" onClick={() => onPrefs({ ...prefs, dark: !prefs.dark })}>
        <Ico>{prefs.dark ? <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /> : <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" />}</Ico>
      </button>
    </div>
  )
}

// Vị trí popup (fixed) ngay dưới vùng chọn / highlight, kẹp trong màn hình.
function popStyle(rect: DOMRect, width: number): React.CSSProperties {
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
  const top = Math.min(rect.bottom + 8, window.innerHeight - 200)
  return { left, top, width }
}

interface NoteProps {
  rect: DOMRect
  initial: string
  isNew: boolean
  onSave: (text: string) => void
  onDelete: () => void
  onClose: () => void
}

// Popup nhập / sửa ghi chú cho đoạn văn đã chọn (hoặc highlight có ghi chú khi bấm vào nó).
export function NotePopover({ rect, initial, isNew, onSave, onDelete, onClose }: NoteProps) {
  const [text, setText] = useState(initial)
  const ref = useRef<HTMLDivElement>(null)
  useOutside(ref, true, onClose)

  return (
    <div ref={ref} className="ih-pop" style={popStyle(rect, 300)} role="dialog" aria-label="Ghi chú">
      <textarea
        autoFocus
        className="ih-pop-input"
        rows={4}
        placeholder="Viết ghi chú…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSave(text.trim())
        }}
      />
      <div className="ih-pop-actions">
        {!isNew && (
          <button type="button" className="ih-pop-danger" onClick={onDelete}>
            Xoá
          </button>
        )}
        <span className="ih-pop-spacer" />
        <button type="button" className="ih-pop-btn" onClick={onClose}>
          Huỷ
        </button>
        <button type="button" className="ih-pop-btn primary" onClick={() => onSave(text.trim())}>
          Lưu
        </button>
      </div>
    </div>
  )
}

interface DictEntry {
  phonetic?: string
  meanings: { partOfSpeech: string; definitions: { definition: string }[] }[]
}

interface LookupProps {
  rect: DOMRect
  text: string
  onClose: () => void
}

// Popup tra nghĩa: gọi API từ điển miễn phí dictionaryapi.dev (nghĩa tiếng Anh) cho TỪ ĐƠN; có nút mở Google
// Dịch để xem nghĩa tiếng Việt. Từ / cụm bôi đen được gửi tới các dịch vụ bên ngoài đó.
export function LookupPopover({ rect, text, onClose }: LookupProps) {
  const word = text.trim()
  const single = /^[A-Za-z][A-Za-z'’-]*$/.test(word)
  const [state, setState] = useState<'loading' | 'ok' | 'none'>(single ? 'loading' : 'none')
  const [entry, setEntry] = useState<DictEntry | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  useOutside(ref, true, onClose)

  useEffect(() => {
    if (!single) return
    const ctrl = new AbortController()
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase())}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('not found'))))
      .then((data: DictEntry[]) => {
        setEntry({ phonetic: data.find((d) => d.phonetic)?.phonetic, meanings: data.flatMap((d) => d.meanings).slice(0, 3) })
        setState('ok')
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') setState('none')
      })
    return () => ctrl.abort()
  }, [single, word])

  return (
    <div ref={ref} className="ih-pop lookup" style={popStyle(rect, 340)} role="dialog" aria-label="Tra nghĩa">
      <div className="ih-pop-head">
        <strong>{word.length > 60 ? `${word.slice(0, 60)}…` : word}</strong>
        {entry?.phonetic && <span className="ih-pop-phon">{entry.phonetic}</span>}
        <button type="button" className="ih-pop-x" aria-label="Đóng" onClick={onClose}>
          ✕
        </button>
      </div>
      {state === 'loading' && <p className="ih-pop-muted">Đang tra…</p>}
      {state === 'ok' &&
        entry?.meanings.map((m, i) => (
          <p key={i} className="ih-pop-def">
            <em>{m.partOfSpeech}</em> {m.definitions[0]?.definition}
          </p>
        ))}
      {state === 'none' && <p className="ih-pop-muted">{single ? 'Không tìm thấy từ này trong từ điển.' : 'Bôi đen một từ đơn để xem nghĩa tiếng Anh. Với cụm từ, dùng Google Dịch bên dưới.'}</p>}
      <a className="ih-pop-link" href={`https://translate.google.com/?sl=en&tl=vi&text=${encodeURIComponent(word)}&op=translate`} target="_blank" rel="noreferrer">
        Xem nghĩa tiếng Việt (Google Dịch) ↗
      </a>
    </div>
  )
}
