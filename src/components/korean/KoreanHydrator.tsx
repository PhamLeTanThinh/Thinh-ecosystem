'use client'

import { useEffect } from 'react'
import { useKoreanStore } from '@/lib/korean/store'

export function KoreanHydrator() {
  useEffect(() => {
    useKoreanStore.getState().hydrate().catch(console.error)
  }, [])

  return null
}
