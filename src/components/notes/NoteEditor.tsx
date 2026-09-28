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

// A pasted image larger than this threshold gets downscaled (aspect ratio kept, JPEG-compressed)
// before being embedded as base64 in the note content — every note's content gets bundled and sent
// to the server on every save, so it needs to stay small.
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

// Hoisted outside the component: `useEditor` re-compares `options` on every render (when no deps
// are passed) and calls `setOptions()` if it sees a difference — if the extensions array/editorProps
// object were created fresh inside the component body, every render would produce a new instance
// (even with identical content), causing setOptions() to fire on every render and triggering a
// re-render/reflow loop (visible as the scrollbar jittering constantly). These extensions don't
// depend on props/state, so sharing them across every note on the page is safe.
const editorExtensions = [
  StarterKit.configure({ heading: { levels: [2, 3] } }),
  TextStyle,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Placeholder.configure({ placeholder: 'Write something…' }),
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

// Focus/blur for the note (including the toolbar, editor, and tag input) is handled together in
// StickyNoteCard (root onFocus/onBlur with a relatedTarget check) — this component only handles editing.
export function NoteEditor({ content, editable, onChangeHtml }: Props) {
  // Only used for the initial content — after that the editor owns its own content (the editor is
  // the source of truth, pushed out via onUpdate). Don't pass the `content` prop back into useEditor
  // on every render: useEditor re-syncs `options` on every render when there are no deps, and the
  // content prop can temporarily lag behind what's actually being typed in the editor (due to async
  // setState) — passing it back in could sometimes overwrite in reverse, losing characters just
  // typed when typing fast.
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
