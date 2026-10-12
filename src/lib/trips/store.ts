'use client'

import { create } from 'zustand'
import { BACKGROUND_HEADER } from '@/lib/loading/tracker'
import { askConfirm, showError } from './dialog'
import type { Fund, FundEntry, FundMember } from './types'

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
export type EntryInput = Omit<FundEntry, 'createdAt' | 'attachments' | 'originalAmount' | 'originalCurrency'>
export type MemberInput = Pick<FundMember, 'id' | 'fundId' | 'name'> & Partial<Pick<FundMember, 'joinedAt' | 'leftAt' | 'note' | 'contact' | 'sortOrder'>>

interface TripsState {
  funds: Fund[] | null
  members: FundMember[]
  entries: FundEntry[]
  loadError: string
  load: () => Promise<void>
  createFund: (fund: FundInput, members: { id: string; name: string }[]) => Promise<Fund>
  updateFund: (fund: Partial<FundInput> & { id: string }) => Promise<Fund>
  deleteFund: (id: string) => Promise<void>
  addMember: (member: MemberInput) => Promise<void>
  updateMember: (member: Partial<FundMember> & { id: string }) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  saveEntries: (entries: EntryInput[], isNew: boolean) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
}

const replace = <T extends { id: string }>(list: T[], item: T) => list.map((x) => (x.id === item.id ? item : x))

// Dữ liệu dùng chung cho /trips và /trips/[id] — tải 1 lần, mọi thay đổi gọi API rồi cập nhật tại chỗ.
export const useTrips = create<TripsState>((set, get) => ({
  funds: null,
  members: [],
  entries: [],
  loadError: '',

  load: async () => {
    if (get().funds) return
    try {
      const data = await api<{ funds: Fund[]; members: FundMember[]; entries: FundEntry[] }>('/api/trips')
      set({ funds: data.funds, members: data.members, entries: data.entries, loadError: '' })
    } catch (e) {
      set({ loadError: (e as Error).message })
    }
  },

  createFund: async (fund, members) => {
    const res = await api<{ fund: Fund; members: FundMember[] }>('/api/trips', { method: 'POST', body: JSON.stringify({ ...fund, members }) })
    set((s) => ({ funds: [res.fund, ...(s.funds ?? [])], members: [...s.members, ...res.members] }))
    return res.fund
  },

  updateFund: async (fund) => {
    const saved = await api<Fund>('/api/trips', { method: 'PATCH', body: JSON.stringify(fund) })
    set((s) => ({ funds: replace(s.funds ?? [], saved) }))
    return saved
  },

  deleteFund: async (id) => {
    await api('/api/trips?id=' + encodeURIComponent(id), { method: 'DELETE' })
    set((s) => ({
      funds: (s.funds ?? []).filter((f) => f.id !== id),
      members: s.members.filter((m) => m.fundId !== id),
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
      funds: (s.funds ?? []).map((f) => (f.treasurerId === id ? { ...f, treasurerId: null } : f)),
    }))
  },

  saveEntries: async (entries, isNew) => {
    const saved = await Promise.all(
      entries.map((e) => api<FundEntry>('/api/trips/entries', { method: isNew ? 'POST' : 'PATCH', body: JSON.stringify(e) })),
    )
    const ids = new Set(saved.map((e) => e.id))
    set((s) => ({ entries: [...s.entries.filter((e) => !ids.has(e.id)), ...saved] }))
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
