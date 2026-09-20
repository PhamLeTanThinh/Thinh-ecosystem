import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { getAdminAccess } from '@/lib/admin/access'

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [access, { tab }] = await Promise.all([getAdminAccess(), searchParams])
  const initialTab = tab === 'learners' ? 'learners' : tab === 'feedback' ? 'feedback' : 'ielts'
  return <AdminDashboard ownerEmail={access.ok ? access.email : null} initialTab={initialTab} />
}
