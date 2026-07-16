'use client'

import { useEffect } from 'react'
import { useHabitsStore } from '@/lib/habits/store'

export function HabitsHydrator() {
  useEffect(() => {
    useHabitsStore.getState().hydrate().catch(console.error)
  }, [])

  return null
}
