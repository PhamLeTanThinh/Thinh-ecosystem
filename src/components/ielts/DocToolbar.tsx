'use client'

import type { Editor, JSONContent } from '@tiptap/core'

const TEXT_COLORS = ['#2B3A55', '#C9667A', '#3E63DD', '#178A5A', '#B45309']
const HIGHLIGHT_COLORS = ['#FEF08A', '#FBCFE8', '#BBF7D0', '#BFDBFE', '#E9D5FF']

// Callout/example là node block-cấp-cao; nếu con trỏ đang ở TRONG 1 callout (vd đang gõ dở) và
// insertContent() ngay tại selection, node mới sẽ bị lồng vào bên trong thay vì làm anh em cùng
// cấp. Luôn chèn ngay sau khối cấp cao nhất (depth 1) chứa con trỏ để thoát mọi lồng nhau.
function insertTopLevelBlock(editor: Editor, node: JSONContent) {
  const { $from } = editor.state.selection
  const afterPos = $from.after(1)
  editor.chain().focus().insertContentAt(afterPos, node).run()
}

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
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`ih-tb-btn${active ? ' active' : ''}`}>
      {children}
    </button>
  )
}

// Toolbar dùng onMouseDown preventDefault để bấm nút không làm mất focus/selection trong editor.
export function DocToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="ih-toolbar" onMouseDown={(e) => e.preventDefault()}>
      <ToolbarButton label="Tiêu đề 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        H1
      </ToolbarButton>
      <ToolbarButton label="Tiêu đề 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton label="Tiêu đề 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>

      <span className="ih-tb-sep" />

      <ToolbarButton label="Đậm" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton label="Nghiêng" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton label="Gạch chân" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <span style={{ textDecoration: 'underline' }}>U</span>
      </ToolbarButton>
      <ToolbarButton label="Ghi chú giải thích" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        ❝
      </ToolbarButton>

      <span className="ih-tb-sep" />

      <ToolbarButton label="Danh sách chấm" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        •≡
      </ToolbarButton>
      <ToolbarButton label="Danh sách số" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1.≡
      </ToolbarButton>

      <span className="ih-tb-sep" />

      <ToolbarButton label="Chèn bảng" active={editor.isActive('table')} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()}>
        ⊞
      </ToolbarButton>
      {editor.isActive('table') && (
        <>
          <ToolbarButton label="Thêm cột" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            +col
          </ToolbarButton>
          <ToolbarButton label="Thêm dòng" onClick={() => editor.chain().focus().addRowAfter().run()}>
            +row
          </ToolbarButton>
          <ToolbarButton label="Xoá bảng" onClick={() => editor.chain().focus().deleteTable().run()}>
            🗑︎
          </ToolbarButton>
        </>
      )}

      <span className="ih-tb-sep" />

      <ToolbarButton label="Căn trái" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        ⟸
      </ToolbarButton>
      <ToolbarButton label="Căn giữa" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        ⟺
      </ToolbarButton>

      <span className="ih-tb-sep" />

      <div className="ih-tb-swatches" aria-label="Màu chữ">
        {TEXT_COLORS.map((c) => (
          <button key={c} type="button" aria-label={`Màu chữ ${c}`} className="ih-tb-swatch" style={{ backgroundColor: c }} onClick={() => editor.chain().focus().setColor(c).run()} />
        ))}
      </div>
      <div className="ih-tb-swatches" aria-label="Highlight">
        {HIGHLIGHT_COLORS.map((c) => (
          <button key={c} type="button" aria-label={`Highlight ${c}`} className="ih-tb-swatch" style={{ backgroundColor: c }} onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()} />
        ))}
      </div>

      <span className="ih-tb-sep" />

      <button
        type="button"
        className="ih-tb-block-btn ih-tb-block-tip"
        onClick={() => insertTopLevelBlock(editor, { type: 'callout', attrs: { variant: 'tip' }, content: [{ type: 'paragraph' }] })}
      >
        💡 Mẹo
      </button>
      <button
        type="button"
        className="ih-tb-block-btn ih-tb-block-mistake"
        onClick={() => insertTopLevelBlock(editor, { type: 'callout', attrs: { variant: 'mistake' }, content: [{ type: 'paragraph' }] })}
      >
        ⚠️ Lỗi hay gặp
      </button>
      <button
        type="button"
        className="ih-tb-block-btn"
        onClick={() => insertTopLevelBlock(editor, { type: 'exampleBlock', content: [{ type: 'paragraph' }] })}
      >
        📋 Ví dụ
      </button>
      <button
        type="button"
        className="ih-tb-block-btn"
        onClick={() =>
          insertTopLevelBlock(editor, { type: 'callout', attrs: { variant: 'prompt' }, content: [{ type: 'paragraph' }] })
        }
      >
        📌 Đề bài
      </button>
      <button
        type="button"
        className="ih-tb-block-btn"
        onClick={() => insertTopLevelBlock(editor, { type: 'answerBlock', content: [{ type: 'paragraph' }] })}
      >
        👁️ Bài làm
      </button>
      <button
        type="button"
        className="ih-tb-block-btn"
        onClick={() => {
          const band = window.prompt('Band mấy? (5–9)', '7')
          if (!band) return
          insertTopLevelBlock(editor, { type: 'bandLevel', attrs: { band }, content: [{ type: 'paragraph' }] })
        }}
      >
        🎯 Band description
      </button>
      <button
        type="button"
        className="ih-tb-block-btn"
        onClick={() => {
          const index = window.prompt('Số thứ tự? (vd 01)', '01')
          if (index === null) return
          const acronym = window.prompt('Mã viết tắt? (vd TR, CC, LR, GRA)', '') ?? ''
          insertTopLevelBlock(editor, {
            type: 'sectionHero',
            attrs: { index, acronym },
            content: [{ type: 'paragraph' }, { type: 'paragraph' }],
          })
        }}
      >
        🔠 Tiêu đề lớn
      </button>
      <button
        type="button"
        className="ih-tb-block-btn"
        onClick={() => {
          const label = window.prompt('Nhãn ghi chú?', "examiner's note") ?? "examiner's note"
          const ref = window.prompt('Số tham chiếu? (vd 01.2, để trống nếu không cần)', '') ?? ''
          insertTopLevelBlock(editor, { type: 'marginNote', attrs: { label, ref }, content: [{ type: 'paragraph' }] })
        }}
      >
        📎 Ghi chú lề
      </button>
      <button
        type="button"
        className="ih-tb-block-btn"
        onClick={() => {
          const root = window.prompt('Nhãn ô gốc (trên cùng)?', '①② Mở bài')
          if (root === null) return
          const leftLabel = window.prompt('Tiêu đề nhánh trái?', 'Nhánh trái') ?? ''
          const leftSteps = window.prompt('Các bước nhánh trái, ngăn bởi dấu | ?', '') ?? ''
          const rightLabel = window.prompt('Tiêu đề nhánh phải?', 'Nhánh phải') ?? ''
          const rightSteps = window.prompt('Các bước nhánh phải, ngăn bởi dấu | ?', '') ?? ''
          const bottom = window.prompt('Nhãn ô đáy (hội tụ)?', 'Kết bài') ?? ''
          insertTopLevelBlock(editor, {
            type: 'treeOutline',
            attrs: { root, leftLabel, leftSteps, rightLabel, rightSteps, bottom },
          })
        }}
      >
        🌳 Sơ đồ cây
      </button>
    </div>
  )
}
