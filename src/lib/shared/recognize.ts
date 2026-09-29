// Nhận diện giọng nói bằng Web Speech API có sẵn của trình duyệt (Chrome/Edge; Safari một phần; Firefox không có)
// — miễn phí, không cần key/backend, âm thanh do trình duyệt tự gửi tới dịch vụ nhận diện của nó. Không có API thì
// isRecognitionSupported() = false và giao diện phải cho người học cách khác (vd tự đánh giá).
interface Alternative {
  transcript: string
  confidence: number
}
interface RecognitionEvent {
  results: ArrayLike<ArrayLike<Alternative>>
}
interface Recognition {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: RecognitionEvent) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  onsoundstart: (() => void) | null
  onspeechstart: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type RecognitionCtor = new () => Recognition

function getCtor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function isRecognitionSupported(): boolean {
  return !!getCtor()
}

// Nghe 1 lượt. Mặc định tự dừng khi người nói ngắt hơi; continuous = true (câu dài, cần nói liền nhiều câu) thì nghe
// liên tục tới khi người dùng gọi hàm dừng (hoặc trình duyệt tự ngắt vì im lặng lâu) và gộp mọi đoạn nghe được.
// onResult được gọi 1 lần lúc kết thúc, nhận các cách nghe khác nhau (tốt nhất trước; chế độ liên tục chỉ có 1 cách);
// onError nhận mã lỗi của trình duyệt ('not-allowed' = chưa cấp quyền micro, 'no-speech' = không nghe thấy gì...);
// nếu phiên kết thúc mà không có kết quả lẫn lỗi (trình duyệt hay im lặng như vậy) thì tự báo 'no-sound' (micro không
// thu được tiếng) hoặc 'no-result' (có tiếng nhưng dịch vụ nhận diện không trả kết quả); onEnd luôn được gọi cuối cùng. Trả về hàm dừng sớm.
export function listenOnce(opts: { lang: string; continuous?: boolean; onResult: (heard: string[]) => void; onError: (code: string) => void; onEnd: () => void }): () => void {
  const Ctor = getCtor()
  if (!Ctor) {
    opts.onError('unsupported')
    opts.onEnd()
    return () => {}
  }
  const rec = new Ctor()
  rec.lang = opts.lang
  rec.continuous = !!opts.continuous
  rec.interimResults = false
  rec.maxAlternatives = opts.continuous ? 1 : 3
  let heard: string[] | null = null
  let sawSound = false
  let errored = false
  rec.onsoundstart = () => {
    sawSound = true
  }
  rec.onspeechstart = () => {
    sawSound = true
  }
  rec.onresult = (e) => {
    if (opts.continuous) {
      // e.results giữ TẤT CẢ các đoạn đã chốt từ đầu phiên → ghép lại thành 1 câu dài
      heard = [Array.from(e.results, (r) => r[0]?.transcript ?? '').join(' ').trim()]
    } else {
      const first = e.results[0]
      if (first) heard = Array.from(first, (a) => a.transcript)
    }
  }
  rec.onerror = (e) => {
    errored = true
    opts.onError(e.error)
  }
  rec.onend = () => {
    if (heard && heard.some(Boolean)) opts.onResult(heard)
    else if (!errored) opts.onError(sawSound ? 'no-result' : 'no-sound')
    opts.onEnd()
  }
  try {
    rec.start()
  } catch {
    opts.onError('start-failed')
    opts.onEnd()
  }
  return () => rec.stop()
}

export function speechWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[‘’´`]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

// So khớp câu nghe được với câu mẫu: độ dài dãy con chung dài nhất (LCS) theo từ / số từ của câu mẫu. Trả về tỉ lệ
// tốt nhất trong các cách nghe và tập chỉ số từ của câu mẫu đã nói đúng (để tô màu từng từ).
export function matchSpeech(target: string, heard: string[]): { ratio: number; hit: Set<number>; best: string } {
  const t = speechWords(target)
  let best = { ratio: 0, hit: new Set<number>(), text: heard[0] ?? '' }
  for (const h of heard) {
    const s = speechWords(h)
    const dp: number[][] = Array.from({ length: t.length + 1 }, () => new Array<number>(s.length + 1).fill(0))
    for (let i = 1; i <= t.length; i++) for (let j = 1; j <= s.length; j++) dp[i][j] = t[i - 1] === s[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
    const hit = new Set<number>()
    for (let i = t.length, j = s.length; i > 0 && j > 0; ) {
      if (t[i - 1] === s[j - 1]) {
        hit.add(i - 1)
        i--
        j--
      } else if (dp[i - 1][j] >= dp[i][j - 1]) i--
      else j--
    }
    // Nói thừa nhiều từ cũng bị trừ: chia cho max(số từ mẫu, số từ nghe được)
    const ratio = t.length === 0 ? 0 : dp[t.length][s.length] / Math.max(t.length, s.length)
    if (ratio > best.ratio || best.text === '') best = { ratio, hit, text: h }
  }
  return { ratio: best.ratio, hit: best.hit, best: best.text }
}

export const PASS_RATIO = 0.8
// Câu càng dài thì lỗi nhận diện càng dồn lại nhiều → hạ ngưỡng đạt cho đoạn dài (> LONG_WORDS từ)
export const LONG_WORDS = 20
export function passRatioFor(target: string): number {
  return speechWords(target).length > LONG_WORDS ? 0.7 : PASS_RATIO
}
