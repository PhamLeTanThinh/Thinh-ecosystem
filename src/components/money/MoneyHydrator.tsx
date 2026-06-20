'use client'

import { useEffect } from 'react'
import { useMoneyStore } from '@/lib/money/store'

export function MoneyHydrator() {
  useEffect(() => {
    useMoneyStore.getState().hydrate().catch(console.error)
  }, [])

  return null
}
