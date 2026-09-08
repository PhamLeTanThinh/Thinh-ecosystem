import { create } from 'zustand'
import type { LanguageCode } from './types'
import { nextLanguage } from './languages'
import type { FloatStyleId } from './float-styles'

const STORAGE_KEY = 'vitrine:v1'

interface PersistedShape {
  language: LanguageCode
  learnedPartIds: string[]
  streakDays: number
}

function readStorage(): PersistedShape | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedShape
  } catch {
    return null
  }
}

function writeStorage(shape: PersistedShape) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shape))
  } catch {
    // localStorage có thể bị chặn (private mode) — bỏ qua, chỉ mất persistence.
  }
}

interface VitrineState {
  hydrated: boolean
  language: LanguageCode
  learnedPartIds: Set<string>
  // Placeholder cho tới khi có backend theo dõi ngày hoạt động thật.
  streakDays: number
  // Kiểu float đang dùng cho lượt điều hướng hiện tại — KHÔNG persist ra localStorage
  // (chỉ là hiệu ứng thị giác nhất thời), nhưng vẫn sống được qua điều hướng SPA vì
  // store zustand là 1 singleton trong bộ nhớ, không unmount theo route. Nhờ vậy trang
  // đích đọc lại đúng style trang nguồn vừa chọn để bay vào cùng "chất" đã trôi ra.
  floatStyle: FloatStyleId

  hydrate: () => void
  setLanguage: (language: LanguageCode) => void
  cycleLanguage: () => void
  toggleLearned: (partId: string) => void
  setFloatStyle: (style: FloatStyleId) => void
}

export const useVitrineStore = create<VitrineState>((set, get) => ({
  hydrated: false,
  language: 'vi',
  learnedPartIds: new Set(),
  streakDays: 5,
  floatStyle: 'scatter',

  hydrate: () => {
    if (get().hydrated) return
    const saved = readStorage()
    set({
      hydrated: true,
      language: saved?.language ?? 'vi',
      learnedPartIds: new Set(saved?.learnedPartIds ?? []),
      streakDays: saved?.streakDays ?? 5,
    })
  },

  setLanguage: (language) => {
    set({ language })
    const s = get()
    writeStorage({ language, learnedPartIds: [...s.learnedPartIds], streakDays: s.streakDays })
  },

  cycleLanguage: () => {
    const language = nextLanguage(get().language)
    get().setLanguage(language)
  },

  toggleLearned: (partId) => {
    const learnedPartIds = new Set(get().learnedPartIds)
    if (learnedPartIds.has(partId)) learnedPartIds.delete(partId)
    else learnedPartIds.add(partId)
    set({ learnedPartIds })
    const s = get()
    writeStorage({ language: s.language, learnedPartIds: [...learnedPartIds], streakDays: s.streakDays })
  },

  setFloatStyle: (style) => set({ floatStyle: style }),
}))
