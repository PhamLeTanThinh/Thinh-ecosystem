'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent, type EditorOptions } from '@tiptap/react'
import type { EditorView } from '@tiptap/pm/view'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { NoteToolbar } from './NoteToolbar'

// Ảnh dán vào lớn hơn ngưỡng này sẽ được thu nhỏ (giữ tỉ lệ, nén JPEG) trước khi nhúng base64
// vào nội dung note — content của mọi note được gộp gửi lên server mỗi lần lưu, nên cần giữ nhỏ.
const MAX_IMAGE_WIDTH = 900

function downscaleDataUrl(dataUrl: string, maxWidth: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => {
      if (img.width <= maxWidth) {
        resolve(dataUrl)
        return
      }
      const scale = maxWidth / img.width
      const canvas = document.createElement('canvas')
      canvas.width = maxWidth
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

function insertImageAtSelection(view: EditorView, src: string) {
  const { schema } = view.state
  const node = schema.nodes.image.create({ src })
  view.dispatch(view.state.tr.replaceSelectionWith(node))
}

function readAndInsertImage(view: EditorView, file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result
    if (typeof dataUrl !== 'string') return
    downscaleDataUrl(dataUrl, MAX_IMAGE_WIDTH).then((src) => insertImageAtSelection(view, src))
  }
  reader.readAsDataURL(file)
}

// Hoist ra ngoài component: `useEditor` tự so sánh lại `options` mỗi lần render (khi không truyền
// deps) và gọi `setOptions()` nếu thấy khác — nếu tạo mới mảng extensions/object editorProps ngay
// trong thân component, mỗi lần render sẽ tạo ra instance mới (dù nội dung giống hệt), khiến
// setOptions() bị gọi liên tục mỗi render, gây vòng lặp re-render/reflow (biểu hiện ra ngoài là
// thanh scroll giật liên tục). Các extension này không phụ thuộc props/state nên dùng chung an toàn
// cho mọi note trên trang.
const editorExtensions = [
  StarterKit.configure({ heading: { levels: [2, 3] } }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Placeholder.configure({ placeholder: 'Viết gì đó…' }),
  Image.configure({
    allowBase64: true,
    resize: { enabled: true, directions: ['bottom-right'], minWidth: 60, minHeight: 60, alwaysPreserveAspectRatio: true },
  }),
]

const editorProps: EditorOptions['editorProps'] = {
  attributes: { class: 'nt-editor-content' },
  handlePaste: (view, event) => {
    const items = event.clipboardData?.items
    if (!items) return false
    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          event.preventDefault()
          readAndInsertImage(view, file)
          return true
        }
      }
    }
    return false
  },
  handleDrop: (view, event) => {
    const file = event.dataTransfer?.files?.[0]
    if (file && file.type.startsWith('image/')) {
      event.preventDefault()
      readAndInsertImage(view, file)
      return true
    }
    return false
  },
}

interface Props {
  content: string
  editable: boolean
  onChangeHtml: (html: string) => void
}

// Focus/blur của note (bao gồm toolbar, editor, ô nhãn) được xử lý gộp ở StickyNoteCard
// (root onFocus/onBlur với kiểm tra relatedTarget) — component này chỉ lo phần soạn thảo.
export function NoteEditor({ content, editable, onChangeHtml }: Props) {
  // Chỉ dùng content lúc khởi tạo — sau đó editor tự quản lý nội dung của nó (nguồn sự thật là
  // editor, đẩy ra ngoài qua onUpdate). Không truyền lại `content` prop mỗi render vào useEditor:
  // useEditor tự đồng bộ `options` mỗi render khi không có deps, và content prop có thể tạm thời
  // "trễ" hơn nội dung đang gõ dở trong editor (do setState bất đồng bộ) — nếu truyền lại sẽ có
  // lúc bị ghi đè ngược, mất ký tự vừa gõ khi gõ nhanh.
  const [initialContent] = useState(content)

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    content: initialContent,
    extensions: editorExtensions,
    onUpdate: ({ editor }) => onChangeHtml(editor.getHTML()),
    editorProps,
  })

  useEffect(() => {
    if (!editor || editor.isEditable === editable) return
    editor.setEditable(editable)
  }, [editable, editor])

  useEffect(() => {
    if (editable) editor?.commands.focus('end')
  }, [editable, editor])

  if (!editor) return null

  return (
    <div>
      {editable && <NoteToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
