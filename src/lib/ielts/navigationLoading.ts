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
