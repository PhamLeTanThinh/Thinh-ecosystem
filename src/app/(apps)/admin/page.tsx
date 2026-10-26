import { AdminDashboard, type Tab } from '@/components/admin/AdminDashboard'
import { getAdminAccess } from '@/lib/admin/access'

const TABS = ['ielts', 'certs', 'pm', 'it', 'learners', 'feedback'] as const satisfies readonly Tab[]

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [access, { tab }] = await Promise.all([getAdminAccess(), searchParams])
  const initialTab: Tab = tab && (TABS as readonly string[]).includes(tab) ? (tab as Tab) : 'ielts'
  return <AdminDashboard ownerEmail={access.ok ? access.email : null} initialTab={initialTab} />
}
