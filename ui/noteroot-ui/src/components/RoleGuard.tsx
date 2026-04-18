import { useAuthStore } from '@/stores/auth'

type Props = {
  role: 'admin' | 'editor'
  children: React.ReactNode
}

export default function RoleGuard({ role, children }: Props) {
  const user = useAuthStore((state) => state.user)

  if (!user || user.role !== role) return null

  return <>{children}</>
}
