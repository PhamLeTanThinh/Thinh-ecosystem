'use client'

import { useEffect } from 'react'
import { useIeltsStore } from '@/lib/ielts/store'

export function IeltsHydrator() {
  useEffect(() => {
    useIeltsStore.getState().hydrate().catch(console.error)
  }, [])

  return null
}
