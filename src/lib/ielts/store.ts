import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { storage } from './storage'
import type { IeltsPage, Skill, VocabEntry } from './types'

// Rich text bắn onUpdate mỗi phím gõ — PUT/PATCH thẳng lên server mỗi lần có thể khiến các request
// hoàn thành không đúng thứ tự (request cũ với nội dung ngắn hơn về sau, ghi đè mất chữ vừa gõ).
// Debounce theo TỪNG TRANG riêng (không chung 1 timer) + flush khi blur đảm bảo mỗi trang chỉ gửi
// 1 request đại diện cho trạng thái mới nhất của chính nó.
const SAVE_DEBOUNCE_MS = 500
const pageTimers = new Map<string, ReturnType<typeof setTimeout>>()
const pendingPagePatches = new Map<string, Partial<Pick<IeltsPage, 'title' | 'content' | 'sortOrder'>>>()

function schedulePageSave(id: string, patch: Partial<Pick<IeltsPage, 'title' | 'content' | 'sortOrder'>>) {
  pendingPagePatches.set(id, { ...pendingPagePatches.get(id), ...patch })
  const existing = pageTimers.get(id)
  if (existing) clearTimeout(existing)
  pageTimers.set(
    id,
    setTimeout(() => {
      pageTimers.delete(id)
      const toSave = pendingPagePatches.get(id)
      pendingPagePatches.delete(id)
      if (toSave) storage.updatePage(id, toSave).catch(console.error)
    }, SAVE_DEBOUNCE_MS),
  )
}

function cancelPendingSave(id: string) {
  const existing = pageTimers.get(id)
  if (existing) clearTimeout(existing)
  pageTimers.delete(id)
  pendingPagePatches.delete(id)
}

function flushPageSave(id: string) {
  const existing = pageTimers.get(id)
  if (existing) clearTimeout(existing)
  pageTimers.delete(id)
  const toSave = pendingPagePatches.get(id)
  pendingPagePatches.delete(id)
  if (toSave) storage.updatePage(id, toSave).catch(console.error)
}

interface IeltsState {
  hydrated: boolean
  contentLoaded: boolean
  pages: IeltsPage[]
  vocab: VocabEntry[]

  hydrate: () => Promise<void>

  addPage: (skill: Skill, title: string) => IeltsPage
  updatePage: (id: string, patch: Partial<Pick<IeltsPage, 'title' | 'content' | 'sortOrder'>>) => void
  flushPageSave: (id: string) => void
  deletePage: (id: string) => void

  addVocab: (entry: Omit<VocabEntry, 'id' | 'createdAt'>) => VocabEntry
  updateVocab: (id: string, patch: Partial<Omit<VocabEntry, 'id' | 'createdAt'>>) => void
  deleteVocab: (id: string) => void
}

export const useIeltsStore = create<IeltsState>((set, get) => ({
  hydrated: false,
  contentLoaded: false,
  pages: [],
  vocab: [],

  // 2 pha: (1) tải nhanh id/title/skill/sortOrder (content rỗng) để sidebar hiện ngay, không phải
  // đợi tải xong nội dung đầy đủ của MỌI trang (mỗi trang có thể 60-100KB+ HTML); (2) tải tiếp nội
  // dung đầy đủ ở NỀN, merge vào đúng từng trang theo id khi xong (contentLoaded=true) — PageEditor
  // chỉ mount sau khi contentLoaded để không bao giờ mount với content rỗng rồi lỡ tay ghi đè mất
  // nội dung thật (xem page.tsx).
  hydrate: async () => {
    if (get().hydrated) return
    const [meta, vocab] = await Promise.all([storage.getPagesMeta(), storage.getVocab()])
    set({ hydrated: true, pages: meta, vocab })
    storage
      .getPages()
      .then((full) => {
        const fullById = new Map(full.map((p) => [p.id, p]))
        set((state) => ({
          contentLoaded: true,
          pages: state.pages.map((p) => fullById.get(p.id) ?? p),
        }))
      })
      .catch(console.error)
  },

  addPage: (skill, title) => {
    const page: IeltsPage = {
      id: nanoid(),
      skill,
      title,
      content: '',
      sortOrder: get().pages.filter((p) => p.skill === skill).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set({ pages: [...get().pages, page] })
    storage.createPage(page).catch(console.error)
    return page
  },

  updatePage: (id, patch) => {
    set({
      pages: get().pages.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    })
    schedulePageSave(id, patch)
  },

  flushPageSave,

  deletePage: (id) => {
    set({ pages: get().pages.filter((p) => p.id !== id) })
    cancelPendingSave(id)
    storage.deletePage(id).catch(console.error)
  },

  addVocab: (entry) => {
    const v: VocabEntry = { ...entry, id: nanoid(), createdAt: new Date().toISOString() }
    set({ vocab: [...get().vocab, v] })
    storage.createVocab(v).catch(console.error)
    return v
  },

  updateVocab: (id, patch) => {
    set({ vocab: get().vocab.map((v) => (v.id === id ? { ...v, ...patch } : v)) })
    storage.updateVocab(id, patch).catch(console.error)
  },

  deleteVocab: (id) => {
    set({ vocab: get().vocab.filter((v) => v.id !== id) })
    storage.deleteVocab(id).catch(console.error)
  },
}))
