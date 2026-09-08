'use client'

import { useEffect } from 'react'
import { useNotesStore } from '@/lib/notes/store'

export function NotesHydrator() {
  useEffect(() => {
    useNotesStore.getState().hydrate().catch(console.error)
  }, [])

  return null
}
