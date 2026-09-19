'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { ShieldedVideo } from '@/components/media/ShieldedVideo'

// Con mèo ở đầu trang /study + 2 câu thoại LUÂN PHIÊN nhau trong cùng 1 chỗ: câu 1 bật lên, gõ chữ, giữ một
// lúc rồi thu lại; sau đó câu 2 bật lên, gõ, giữ, thu lại; rồi lặp lại mãi. Chỉ có 1 bong bóng hiện tại mỗi
// thời điểm. Là client component vì cần bộ đếm thời gian; phần còn lại của trang vẫn là server component.
//
// Mỗi câu chia thành các đoạn để tô màu riêng tên "Diên" / "Diennie" mà vẫn gõ liền mạch theo tổng số ký tự.
interface Segment {
  text: string
  em?: boolean
}

const MESSAGES: Segment[][] = [
  // '\n' = xuống dòng cố định (bong bóng dùng white-space: pre-line nên bản chữ ẩn và bản gõ cùng ngắt đúng chỗ).
  [{ text: 'Xin chào, em là ' }, { text: 'Diên', em: true }, { text: '\n' }, { text: 'aka ' }, { text: 'Diennie', em: true }, { text: '!' }],
  [{ text: 'Anh chị học cùng ' }, { text: 'Diên', em: true }, { text: ' nha!' }],
]

const PLAIN = MESSAGES.map((segs) => segs.map((s) => s.text).join(''))
// Vị trí ký tự bắt đầu của từng đoạn trong câu — để cắt mỗi đoạn theo số ký tự đã gõ.
const OFFSETS = MESSAGES.map((segs) => segs.map((_, i) => segs.slice(0, i).reduce((n, s) => n + s.text.length, 0)))

const START_DELAY_MS = 900 // chờ trang tải xong mới bắt đầu
const POP_MS = 450 // bong bóng bật lên xong mới gõ
const CHAR_INTERVAL_MS = 55
const HOLD_MS = 2600 // giữ câu đã gõ xong cho người đọc kịp đọc
const GAP_MS = 500 // bong bóng thu lại xong (transition 0.3-0.55s) mới bật câu kế tiếp

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'
function subscribeReduced(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

export function MascotSpeech() {
  const [msg, setMsg] = useState(0) // câu đang hiện
  const [typed, setTyped] = useState(0) // số ký tự đã gõ của câu đó
  const [visible, setVisible] = useState(false)
  // Người bật giảm chuyển động: không tự đổi câu / gõ chữ (nội dung tự thay đổi không dừng được là bất tiện) —
  // hiện tĩnh cả 2 câu xếp chồng nhau. Server snapshot = false nên HTML đầu tiên giống nhau ở mọi máy.
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  )

  useEffect(() => {
    if (reduced) return

    let cancelled = false
    const timers = new Set<number>()
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id)
          resolve()
        }, ms)
        timers.add(id)
      })

    async function run() {
      await wait(START_DELAY_MS)
      for (let m = 0; !cancelled; m = (m + 1) % MESSAGES.length) {
        setMsg(m)
        setTyped(0)
        setVisible(true)
        await wait(POP_MS)
        for (let i = 1; i <= PLAIN[m].length; i++) {
          if (cancelled) return
          setTyped(i)
          await wait(CHAR_INTERVAL_MS)
        }
        await wait(HOLD_MS)
        if (cancelled) return
        setVisible(false)
        await wait(GAP_MS)
      }
    }
    run()

    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [reduced])

  return (
    <div className="sd-mascot">
      <div className="sd-says" aria-hidden="true" data-static={reduced || undefined}>
        {MESSAGES.map((segs, m) => {
          const active = reduced || (m === msg && visible)
          const shownCount = reduced ? PLAIN[m].length : m === msg ? typed : 0
          const typing = !reduced && active && shownCount < PLAIN[m].length
          return (
            <div key={m} className="sd-say" data-hidden={active ? undefined : ''}>
              {/* Bản chữ ẩn giữ nguyên kích thước bong bóng ngay từ đầu (bong bóng không phình ra khi gõ).
                  Phải dùng đúng các đoạn đậm như chữ gõ: chữ đậm rộng hơn nên nếu bản ẩn viết nét thường thì
                  2 bản ngắt dòng khác nhau và chữ gõ tràn ra khỏi bong bóng. */}
              <span className="sd-say-ghost">
                {segs.map((s, i) => (
                  <span key={i} className={s.em ? 'sd-say-em' : undefined}>
                    {s.text}
                  </span>
                ))}
              </span>
              <span className="sd-say-text">
                {segs.map((s, i) => {
                  const shown = s.text.slice(0, Math.max(0, shownCount - OFFSETS[m][i]))
                  return shown ? (
                    <span key={i} className={s.em ? 'sd-say-em' : undefined}>
                      {shown}
                    </span>
                  ) : null
                })}
                {/* Con trỏ chỉ có trong lúc đang gõ; gõ xong thì gỡ luôn, câu đứng yên cho tới lúc thu lại. */}
                {typing && <i className="sd-say-caret" />}
              </span>
            </div>
          )
        })}
      </div>
      <span className="sr-only">{PLAIN.join(' ')}</span>
      <ShieldedVideo className="sd-mascot-video" mediaKey="study-mascot" />
    </div>
  )
}
