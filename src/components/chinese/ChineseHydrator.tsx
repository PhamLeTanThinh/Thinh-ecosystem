'use client'

import { useEffect } from 'react'
import { useChineseStore } from '@/lib/chinese/store'

export function ChineseHydrator() {
  useEffect(() => {
    useChineseStore.getState().hydrate().catch(console.error)
  }, [])

  return null
}
