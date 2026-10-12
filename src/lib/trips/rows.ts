import { tripEntries, tripFunds, tripMembers } from '@/db/schema'
import { DEFAULT_THEME, isTripTheme } from './themes'
import { isEntryType, isFundKind, type EntryPhoto, type EntrySplit, type Fund, type FundEntry, type FundMember, type SplitMode } from './types'

// Map dòng DB → kiểu dùng ở client (dùng chung cho các route /api/trips/*).

export function toFund(r: typeof tripFunds.$inferSelect): Fund {
  return {
    id: r.id,
    name: r.name,
    kind: isFundKind(r.kind) ? r.kind : 'other',
    icon: r.icon,
    theme: isTripTheme(r.theme) ? r.theme : DEFAULT_THEME,
    note: r.note,
    location: r.location,
    currency: r.currency,
    startDate: r.startDate,
    endDate: r.endDate,
    target: r.target,
    perMemberTarget: r.perMemberTarget,
    treasurerId: r.treasurerId,
    coverImage: r.coverImage,
    shareSlug: r.shareSlug,
    closed: r.closed,
    closedAt: r.closedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
  }
}

export function toMember(r: typeof tripMembers.$inferSelect): FundMember {
  return {
    id: r.id,
    fundId: r.fundId,
    name: r.name,
    note: r.note,
    contact: r.contact,
    color: r.color,
    joinedAt: r.joinedAt,
    leftAt: r.leftAt,
    sortOrder: r.sortOrder,
    createdAt: r.createdAt.toISOString(),
  }
}

const SPLIT_MODES: SplitMode[] = ['equal', 'weight', 'exact']

export function toEntry(r: typeof tripEntries.$inferSelect): FundEntry {
  return {
    id: r.id,
    fundId: r.fundId,
    type: isEntryType(r.type) ? r.type : 'out',
    amount: r.amount,
    originalAmount: r.originalAmount,
    originalCurrency: r.originalCurrency,
    date: r.date,
    dueDate: r.dueDate,
    done: r.done,
    memberId: r.memberId,
    toMemberId: r.toMemberId,
    splitMode: SPLIT_MODES.includes(r.splitMode as SplitMode) ? (r.splitMode as SplitMode) : 'equal',
    splits: Array.isArray(r.splits) ? (r.splits as EntrySplit[]) : [],
    category: r.category,
    note: r.note,
    attachments: Array.isArray(r.attachments) ? (r.attachments as EntryPhoto[]) : [],
    createdAt: r.createdAt.toISOString(),
  }
}
