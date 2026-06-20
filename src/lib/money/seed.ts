import { nanoid } from 'nanoid'
import type { Category, Wallet } from './types'

const MONTH_NAMES_VN = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
]

export function createDefaultWallet(today: Date = new Date(), cycleStartDay: number = 1): Wallet {
  const cycleMonth = cycleStartDay <= 1 || today.getDate() >= cycleStartDay ? today.getMonth() : today.getMonth() - 1
  const monthIndex = ((cycleMonth % 12) + 12) % 12
  return {
    id: nanoid(),
    name: MONTH_NAMES_VN[monthIndex],
    icon: '👛',
    createdAt: today.toISOString(),
    includeInTotal: true,
  }
}

export function createDefaultCategories(): Category[] {
  const make = (name: string, icon: string, color: string, type: Category['type']): Category => ({
    id: nanoid(),
    name,
    icon,
    color,
    type,
  })

  return [
    // Khoản chi — bộ category mặc định kiểu MoneyLover
    make('Ăn uống', '🍜', '#E5463D', 'expense'),
    make('Cà phê', '☕', '#A9744F', 'expense'),
    make('Hoá đơn & Tiện ích', '🧾', '#F97316', 'expense'),
    make('Di chuyển', '🚗', '#2563EB', 'expense'),
    make('Mua sắm', '🛍️', '#A855F7', 'expense'),
    make('Quần áo', '👗', '#EC4899', 'expense'),
    make('Giải trí', '🎬', '#DB2777', 'expense'),
    make('Sức khoẻ', '💊', '#0D9488', 'expense'),
    make('Giáo dục', '📚', '#4F46E5', 'expense'),
    make('Du lịch', '✈️', '#0EA5E9', 'expense'),
    make('Gia đình & Con cái', '👶', '#EA580C', 'expense'),
    make('Thú cưng', '🐶', '#92400E', 'expense'),
    make('Quà tặng & Từ thiện', '🎁', '#F43F5E', 'expense'),
    make('Tiền nhà', '🏠', '#7C3AED', 'expense'),
    make('Bảo hiểm', '🛡️', '#475569', 'expense'),
    make('Lisence', '🪪', '#0891B2', 'expense'),
    make('Trả nợ', '💳', '#D97706', 'expense'),
    make('Xăng dầu', '⛽', '#C2410C', 'expense'),
    make('Chăm sóc cá nhân', '🧴', '#65A30D', 'expense'),
    make('Khác', '📦', '#71717A', 'expense'),

    // Khoản thu
    make('Lương', '💰', '#16A34A', 'income'),
    make('Thưởng', '🎉', '#16A34A', 'income'),
    make('Đầu tư', '📈', '#16A34A', 'income'),
    make('Cho thuê', '🏢', '#16A34A', 'income'),
    make('Thu nhập khác', '💵', '#16A34A', 'income'),

    // Vay/Nợ
    make('Vay', '🏦', '#D97706', 'debt'),
    make('Cho vay', '🤝', '#D97706', 'debt'),
    make('Trả nợ', '💳', '#D97706', 'debt'),
    make('Thu nợ', '📥', '#D97706', 'debt'),
  ]
}
