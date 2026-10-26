import { HubProtected } from '@/components/hub/HubProtected'

// Bọc riêng /pm (trừ /pm/login, nằm ngoài route group này) — xem components/hub/HubProtected.tsx.
export default function PmProtectedLayout({ children }: { children: React.ReactNode }) {
  return <HubProtected app="pm">{children}</HubProtected>
}
