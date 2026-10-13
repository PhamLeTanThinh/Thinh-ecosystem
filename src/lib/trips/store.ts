'use client'

import { create } from 'zustand'
import { BACKGROUND_HEADER } from '@/lib/loading/tracker'
import { askConfirm, showError } from './dialog'
import { openingEntryId, type EntryPhoto, type Fund, type FundEntry, type FundMember, type FundRound } from './types'

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  // Thao tác ghi đánh dấu X-Background: không bật overlay toàn trang (TripsLoading), nút bấm tự hiện spinner
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (init?.method && init.method !== 'GET') headers[BACKGROUND_HEADER] = '1'
  const res = await fetch(url, { ...init, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `Lỗi ${res.status}`)
  return data as T
}

export type FundInput = Omit<Fund, 'createdAt' | 'closedAt' | 'coverImage' | 'shareSlug'>
// attachments không bắt buộc: không gửi = server giữ nguyên ảnh cũ của khoản
export type EntryInput = Omit<FundEntry, 'createdAt' | 'attachments' | 'originalAmount' | 'originalCurrency'> & { attachments?: EntryPhoto[] }
export type RoundInput = Omit<FundRound, 'createdAt' | 'sortOrder'>
export type MemberInput = Pick<FundMember, 'id' | 'fundId' | 'name'> &
  Partial<Pick<FundMember, 'joinedAt' | 'leftAt' | 'note' | 'contact' | 'sortOrder'>>

interface TripsState {
  funds: Fund[] | null
  members: FundMember[]
  rounds: FundRound[]
  entries: FundEntry[]
  loadError: string
  load: () => Promise<void>
  // roundName: tên đợt đầu (quỹ góp / khác tự tạo sẵn đợt đầu)
  createFund: (fund: FundInput, members: { id: string; name: string }[], roundName?: string) => Promise<Fund>
  updateFund: (fund: Partial<FundInput> & { id: string }) => Promise<Fund>
  deleteFund: (id: string) => Promise<void>
  // Link chia sẻ chỉ-xem: enable (giữ link cũ nếu đã có) / regenerate (link cũ hết hiệu lực) / disable
  setShare: (fundId: string, action: 'enable' | 'disable' | 'regenerate') => Promise<Fund>
  addMember: (member: MemberInput) => Promise<void>
  updateMember: (member: Partial<FundMember> & { id: string }) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  createRound: (round: RoundInput, opts?: { newMembers?: { id: string; name: string }[]; adoptOrphans?: boolean }) => Promise<FundRound>
  updateRound: (round: Partial<FundRound> & { id: string }) => Promise<void>
  deleteRound: (id: string) => Promise<void>
  saveEntries: (entries: EntryInput[], isNew: boolean) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  // Đặt số dư ban đầu (nhập tay) của 1 đợt — 0 thì xoá; date: ngày ghi nhận
  setRoundOpening: (round: Pick<FundRound, 'id' | 'fundId'>, amount: number, date: string) => Promise<void>
}

const replace = <T extends { id: string }>(list: T[], item: T) => list.map((x) => (x.id === item.id ? item : x))

// Dữ liệu dùng chung cho /trips và /trips/[id] — tải 1 lần, mọi thay đổi gọi API rồi cập nhật tại chỗ.
export const useTrips = create<TripsState>((set, get) => ({
  funds: null,
  members: [],
  rounds: [],
  entries: [],
  loadError: '',

  load: async () => {
    if (get().funds) return
    try {
      const data = await api<{ funds: Fund[]; members: FundMember[]; rounds: FundRound[]; entries: FundEntry[] }>('/api/trips')
      set({ funds: data.funds, members: data.members, rounds: data.rounds, entries: data.entries, loadError: '' })
    } catch (e) {
      set({ loadError: (e as Error).message })
    }
  },

  createFund: async (fund, members, roundName) => {
    const res = await api<{ fund: Fund; members: FundMember[]; rounds: FundRound[] }>('/api/trips', {
      method: 'POST',
      body: JSON.stringify({ ...fund, members, roundName }),
    })
    set((s) => ({ funds: [res.fund, ...(s.funds ?? [])], members: [...s.members, ...res.members], rounds: [...s.rounds, ...res.rounds] }))
    return res.fund
  },

  updateFund: async (fund) => {
    const saved = await api<Fund>('/api/trips', { method: 'PATCH', body: JSON.stringify(fund) })
    set((s) => ({ funds: replace(s.funds ?? [], saved) }))
    return saved
  },

  setShare: async (fundId, action) => {
    const saved = await api<Fund>('/api/trips/share', { method: 'PATCH', body: JSON.stringify({ fundId, action }) })
    set((s) => ({ funds: replace(s.funds ?? [], saved) }))
    return saved
  },

  deleteFund: async (id) => {
    await api('/api/trips?id=' + encodeURIComponent(id), { method: 'DELETE' })
    set((s) => ({
      funds: (s.funds ?? []).filter((f) => f.id !== id),
      members: s.members.filter((m) => m.fundId !== id),
      rounds: s.rounds.filter((r) => r.fundId !== id),
      entries: s.entries.filter((e) => e.fundId !== id),
    }))
  },

  addMember: async (member) => {
    const saved = await api<FundMember>('/api/trips/members', { method: 'POST', body: JSON.stringify(member) })
    set((s) => ({ members: [...s.members, saved] }))
  },

  updateMember: async (member) => {
    const saved = await api<FundMember>('/api/trips/members', { method: 'PATCH', body: JSON.stringify(member) })
    set((s) => ({ members: replace(s.members, saved) }))
  },

  deleteMember: async (id) => {
    await api('/api/trips/members?id=' + encodeURIComponent(id), { method: 'DELETE' })
    set((s) => ({
      members: s.members.filter((m) => m.id !== id),
      rounds: s.rounds.map((r) => (r.memberIds.includes(id) ? { ...r, memberIds: r.memberIds.filter((x) => x !== id) } : r)),
      funds: (s.funds ?? []).map((f) => (f.treasurerId === id ? { ...f, treasurerId: null } : f)),
    }))
  },

  createRound: async (round, opts = {}) => {
    const res = await api<{ round: FundRound; members: FundMember[] }>('/api/trips/rounds', {
      method: 'POST',
      body: JSON.stringify({ ...round, newMembers: opts.newMembers ?? [], adoptOrphans: opts.adoptOrphans ?? false }),
    })
    set((s) => ({
      rounds: [...s.rounds, res.round],
      members: [...s.members, ...res.members],
      // Khoản chưa thuộc đợt nào đã được server gom vào đợt này
      entries: opts.adoptOrphans ? s.entries.map((e) => (e.fundId === round.fundId && !e.roundId ? { ...e, roundId: res.round.id } : e)) : s.entries,
    }))
    return res.round
  },

  updateRound: async (round) => {
    const saved = await api<FundRound>('/api/trips/rounds', { method: 'PATCH', body: JSON.stringify(round) })
    set((s) => ({ rounds: replace(s.rounds, saved) }))
  },

  deleteRound: async (id) => {
    await api('/api/trips/rounds?id=' + encodeURIComponent(id), { method: 'DELETE' })
    set((s) => ({ rounds: s.rounds.filter((r) => r.id !== id) }))
  },

  saveEntries: async (entries, isNew) => {
    const saved = await Promise.all(
      entries.map((e) => api<FundEntry>('/api/trips/entries', { method: isNew ? 'POST' : 'PATCH', body: JSON.stringify(e) })),
    )
    const ids = new Set(saved.map((e) => e.id))
    set((s) => ({ entries: [...s.entries.filter((e) => !ids.has(e.id)), ...saved] }))
  },

  setRoundOpening: async (round, amount, date) => {
    const id = openingEntryId(round.id)
    const existing = get().entries.find((e) => e.id === id)
    if (amount <= 0) {
      if (existing) await get().deleteEntry(id)
      return
    }
    if (existing && existing.amount === amount) return
    const entry = {
      id,
      fundId: round.fundId,
      roundId: round.id,
      type: 'in' as const,
      amount,
      date: existing?.date ?? date,
      dueDate: null,
      done: true,
      memberId: null,
      toMemberId: null,
      splitMode: 'equal' as const,
      splits: [],
      category: 'carryover',
      note: 'Số dư ban đầu',
    }
    await get().saveEntries([entry], !existing)
  },

  deleteEntry: async (id) => {
    await api('/api/trips/entries?id=' + encodeURIComponent(id), { method: 'DELETE' })
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }))
  },
}))

// Hỏi xác nhận (nêu rõ sẽ mất bao nhiêu khoản / thành viên) rồi xoá quỹ. Trả về true nếu đã xoá.
// onStart: gọi ngay khi người dùng bấm "Xoá" (để nút bật spinner) — không gọi nếu huỷ.
export async function confirmDeleteFund(fund: Pick<Fund, 'id' | 'name'>, onStart?: () => void): Promise<boolean> {
  const { entries, members, deleteFund } = useTrips.getState()
  const nEntries = entries.filter((e) => e.fundId === fund.id).length
  const nMembers = members.filter((m) => m.fundId === fund.id).length
  const detail = [nEntries && `${nEntries} khoản thu chi`, nMembers && `${nMembers} thành viên`].filter(Boolean).join(' và ')
  const ok = await askConfirm({
    title: `Xoá "${fund.name}"?`,
    message: `${detail ? `Sẽ xoá luôn ${detail}. ` : ''}Không khôi phục lại được.`,
    confirmLabel: 'Xoá chuyến',
    tone: 'danger',
  })
  if (!ok) return false
  onStart?.()
  try {
    await deleteFund(fund.id)
    return true
  } catch (e) {
    await showError(e)
    return false
  }
}
