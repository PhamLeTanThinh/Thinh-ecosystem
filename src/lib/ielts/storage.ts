import type { IeltsPage, VocabEntry } from './types'

async function req<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
  })
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${url} failed: ${res.status}`)
  return res.json()
}

// Pages/vocab là tài liệu dài, sửa liên tục theo từng trang riêng lẻ — dùng CRUD theo từng bản ghi
// (không bulk-replace toàn bộ như notes/habits), tránh phải gửi lại mọi trang khác mỗi lần lưu 1 trang.
export const storage = {
  getPages: () => req<IeltsPage[]>('/api/ielts/pages'),
  createPage: (page: IeltsPage) => req<IeltsPage>('/api/ielts/pages', { method: 'POST', body: JSON.stringify(page) }),
  updatePage: (id: string, patch: Partial<Pick<IeltsPage, 'title' | 'content' | 'sortOrder'>>) =>
    req<IeltsPage>(`/api/ielts/pages/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deletePage: (id: string) => req<{ ok: true }>(`/api/ielts/pages/${id}`, { method: 'DELETE' }),

  getVocab: () => req<VocabEntry[]>('/api/ielts/vocab'),
  createVocab: (entry: VocabEntry) => req<VocabEntry>('/api/ielts/vocab', { method: 'POST', body: JSON.stringify(entry) }),
  updateVocab: (id: string, patch: Partial<Omit<VocabEntry, 'id' | 'createdAt'>>) =>
    req<VocabEntry>(`/api/ielts/vocab/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  deleteVocab: (id: string) => req<{ ok: true }>(`/api/ielts/vocab/${id}`, { method: 'DELETE' }),
}
