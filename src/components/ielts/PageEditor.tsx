'use client'

import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, type EditorOptions } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { TableKit } from '@tiptap/extension-table'
import { Callout } from './extensions/Callout'
import { ExampleBlock } from './extensions/ExampleBlock'
import { AnswerBlock } from './extensions/AnswerBlock'
import { BandLevel } from './extensions/BandLevel'
import { SectionHero } from './extensions/SectionHero'
import { MarginNote } from './extensions/MarginNote'
import { TreeOutline } from './extensions/TreeOutline'
import { DataChart } from './extensions/DataChart'
import { QuestionBank } from './extensions/QuestionBank'
import { QuestionBankModal } from './QuestionBankModal'
import { DocToolbar } from './DocToolbar'
import { useIeltsAccess } from './AccessContext'
import { useIeltsStore } from '@/lib/ielts/store'
import type { IeltsPage } from '@/lib/ielts/types'

// Hoist ra ngoài component — useEditor tự so sánh lại options mỗi render khi không truyền deps;
// tạo mới mảng extensions mỗi render (instance mới dù nội dung giống hệt) khiến setOptions() bị
// gọi liên tục, gây vòng lặp re-render (bài học từ notes app). Extensions/editorProps tĩnh nên
// dùng chung an toàn.
const docExtensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Placeholder.configure({ placeholder: 'Viết nội dung…' }),
  TableKit.configure({ table: { resizable: true } }),
  Callout,
  ExampleBlock,
  AnswerBlock,
  BandLevel,
  SectionHero,
  MarginNote,
  TreeOutline,
  DataChart,
  QuestionBank,
]

const docEditorProps: EditorOptions['editorProps'] = {
  attributes: { class: 'ih-editor-content' },
}

interface TocItem {
  index: number
  text: string
}

interface BankEntry {
  title: string
  data: string
}

interface Props {
  page: IeltsPage
}

// Key theo page.id ở nơi gọi (Sidebar/page.tsx) để mount lại component này khi đổi trang — nhờ đó
// initialContent luôn đúng nội dung trang mới mà không cần đồng bộ content ngược qua prop, và mỗi
// trang mới luôn mở ở chế độ xem (readonly) trước, đúng ý "vào trang là bản visualize sẵn".
export function PageEditor({ page }: Props) {
  const { isOwner } = useIeltsAccess()
  const updatePage = useIeltsStore((s) => s.updatePage)
  const flushPageSave = useIeltsStore((s) => s.flushPageSave)
  const [initialContent] = useState(page.content)
  const [editing, setEditing] = useState(false)
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [bankEntry, setBankEntry] = useState<BankEntry | null>(null)
  const [bankOpen, setBankOpen] = useState<BankEntry | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editable: editing,
    content: initialContent,
    extensions: docExtensions,
    onUpdate: ({ editor }) => updatePage(page.id, { content: editor.getHTML() }),
    editorProps: docEditorProps,
  })

  useEffect(() => {
    if (!editor || editor.isEditable === editing) return
    editor.setEditable(editing)
  }, [editing, editor])

  useEffect(() => {
    return () => {
      flushPageSave(page.id)
    }
  }, [page.id, flushPageSave])

  // Mục lục tự sinh từ các H2 trong document model của editor (luôn sẵn sàng ngay khi editor tạo
  // xong, không phụ thuộc DOM của EditorContent đã mount hay chưa — với immediatelyRender: false,
  // DOM có thể mount trễ hơn 1 nhịp nên không dùng querySelector ở đây). Khi click, mới query DOM
  // trực tiếp để cuộn tới — lúc đó DOM chắc chắn đã sẵn sàng.
  useEffect(() => {
    if (!editor) return
    const ed = editor
    function computeToc() {
      const items: TocItem[] = []
      let bank: BankEntry | null = null
      ed.state.doc.forEach((node) => {
        if (node.type.name === 'heading' && node.attrs.level === 2) {
          items.push({ index: items.length, text: node.textContent })
        } else if (node.type.name === 'questionBank') {
          bank = { title: node.attrs.title, data: node.attrs.data }
        }
      })
      setToc(items)
      setBankEntry(bank)
    }
    computeToc()
    editor.on('update', computeToc)
    return () => {
      editor.off('update', computeToc)
    }
  }, [editor])

  // Bấm dòng gợi ý inline (QuestionBankView, 1 cây React riêng ngoài component này) phát sự kiện
  // window thay vì gọi prop trực tiếp — nghe ở đây để mở đúng 1 modal chung.
  useEffect(() => {
    function onOpenBank(e: Event) {
      const detail = (e as CustomEvent<BankEntry>).detail
      if (detail) setBankOpen(detail)
    }
    window.addEventListener('ih-open-question-bank', onOpenBank)
    return () => window.removeEventListener('ih-open-question-bank', onOpenBank)
  }, [])

  function scrollToHeading(index: number) {
    const headings = contentRef.current?.querySelectorAll('.ih-editor-content h2')
    headings?.[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Scrollspy: menu bên phải bám theo vị trí cuộn để người đọc biết đang ở mục nào. Scroll thực tế
  // diễn ra ở window (đã xác nhận .ih-content không tạo vùng cuộn riêng), nên nghe scroll ở window
  // và so trực tiếp getBoundingClientRect của từng H2 — cách này còn giữ đúng mục cuối cùng là
  // active khi đã cuộn qua nó xuống cuối trang, điều IntersectionObserver khó đảm bảo.
  useEffect(() => {
    if (editing || toc.length === 0) return
    const headings = Array.from(contentRef.current?.querySelectorAll<HTMLElement>('.ih-editor-content h2') ?? [])
    if (headings.length === 0) return

    const topOffset = 110 // bù chiều cao topbar cố định phía trên
    let ticking = false

    function updateActive() {
      ticking = false
      let current = 0
      headings.forEach((h, i) => {
        if (h.getBoundingClientRect().top - topOffset <= 0) current = i
      })
      setActiveIndex(current)
    }

    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(updateActive)
    }

    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [editing, toc])

  if (!editor) return null

  function toggleEditing() {
    if (!isOwner) return // phòng hờ — nút đã ẩn, nhưng chặn luôn ở đây nếu bị gọi bằng cách khác
    if (editing) flushPageSave(page.id) // vừa tắt edit -> lưu ngay, không chờ debounce
    setEditing((v) => !v)
  }

  return (
    <div className={`ih-doc${editing ? ' ih-doc-editing' : ''}`}>
      <div className="ih-doc-topline">
        {editing && <DocToolbar editor={editor} />}
        {isOwner && (
          <button type="button" className="ih-doc-edit-toggle" onClick={toggleEditing}>
            {editing ? '✓ Xong' : '✎ Chỉnh sửa'}
          </button>
        )}
      </div>

      <div className="ih-doc-body">
        <div ref={contentRef} className="ih-doc-content">
          <EditorContent editor={editor} onBlur={() => editing && flushPageSave(page.id)} />
        </div>

        {!editing && (toc.length > 1 || bankEntry) && (
          <aside className="ih-side-toc" aria-label="Mục lục">
            <span className="ih-side-toc-label">Đang đọc</span>
            {toc.map((t, i) => (
              <button
                key={t.index}
                type="button"
                title={t.text}
                className={`ih-side-toc-item${i === activeIndex ? ' active' : ''}`}
                onClick={() => scrollToHeading(t.index)}
              >
                {t.text}
              </button>
            ))}
            {bankEntry && (
              <button
                type="button"
                title={bankEntry.title}
                className="ih-side-toc-item ih-side-toc-bank"
                onClick={() => setBankOpen(bankEntry)}
              >
                📚 {bankEntry.title}
              </button>
            )}
          </aside>
        )}
      </div>

      {bankOpen && <QuestionBankModal title={bankOpen.title} data={bankOpen.data} onClose={() => setBankOpen(null)} />}
    </div>
  )
}
