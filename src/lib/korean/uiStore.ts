import { create } from 'zustand'

interface KoreanUIState {
  addCardOpen: boolean
  addCardKey: number
  openAddCard: () => void
  closeAddCard: () => void
  // Nhóm cấp độ đang mở trong Sidebar (TOPIK I/II) — CHỈ 1 nhóm mở tại 1 thời điểm (kiểu accordion,
  // giống Kiến thức/Làm đề/Vocab bên IELTS không bao giờ mở chồng lên nhau) để menu không bị dài
  // loằng ngoằng khi mở nhiều nhóm cùng lúc. Sống ở store module-level (không reset khi component
  // unmount) để KHÔNG bị đóng lại mỗi lần chuyển bài (Sidebar giờ remount theo route, xem
  // components/korean/KoreanApp.tsx). Vẫn thu gọn khi F5/vào lại trang vì store không persist ra
  // localStorage — đúng hành vi cũ, chỉ khác là sống sót qua điều hướng trong-app.
  openGroupKey: string | null
  toggleGroup: (key: string) => void
  openGroupOnce: (key: string) => void
  // Đích điều hướng sống ở store để component mới sau khi remount vẫn biết lúc nào route đã hoàn tất.
  // Loading được bật ngay khi chọn bài và chỉ nhả cờ điều hướng khi URL thực tế khớp đích này.
  navigatingTo: string | null
  beginNavigating: (path: string) => void
  endNavigating: () => void
}

// `addCardKey` bumps on every open so the modal's form remounts with fresh state
// instead of needing a reset effect (same convention as lib/chinese/uiStore.ts).
export const useKoreanUIStore = create<KoreanUIState>((set) => ({
  addCardOpen: false,
  addCardKey: 0,
  openAddCard: () => set((s) => ({ addCardOpen: true, addCardKey: s.addCardKey + 1 })),
  closeAddCard: () => set({ addCardOpen: false }),
  openGroupKey: null,
  toggleGroup: (key) => set((s) => ({ openGroupKey: s.openGroupKey === key ? null : key })),
  // Dùng khi điều hướng từ màn hình chọn cấp độ vào (mang qua ?open=) — LUÔN đặt thành nhóm đó (không
  // toggle) vì đây là lần đầu vào, không phải người dùng bấm lại nhóm đang mở để đóng nó.
  openGroupOnce: (key) => set({ openGroupKey: key }),
  navigatingTo: null,
  beginNavigating: (path) => set({ navigatingTo: path }),
  endNavigating: () => set({ navigatingTo: null }),
}))
