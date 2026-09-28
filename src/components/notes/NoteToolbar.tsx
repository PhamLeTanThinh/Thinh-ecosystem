'use client'

import type { Editor } from '@tiptap/core'

const TEXT_COLORS = ['#18181B', '#3E63DD', '#C9667A', '#178A5A', '#B45309']
const HIGHLIGHT_COLORS = ['#FEF08A', '#FBCFE8', '#BBF7D0', '#BFDBFE', '#E9D5FF']

function ToolbarButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`nt-tb-btn${active ? ' active' : ''}`}
    >
      {children}
    </button>
  )
}

// The toolbar blocks mousedown at the parent (NoteEditor) so clicking a button doesn't steal focus from the editor.
export function NoteToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="nt-toolbar" onMouseDown={(e) => e.preventDefault()}>
      <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <span style={{ textDecoration: 'underline' }}>U</span>
      </ToolbarButton>
      <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <span style={{ textDecoration: 'line-through' }}>S</span>
      </ToolbarButton>

      <span className="nt-tb-sep" />

      <ToolbarButton label="Large heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton label="Small heading" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>

      <span className="nt-tb-sep" />

      <ToolbarButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        •≡
      </ToolbarButton>
      <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1.≡
      </ToolbarButton>

      <span className="nt-tb-sep" />

      <ToolbarButton label="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        ⟸
      </ToolbarButton>
      <ToolbarButton label="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        ⟺
      </ToolbarButton>
      <ToolbarButton label="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        ⟹
      </ToolbarButton>

      <span className="nt-tb-sep" />

      <ToolbarButton
        label="Insert link"
        active={editor.isActive('link')}
        onClick={() => {
          if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run()
            return
          }
          const url = window.prompt('URL:')
          if (url) editor.chain().focus().setLink({ href: url }).run()
        }}
      >
        🔗
      </ToolbarButton>

      <span className="nt-tb-sep" />

      <div className="nt-tb-swatches" aria-label="Text color">
        {TEXT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Text color ${c}`}
            className="nt-tb-swatch"
            style={{ backgroundColor: c }}
            onClick={() => editor.chain().focus().setColor(c).run()}
          />
        ))}
      </div>

      <div className="nt-tb-swatches" aria-label="Highlight">
        {HIGHLIGHT_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Highlight ${c}`}
            className="nt-tb-swatch"
            style={{ backgroundColor: c }}
            onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()}
          />
        ))}
      </div>
    </div>
  )
}
