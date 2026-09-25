'use client'

import { create } from 'zustand'
import { IELTS_LOADING } from '@/lib/loading/apps'
import { createLoadingTracker } from '@/lib/loading/tracker'

interface IeltsNavigationState {
  navigatingTo: string | null
  begin: (path: string) => void
  end: () => void
}

export const ieltsLoadingTracker = createLoadingTracker(IELTS_LOADING.apiPrefix)

export const useIeltsNavigationStore = create<IeltsNavigationState>((set) => ({
  navigatingTo: null,
  begin: (path) => set({ navigatingTo: path }),
  end: () => set({ navigatingTo: null }),
}))

export function beginIeltsNavigation(path: string) {
  ieltsLoadingTracker.setNavigationPending(true)
  useIeltsNavigationStore.getState().begin(path)
}

// Điều hướng bằng code (router.push/replace) KHÔNG đi qua bộ bắt click <a> trong IeltsLoading, nên phải tự bật
// loading trước — vd nút "Nộp bài" chuyển sang trang kết quả, trang đó cần tải xong mới hiện.
export function navigateIelts(router: { push: (href: string) => void; replace: (href: string) => void }, href: string, replace = false) {
  beginIeltsNavigation(href)
  if (replace) router.replace(href)
  else router.push(href)
}
