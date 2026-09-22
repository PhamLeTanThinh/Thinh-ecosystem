// Phát âm bằng Web Speech API có sẵn của trình duyệt — miễn phí, không cần key/backend. Chất lượng
// giọng phụ thuộc vào danh sách giọng đã cài trên máy người dùng: Chrome/Edge desktop thường có cả
// giọng "network" của Google (tự nhiên hơn hẳn, vd "Google 普通话（中国大陆）") lẫn giọng "local" của
// OS (Windows/macOS, thường cứng hơn) cho cùng 1 lang — mặc định trình duyệt hay chọn giọng local
// trước, nên bên dưới chủ động dò danh sách để ưu tiên giọng Google/network nếu máy có.
let cachedVoices: SpeechSynthesisVoice[] = []

function refreshVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) cachedVoices = voices
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  refreshVoices()
  // Nhiều trình duyệt (đặc biệt Chrome) tải danh sách giọng bất đồng bộ — lúc module này chạy lần
  // đầu getVoices() có thể trả về mảng rỗng, danh sách thật chỉ sẵn sàng sau sự kiện này.
  window.speechSynthesis.onvoiceschanged = refreshVoices
}

// Chọn giọng phù hợp nhất cho 1 mã ngôn ngữ (vd 'zh-CN', 'ko-KR'): ưu tiên giọng Google/network
// (localService === false) đúng lang, sau đó tới bất kỳ giọng nào khớp lang, cuối cùng để trình
// duyệt tự chọn theo utterance.lang nếu không tìm được giọng nào (trả về undefined).
function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  if (cachedVoices.length === 0) refreshVoices()
  const matching = cachedVoices.filter((v) => v.lang.toLowerCase() === lang.toLowerCase())
  if (matching.length === 0) return undefined
  return matching.find((v) => !v.localService) ?? matching[0]
}

// Tốc độ đọc mặc định theo ngôn ngữ — 1 là tốc độ gốc của giọng. Giọng ko-KR (cả local lẫn Google
// network) đọc nhanh hơn cảm nhận thông thường của người mới học so với zh-CN, nên hạ tốc độ riêng
// cho tiếng Hàn thay vì chỉnh chung (sẽ làm zh-CN vốn đang ổn bị đọc chậm lại không cần thiết).
const DEFAULT_RATE: Record<string, number> = {
  'ko-KR': 0.65,
}

export function speak(text: string, lang: string, rate?: number) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const trimmed = text.trim()
  if (!trimmed) return
  // Huỷ lượt đọc trước đó (nếu có) — tránh 2 câu chồng lên nhau khi bấm liên tiếp nhiều nút.
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(trimmed)
  utterance.lang = lang
  utterance.rate = rate ?? DEFAULT_RATE[lang] ?? 1
  const voice = pickVoice(lang)
  if (voice) utterance.voice = voice
  window.speechSynthesis.speak(utterance)
}

// Đọc nối tiếp nhiều câu (vd term → định nghĩa EN → định nghĩa VI) — khác speak() ở chỗ các câu
// không huỷ lẫn nhau giữa chừng, chỉ huỷ lượt đọc TRƯỚC ĐÓ khi bắt đầu 1 hàng đợi mới.
export function speakQueue(items: { text: string; lang: string; rate?: number }[]) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const queue = items.filter((it) => it.text.trim())

  function playNext(i: number) {
    if (i >= queue.length) return
    const { text, lang, rate } = queue[i]
    const utterance = new SpeechSynthesisUtterance(text.trim())
    utterance.lang = lang
    utterance.rate = rate ?? DEFAULT_RATE[lang] ?? 1
    const voice = pickVoice(lang)
    if (voice) utterance.voice = voice
    utterance.onend = () => playNext(i + 1)
    window.speechSynthesis.speak(utterance)
  }

  playNext(0)
}
