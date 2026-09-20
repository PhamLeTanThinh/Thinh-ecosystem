'use client'

import { useSyncExternalStore } from 'react'
import { speak } from '@/lib/shared/speech'

interface Props {
  text: string
  lang: string
  className?: string
  label?: string
  // Ghi đè tốc độ đọc mặc định theo lang (xem DEFAULT_RATE trong lib/shared/speech.ts) — hiếm khi
  // cần, chỉ dùng khi 1 chỗ gọi cụ thể muốn khác tốc độ chung của cả app.
  rate?: number
}

// speechSynthesis không đổi sau khi mount nên không cần subscribe thật — chỉ dùng useSyncExternalStore
// để đọc "có hỗ trợ hay không" theo đúng giá trị của MÔI TRƯỜNG HIỆN TẠI (server luôn false, client
// luôn đọc window thật) mà không phải setState trong effect (gây thêm 1 nhịp render thừa).
const subscribe = () => () => {}
const getSnapshot = () => 'speechSynthesis' in window
const getServerSnapshot = () => false

// Nút phát âm dùng chung cho Chinese/Korean — ẩn hẳn nếu trình duyệt không hỗ trợ Web Speech API
// (thay vì hiện nút bấm không có tác dụng).
export function SpeakButton({ text, lang, className = '', label = 'Phát âm', rate }: Props) {
  const supported = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!supported || !text.trim()) return null

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={className}
      // Nhiều nơi dùng nút này lồng trong thẻ có thao tác kéo/chạm riêng (FlashCard quẹt, VocabTile
      // bấm chọn) — chặn cả pointerdown lẫn click để không vô tình kích hoạt gesture của thẻ cha.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        speak(text, lang, rate)
      }}
    >
      🔊
    </button>
  )
}
