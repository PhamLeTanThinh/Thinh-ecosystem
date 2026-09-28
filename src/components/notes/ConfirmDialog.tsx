'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmState {
  message: string
  confirmLabel: string
}

type ConfirmFn = (message: string, confirmLabel?: string) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

// Every destructive action across the Notes tool (deleting a note, a whole day/tag group, a daily-todo
// template) goes through this instead of the browser's native window.confirm() — that popup is styled
// by the OS/browser chrome and looks jarringly out of place next to the app's own UI. Usage:
// `const confirm = useNotesConfirm(); if (await confirm('Delete this note?')) …` — same call shape as
// window.confirm, just async and rendered in-app.
export function useNotesConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useNotesConfirm must be used within NotesConfirmProvider')
  return ctx
}

// Mounted once near the root of the Notes tool (see layout.tsx) — renders at most one dialog at a
// time. A second confirm() call while one is already open would overwrite `resolveRef` and silently
// resolve the first as false; nothing in this app fires two confirms back to back, so that edge case
// is left unhandled rather than adding a queue nothing exercises.
export function NotesConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null)
  const resolveRef = useRef<((v: boolean) => void) | null>(null)

  const confirm = useCallback<ConfirmFn>((message, confirmLabel = 'Delete') => {
    return new Promise((resolve) => {
      resolveRef.current = resolve
      setState({ message, confirmLabel })
    })
  }, [])

  const respond = useCallback((value: boolean) => {
    setState(null)
    resolveRef.current?.(value)
    resolveRef.current = null
  }, [])

  useEffect(() => {
    if (!state) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') respond(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, respond])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="nt-confirm-overlay" onClick={() => respond(false)}>
            <div className="nt-confirm-dialog" onClick={(e) => e.stopPropagation()}>
              <p className="nt-confirm-message">{state.message}</p>
              <div className="nt-confirm-actions">
                <button type="button" className="nt-confirm-cancel" onClick={() => respond(false)}>
                  Cancel
                </button>
                <button type="button" className="nt-confirm-ok" onClick={() => respond(true)} autoFocus>
                  {state.confirmLabel}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </ConfirmContext.Provider>
  )
}
