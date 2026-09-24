// Máy trạng thái cho loading dùng chung các app (IELTS, Chinese, Korean...): hiện lúc trang chưa load
// xong hoặc còn request tới `apiPrefix` của app đó đang bay, ẩn khi hết cả hai. Đặt ngoài React
// (external store) để component chỉ việc đọc bằng useSyncExternalStore.
//
// Mỗi app tạo 1 tracker riêng theo tiền tố API của mình (vd '/api/ielts') — request của app này
// không làm loading của app khác hiện lên. Toàn bộ chỉ patch window.fetch đúng 1 lần.
//
// Patch fetch và tạo tracker ở cấp module chứ KHÔNG trong useEffect: effect của component con chạy
// trước effect của cha, nên nếu patch trong effect thì lượt hydrate đầu tiên đã gọi fetch xong trước
// khi patch kịp có hiệu lực và không được đếm. State đặt trên globalThis để HMR (module bị nạp lại)
// không làm bộ đếm và fetch đã patch trỏ về 2 bản khác nhau.
export const BACKGROUND_HEADER = 'x-background'
const MAX_TRACK_MS = 30_000 // request treo quá lâu thì thôi không đếm nữa, tránh loading kẹt mãi
// Hiện tối thiểu + trễ khi ẩn để request nhanh, hoặc nhiều request nối tiếp nhau, không làm nó nháy.
const MIN_VISIBLE_MS = 350
const HIDE_DELAY_MS = 200

export interface LoadingTracker {
  subscribe: (listener: () => void) => () => void
  getVisible: () => boolean
  setNavigationPending: (pending: boolean) => void
}

interface Entry {
  prefix: string
  pending: number
  navigationPending: boolean
  navigationTimer: number | null
  loaded: boolean
  visible: boolean
  shownAt: number
  hideTimer: number | null
  listeners: Set<() => void>
}

interface Registry {
  entries: Map<string, Entry>
  // fetch gốc của trình duyệt, giữ lại để mỗi lần module được nạp lại (HMR) có thể gắn wrapper MỚI lên đó
  // thay vì mãi dùng wrapper của bản code cũ (khiến sửa tracker không có hiệu lực nếu không F5).
  original: typeof fetch | null
}

const g = globalThis as typeof globalThis & { __appLoading?: Registry }
const registry: Registry = (g.__appLoading ??= { entries: new Map(), original: null })

function emit(entry: Entry) {
  entry.listeners.forEach((l) => l())
}

function recompute(entry: Entry) {
  const busy = !entry.loaded || entry.pending > 0 || entry.navigationPending
  if (busy) {
    if (entry.hideTimer !== null) {
      window.clearTimeout(entry.hideTimer)
      entry.hideTimer = null
    }
    if (!entry.visible) {
      entry.visible = true
      entry.shownAt = Date.now()
      emit(entry)
    }
    return
  }
  if (!entry.visible || entry.hideTimer !== null) return
  const wait = Math.max(HIDE_DELAY_MS, MIN_VISIBLE_MS - (Date.now() - entry.shownAt))
  entry.hideTimer = window.setTimeout(() => {
    entry.hideTimer = null
    entry.visible = false
    emit(entry)
  }, wait)
}

function apiPathname(input: RequestInfo | URL): string | null {
  try {
    const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const url = new URL(raw, window.location.href)
    return url.origin === window.location.origin ? url.pathname : null
  } catch {
    return null
  }
}

function patchFetchOnce() {
  registry.original ??= window.fetch.bind(window)
  const original = registry.original
  window.fetch = (input, init) => {
    // Request nền (lưu tiến trình…) tự đánh dấu header X-Background thì không bật loading.
    if (new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined)).has(BACKGROUND_HEADER)) return original(input, init)
    const pathname = apiPathname(input)
    const matched = pathname ? [...registry.entries.values()].filter((e) => pathname.startsWith(e.prefix)) : []
    if (matched.length === 0) return original(input, init)

    matched.forEach((e) => {
      e.pending += 1
      recompute(e)
    })
    let released = false
    const release = () => {
      if (released) return
      released = true
      window.clearTimeout(timer)
      matched.forEach((e) => {
        e.pending -= 1
        recompute(e)
      })
    }
    const timer = window.setTimeout(release, MAX_TRACK_MS)
    return original(input, init).finally(release)
  }
}

export function createLoadingTracker(apiPrefix: string): LoadingTracker {
  let entry = registry.entries.get(apiPrefix)
  if (!entry) {
    // visible khởi tạo true: loading hiện từ khung hình đầu (cả lúc SSR) cho tới khi trang load xong.
    const created: Entry = {
      prefix: apiPrefix,
      pending: 0,
      navigationPending: false,
      navigationTimer: null,
      loaded: false,
      visible: true,
      shownAt: Date.now(),
      hideTimer: null,
      listeners: new Set(),
    }
    entry = created
    registry.entries.set(apiPrefix, created)

    if (typeof window !== 'undefined') {
      patchFetchOnce()
      const markLoaded = () => {
        created.loaded = true
        recompute(created)
      }
      if (document.readyState === 'complete') markLoaded()
      else window.addEventListener('load', markLoaded, { once: true })
    }
  }

  const e = entry
  return {
    subscribe(listener) {
      e.listeners.add(listener)
      return () => {
        e.listeners.delete(listener)
      }
    },
    getVisible: () => e.visible,
    setNavigationPending(pending) {
      e.navigationPending = pending
      if (e.navigationTimer !== null) {
        window.clearTimeout(e.navigationTimer)
        e.navigationTimer = null
      }
      // Route errors must not be able to leave the full-page overlay stuck forever.
      if (pending) {
        e.navigationTimer = window.setTimeout(() => {
          e.navigationTimer = null
          e.navigationPending = false
          recompute(e)
        }, MAX_TRACK_MS)
      }
      recompute(e)
    },
  }
}

// Gắn lại wrapper mỗi lần module được nạp (kể cả HMR) để luôn dùng bản logic mới nhất.
if (typeof window !== 'undefined') patchFetchOnce()
