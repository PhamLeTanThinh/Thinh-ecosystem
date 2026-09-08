'use client'

import { useEffect } from 'react'
import { useVitrineStore } from '@/lib/vitrine/store'

export function VitrineHydrator() {
  const hydrate = useVitrineStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return null
}
