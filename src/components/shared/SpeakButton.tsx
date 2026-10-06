'use client'

import { useState, useSyncExternalStore } from 'react'
import { speak, stopSpeaking } from '@/lib/shared/speech'

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

// Nút phát âm dùng chung (Chinese/Korean/IELTS) — ẩn hẳn nếu trình duyệt không hỗ trợ Web Speech API (thay vì hiện nút
// bấm không có tác dụng). Đang đọc thì icon thành ⏹ và bấm lần nữa để DỪNG; đọc xong / bị dừng / bị nút khác chen ngang
// (speak() huỷ lượt trước, lượt bị huỷ vẫn bắn onEnd) thì tự trở về 🔊.
export function SpeakButton({ text, lang, className = '', label = 'Phát âm', rate }: Props) {
  const supported = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [playing, setPlaying] = useState(false)

  if (!supported || !text.trim()) return null

  return (
    <button
      type="button"
      aria-label={playing ? 'Dừng đọc' : label}
      aria-pressed={playing}
      title={playing ? 'Dừng đọc' : label}
      className={className}
      // Nhiều nơi dùng nút này lồng trong thẻ có thao tác kéo/chạm riêng (FlashCard quẹt, VocabTile
      // bấm chọn) — chặn cả pointerdown lẫn click để không vô tình kích hoạt gesture của thẻ cha.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        if (playing) {
          stopSpeaking()
          setPlaying(false)
          return
        }
        setPlaying(true)
        speak(text, lang, rate, () => setPlaying(false))
      }}
    >
      {playing ? '⏹' : '🔊'}
    </button>
  )
}
