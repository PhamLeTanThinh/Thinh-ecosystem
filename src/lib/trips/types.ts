// Trip & Quỹ chung (/trips) — mỗi "quỹ" là 1 chuyến đi hoặc 1 lần góp tiền chung (mua quà, mua đồ...).
// Mọi khoản đều có ngày; khoản chưa diễn ra (done = false) là khoản DỰ KIẾN: "chờ thu" (hạn góp tiền) hoặc
// "dự chi" — chưa tính vào số dư, chỉ hiện để nhắc.
//
// Thành viên có thể vào / rời quỹ giữa chừng (joinedAt / leftAt). Người đã dính tới khoản nào thì không xoá hẳn,
// chỉ đánh dấu "đã rời" để số liệu cũ giữ nguyên. Mỗi khoản chi lưu RÕ danh sách người chịu (splits) ngay lúc ghi,
// nên người vào sau không bị tính chung các khoản chi trước đó.

import type { TripThemeKey } from './themes'

export type FundKind = 'trip' | 'fund' | 'other'

export const FUND_KINDS: { key: FundKind; icon: string; label: string }[] = [
  { key: 'trip', icon: '✈️', label: 'Chuyến đi' },
  { key: 'fund', icon: '🎁', label: 'Góp quỹ mua đồ' },
  { key: 'other', icon: '💼', label: 'Khác' },
]

export interface FundMember {
  id: string
  fundId: string
  name: string
  note: string
  contact: string // SĐT / STK / link — để nhắc góp tiền, chưa dùng ở UI
  color: string | null
  joinedAt: string | null // 'YYYY-MM-DD' — null = có mặt từ đầu
  leftAt: string | null // 'YYYY-MM-DD' — null = vẫn trong quỹ
  sortOrder: number
  createdAt: string
}

export interface Fund {
  id: string
  name: string
  kind: FundKind
  icon: string
  theme: TripThemeKey // giao diện riêng của chuyến — lib/trips/themes.ts
  note: string
  location: string
  currency: string // tiền tệ của quỹ — mọi `amount` đều tính theo đơn vị này (hiện chỉ dùng VND)
  startDate: string | null // 'YYYY-MM-DD'
  endDate: string | null
  target: number // tổng tiền cần gom (0 = không đặt)
  perMemberTarget: number // mỗi người cần góp (0 = không đặt)
  treasurerId: string | null // thành viên đang giữ tiền quỹ
  coverImage: string | null // chưa dùng ở UI
  shareSlug: string | null // link chia sẻ chỉ-xem cho nhóm — chưa dùng ở UI
  closed: boolean
  closedAt: string | null
  createdAt: string
}

// in = góp vào quỹ, out = chi ra, transfer = chuyển tiền trả nhau khi chia tiền (memberId → toMemberId, null = quỹ)
export type EntryType = 'in' | 'out' | 'transfer'

export type SplitMode = 'equal' | 'weight' | 'exact' // hiện UI chỉ dùng 'equal'

export interface EntrySplit {
  memberId: string
  value: number | null // weight: hệ số; exact: số tiền; equal: bỏ qua
}

export interface EntryPhoto {
  key: string
  url: string
}

// Đợt của 1 quỹ dùng lại nhiều lần (20/10, 8/3...). Người tham gia riêng từng đợt; tiền dư cuối đợt tự thành số
// dư đầu đợt sau (tính từ các khoản), phần dư / thiếu của từng người cũng mang sang (xem roundMemberView).
export interface FundRound {
  id: string
  fundId: string
  name: string
  note: string
  startDate: string | null
  endDate: string | null
  target: number
  perMemberTarget: number
  memberIds: string[]
  sortOrder: number
  closed: boolean
  createdAt: string
}

export function sortRounds(rounds: FundRound[]) {
  return [...rounds].sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt))
}

export interface FundEntry {
  id: string
  fundId: string
  roundId: string | null // đợt chứa khoản này (quỹ dùng nhiều đợt); null = quỹ không chia đợt
  type: EntryType
  amount: number // theo tiền tệ của quỹ
  originalAmount: number | null // số tiền gốc nếu chi bằng ngoại tệ — chưa dùng ở UI
  originalCurrency: string | null
  date: string // 'YYYY-MM-DD' — ngày thực thu / chi; với khoản dự kiến là ngày hẹn
  dueDate: string | null // hạn gốc của khoản dự kiến — giữ lại sau khi đã thu để biết trễ hay đúng hạn
  done: boolean // false = dự kiến (chờ thu / dự chi)
  // in: ai góp (null = nguồn khác: hoàn tiền, tiền thừa... — chia đều lại cho mọi người)
  // out: ai ứng tiền túi trả (null = chi từ quỹ). transfer: người chuyển (null = quỹ)
  memberId: string | null
  toMemberId: string | null // chỉ transfer: người nhận (null = quỹ)
  splitMode: SplitMode
  splits: EntrySplit[] // chỉ out: ai chịu khoản này
  category: string
  note: string
  attachments: EntryPhoto[] // ảnh hoá đơn — chưa dùng ở UI
  createdAt: string
}

export const OUT_CATEGORIES = [
  { key: 'food', icon: '🍜', label: 'Ăn uống' },
  { key: 'transport', icon: '🚗', label: 'Di chuyển' },
  { key: 'stay', icon: '🏨', label: 'Chỗ ở' },
  { key: 'ticket', icon: '🎟️', label: 'Vé / tham quan' },
  { key: 'shopping', icon: '🛍️', label: 'Mua sắm' },
  { key: 'gift', icon: '🎁', label: 'Quà' },
  { key: 'other', icon: '💸', label: 'Khác' },
] as const

export const IN_CATEGORIES = [
  { key: 'contribution', icon: '🤝', label: 'Góp quỹ' },
  // Tiền còn dư từ đợt / chuyến trước chuyển sang làm vốn đầu — người dùng tự nhập số tiền. Không gắn ai = tiền chung
  { key: 'carryover', icon: '♻️', label: 'Còn lại từ đợt trước' },
  { key: 'refund', icon: '↩️', label: 'Hoàn tiền' },
  { key: 'other', icon: '💰', label: 'Khác' },
] as const

export const TRANSFER_CATEGORIES = [{ key: 'settle', icon: '🔁', label: 'Chuyển tiền chia nhau' }] as const

export function categoriesOf(type: EntryType) {
  return type === 'in' ? IN_CATEGORIES : type === 'out' ? OUT_CATEGORIES : TRANSFER_CATEGORIES
}

export function categoryOf(type: EntryType, key: string) {
  const list: readonly { key: string; icon: string; label: string }[] = categoriesOf(type)
  return list.find((c) => c.key === key) ?? list[list.length - 1]
}

export function isFundKind(v: unknown): v is FundKind {
  return FUND_KINDS.some((k) => k.key === v)
}

export function isEntryType(v: unknown): v is EntryType {
  return v === 'in' || v === 'out' || v === 'transfer'
}

export function kindOf(key: FundKind) {
  return FUND_KINDS.find((k) => k.key === key) ?? FUND_KINDS[FUND_KINDS.length - 1]
}

export const isISODate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)

// Thành viên có trong quỹ vào ngày `date` không (chưa rời và đã vào)
export function isActiveOn(m: FundMember, date: string) {
  return (!m.joinedAt || m.joinedAt <= date) && (!m.leftAt || m.leftAt >= date)
}

export const isLeft = (m: FundMember) => !!m.leftAt

// Tổng cần gom: đặt riêng thì dùng, không thì = mỗi người góp × số người đang trong quỹ
export function effectiveTarget(fund: Fund, members: FundMember[]) {
  return fund.target || fund.perMemberTarget * members.filter((m) => !isLeft(m)).length
}

// ── Tính toán ───────────────────────────────────────────────────────────────────

export interface FundSummary {
  collected: number // đã thu vào quỹ
  spent: number // đã chi (cả từ quỹ lẫn tiền ứng)
  spentFromFund: number
  balance: number // tiền mặt đang còn trong quỹ
  pendingIn: number // chờ thu
  pendingOut: number // dự chi
}

export function summarize(entries: FundEntry[]): FundSummary {
  const s: FundSummary = { collected: 0, spent: 0, spentFromFund: 0, balance: 0, pendingIn: 0, pendingOut: 0 }
  let transferNet = 0 // tiền quỹ trả ra / nhận vào khi chia tiền
  for (const e of entries) {
    if (!e.done) {
      if (e.type === 'in') s.pendingIn += e.amount
      else if (e.type === 'out') s.pendingOut += e.amount
      continue
    }
    if (e.type === 'in') s.collected += e.amount
    else if (e.type === 'out') {
      s.spent += e.amount
      if (!e.memberId) s.spentFromFund += e.amount
    } else {
      if (!e.memberId) transferNet -= e.amount
      if (!e.toMemberId) transferNet += e.amount
    }
  }
  s.balance = s.collected - s.spentFromFund + transferNet
  return s
}

// Chia 1 khoản cho từng người theo splitMode. Không có ai hợp lệ → chia cho mọi người đang trong quỹ ngày đó.
// Ai mặc định chịu 1 khoản khi không ghi rõ: người tham gia đợt của khoản đó; quỹ không chia đợt → ai đang trong quỹ ngày đó
function defaultSharers(e: FundEntry, members: FundMember[], rounds: FundRound[]): string[] {
  const round = e.roundId ? rounds.find((r) => r.id === e.roundId) : undefined
  if (round) {
    const ids = new Set(members.map((m) => m.id))
    return round.memberIds.filter((id) => ids.has(id))
  }
  return members.filter((m) => isActiveOn(m, e.date)).map((m) => m.id)
}

export function shareOf(e: FundEntry, members: FundMember[], rounds: FundRound[] = []): Map<string, number> {
  const ids = new Set(members.map((m) => m.id))
  let splits = e.splits.filter((s) => ids.has(s.memberId))
  if (!splits.length) splits = defaultSharers(e, members, rounds).map((memberId) => ({ memberId, value: null }))
  const out = new Map<string, number>()
  if (!splits.length) return out
  if (e.splitMode === 'exact') {
    for (const s of splits) out.set(s.memberId, s.value ?? 0)
  } else if (e.splitMode === 'weight') {
    const total = splits.reduce((n, s) => n + (s.value ?? 1), 0) || 1
    for (const s of splits) out.set(s.memberId, (e.amount * (s.value ?? 1)) / total)
  } else {
    for (const s of splits) out.set(s.memberId, e.amount / splits.length)
  }
  return out
}

export interface MemberBalance {
  member: FundMember
  contributed: number // đã góp vào quỹ
  advanced: number // đã ứng tiền túi trả hộ
  share: number // phần chi phí của người này (đã trừ phần hoàn tiền được chia lại)
  sent: number // đã chuyển trả khi chia tiền
  received: number // đã nhận lại khi chia tiền
  pendingIn: number // còn phải góp (khoản chờ thu)
  net: number // > 0 được nhận lại, < 0 còn thiếu
}

export function memberBalances(members: FundMember[], entries: FundEntry[], rounds: FundRound[] = []): MemberBalance[] {
  const map = new Map<string, MemberBalance>(
    members.map((m) => [m.id, { member: m, contributed: 0, advanced: 0, share: 0, sent: 0, received: 0, pendingIn: 0, net: 0 }]),
  )
  for (const e of entries) {
    const who = e.memberId ? map.get(e.memberId) : undefined
    if (!e.done) {
      if (e.type === 'in' && who) who.pendingIn += e.amount
      continue
    }
    if (e.type === 'in') {
      if (who) who.contributed += e.amount
      // Tiền vào từ nguồn khác (hoàn tiền, tiền thừa) là của chung → trừ vào phần chi phí của mọi người
      else for (const [id, v] of shareOf(e, members, rounds)) map.get(id)!.share -= v
    } else if (e.type === 'out') {
      if (who) who.advanced += e.amount
      for (const [id, v] of shareOf(e, members, rounds)) map.get(id)!.share += v
    } else {
      if (who) who.sent += e.amount
      const to = e.toMemberId ? map.get(e.toMemberId) : undefined
      if (to) to.received += e.amount
    }
  }
  for (const b of map.values()) b.net = b.contributed + b.advanced - b.share + b.sent - b.received
  return [...map.values()]
}

// ── Đợt ─────────────────────────────────────────────────────────────────────────

export interface RoundSummary extends FundSummary {
  round: FundRound
  opening: number // tiền mặt mang sang từ các đợt trước
  closing: number // = opening + balance của đợt này → thành opening của đợt sau
}

// Tổng kết từng đợt theo thứ tự: số dư đầu đợt = số dư cuối đợt trước (cộng dồn tiền mặt của quỹ)
export function roundSummaries(rounds: FundRound[], entries: FundEntry[]): RoundSummary[] {
  let carry = 0
  return sortRounds(rounds).map((round) => {
    const s = summarize(entries.filter((e) => e.roundId === round.id))
    const out = { ...s, round, opening: carry, closing: carry + s.balance }
    carry = out.closing
    return out
  })
}

export interface RoundMemberView extends MemberBalance {
  carryIn: number // dư (+) / thiếu (−) cá nhân mang sang từ các đợt trước
  toPay: number // còn cần góp đợt này = mức góp − dư mang sang − đã góp / hẹn góp trong đợt (không âm)
  inRound: boolean // có tham gia đợt này không
}

// Số liệu từng người trong 1 đợt: phần dư/thiếu mang sang từ các đợt trước + thu chi trong đợt này
export function roundMemberView(round: FundRound, rounds: FundRound[], members: FundMember[], entries: FundEntry[]): RoundMemberView[] {
  const ordered = sortRounds(rounds)
  const before = new Set(ordered.slice(0, ordered.findIndex((r) => r.id === round.id)).map((r) => r.id))
  const prev = new Map(memberBalances(members, entries.filter((e) => e.roundId && before.has(e.roundId)), rounds).map((b) => [b.member.id, b.net]))
  const cur = memberBalances(members, entries.filter((e) => e.roundId === round.id), rounds)
  const inRound = new Set(round.memberIds)
  return cur.map((b) => {
    const carryIn = prev.get(b.member.id) ?? 0
    const toPay = round.perMemberTarget ? Math.max(0, round.perMemberTarget - carryIn - b.contributed - b.pendingIn) : 0
    return { ...b, carryIn, net: b.net + carryIn, toPay: inRound.has(b.member.id) ? toPay : 0, inRound: inRound.has(b.member.id) }
  })
}

export const FUND_ID = '__fund__' // "người" giả đại diện cho tiền mặt đang nằm trong quỹ

export interface Transfer {
  from: string // memberId hoặc FUND_ID
  to: string
  amount: number
}

// Gợi ý chuyển tiền để mọi người hoà: quỹ được coi như 1 người đang giữ `balance` tiền mặt phải trả ra (tiền thừa
// hoàn lại người góp dư trước). Tổng net của thành viên luôn bằng balance của quỹ nên 2 phía khớp nhau.
// Ghép tham lam người nợ nhiều nhất ↔ người được nhận nhiều nhất; làm tròn tới 1.000đ, bỏ khoản lẻ < 1.000đ.
export function settle(balances: MemberBalance[], fundBalance: number): Transfer[] {
  const round = (n: number) => Math.round(n / 1000) * 1000
  const creditors = balances.filter((b) => b.net > 0).map((b) => ({ id: b.member.id, amt: b.net }))
  const debtors = balances.filter((b) => b.net < 0).map((b) => ({ id: b.member.id, amt: -b.net }))
  if (fundBalance > 0) debtors.push({ id: FUND_ID, amt: fundBalance })
  else if (fundBalance < 0) creditors.push({ id: FUND_ID, amt: -fundBalance })
  creditors.sort((a, b) => b.amt - a.amt)
  debtors.sort((a, b) => b.amt - a.amt)

  const out: Transfer[] = []
  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const amt = Math.min(debtors[i].amt, creditors[j].amt)
    if (round(amt) >= 1000) out.push({ from: debtors[i].id, to: creditors[j].id, amount: round(amt) })
    debtors[i].amt -= amt
    creditors[j].amt -= amt
    if (debtors[i].amt < 1) i++
    if (creditors[j].amt < 1) j++
  }
  return out
}

const VND_FORMATTER = new Intl.NumberFormat('vi-VN')

export function formatVND(amount: number): string {
  return `${VND_FORMATTER.format(Math.round(amount))} đ`
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)
}

// Số dư ban đầu nhập tay của 1 đợt (tiền đã có sẵn trong quỹ / cộng thêm vào dư đầu đợt): lưu như 1 khoản thu chung
// (không gắn ai, nhóm 'carryover') với id cố định theo đợt — tính toán như mọi khoản thu, nhưng giao diện gộp vào
// "Dư đầu đợt" thay vì hiện trong danh sách thu chi.
export const openingEntryId = (roundId: string) => `${roundId}-opening`
export const isOpeningEntry = (e: Pick<FundEntry, 'id' | 'roundId'>) => !!e.roundId && e.id === openingEntryId(e.roundId)

// Ảnh chứng từ của khoản chi (hoá đơn, bill...) — chỉ nhận ảnh do /api/trips/photo tải lên R2 (thư mục trips/)
export const TRIP_PHOTO_KEY = /^trips\/[\w-]+\.(webp|jpe?g|png)$/
export const MAX_ENTRY_PHOTOS = 12
