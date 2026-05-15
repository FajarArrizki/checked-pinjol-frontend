import { useAuth } from '../auth/AuthContext'
import { BrandIcon } from './BrandIcon'
import { ProfileTrigger } from './ProfileTrigger'

type AppNavbarProps = {
  username?: string
  onLogout?: () => void
  hideProfile?: boolean
}

export function AppNavbar({ username, onLogout, hideProfile }: AppNavbarProps) {
  const { user } = useAuth()
  const displayName = username ?? user?.username ?? user?.name ?? 'Pengguna'
  const email = user?.email ?? ''

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex w-full items-center justify-between gap-4">
        <BrandIcon />

        {!hideProfile && (
          <div className="flex items-center gap-3">
            <ProfileTrigger username={displayName} email={email} onLogout={onLogout} />
          </div>
        )}
      </div>
    </header>
  )
}
