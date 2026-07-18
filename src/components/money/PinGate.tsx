'use client'

import { useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'

const PIN = process.env.NEXT_PUBLIC_MONEY_PIN ?? ''
const PIN_LENGTH = 4
const UNLOCK_KEY = 'money_unlocked_until'
const UNLOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 1 tuần

const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): boolean {
  const until = Number(window.localStorage.getItem(UNLOCK_KEY) ?? 0)
  return Date.now() < until
}

function getServerSnapshot(): boolean {
  return false
}

// Ghi lại thời điểm hết hạn mở khoá rồi báo cho useSyncExternalStore re-render.
function unlock() {
  window.localStorage.setItem(UNLOCK_KEY, String(Date.now() + UNLOCK_DURATION_MS))
  listeners.forEach((listener) => listener())
}

// Bàn phím kiểu dialpad điện thoại (giống màn khoá PIN của Telegram) — mỗi số có chữ cái phụ bên dưới.
const KEYPAD: { digit: string; letters: string }[] = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
]

export function PinGate({ children }: { children: ReactNode }) {
  const unlocked = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  function handleDigit(digit: string) {
    if (pin.length >= PIN_LENGTH) return
    const next = pin + digit
    setError(false)
    setPin(next)

    if (next.length === PIN_LENGTH) {
      if (next === PIN) {
        unlock()
      } else {
        setError(true)
        setTimeout(() => setPin(''), 400)
      }
    }
  }

  function handleBackspace() {
    setPin((p) => p.slice(0, -1))
  }

  return (
    <div className="money-root flex min-h-dvh flex-col items-center justify-center gap-9 px-6">
      <div className="text-center">
        <p className="text-5xl">🔐</p>
        <h1 className="mt-4 text-lg font-bold">Nhập mã PIN</h1>
        <p className="mt-1 text-sm text-muted">Bảo vệ dữ liệu thu chi của bạn</p>
      </div>

      <div className={`flex gap-3 ${error ? 'animate-[shake_0.4s]' : ''}`}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = pin.length > i
          const active = pin.length === i
          return (
            <div
              key={i}
              className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 bg-card transition-colors ${
                error ? 'border-danger' : active || filled ? 'border-income' : 'border-border'
              }`}
            >
              {filled && (
                <span className={`h-2.5 w-2.5 rounded-full ${error ? 'bg-danger' : 'animate-[pop_180ms_ease-out] bg-income'}`} />
              )}
            </div>
          )
        })}
      </div>

      <p className={`-mt-6 text-sm text-danger transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>Sai mã PIN, thử lại</p>

      <div className="grid grid-cols-3 gap-x-10 gap-y-5">
        {KEYPAD.map(({ digit, letters }) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit)}
            className="flex flex-col items-center justify-center gap-1 py-1 transition-opacity active:opacity-50"
          >
            <span className="text-[28px] font-normal leading-none">{digit}</span>
            <span className="h-2.5 text-[10px] tracking-[0.2em] text-muted">{letters}</span>
          </button>
        ))}
        <div />
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="flex flex-col items-center justify-center gap-1 py-1 transition-opacity active:opacity-50"
        >
          <span className="text-[28px] font-normal leading-none">0</span>
          <span className="h-2.5 text-[10px] text-muted">+</span>
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          aria-label="Xoá"
          disabled={pin.length === 0}
          className="flex flex-col items-center justify-center gap-1 py-1 text-2xl text-muted transition-opacity active:opacity-50 disabled:opacity-0"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}
