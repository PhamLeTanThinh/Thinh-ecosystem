import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { getAdminAccess } from '@/lib/admin/access'

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [access, { tab }] = await Promise.all([getAdminAccess(), searchParams])
  return <AdminDashboard ownerEmail={access.ok ? access.email : null} initialTab={tab === 'learners' ? 'learners' : 'ielts'} />
}
