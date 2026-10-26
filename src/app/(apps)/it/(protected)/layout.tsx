import { HubProtected } from '@/components/hub/HubProtected'

// Bọc riêng /it (trừ /it/login, nằm ngoài route group này) — xem components/hub/HubProtected.tsx.
export default function ItProtectedLayout({ children }: { children: React.ReactNode }) {
  return <HubProtected app="it">{children}</HubProtected>
}
