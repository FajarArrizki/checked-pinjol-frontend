import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { paths } from '../router/paths'
import { BrandIcon } from './BrandIcon'
import { ProfileTrigger } from './ProfileTrigger'

type AppNavbarProps = {
  username?: string
  onLogout?: () => void
  hideProfile?: boolean
}

export function AppNavbar({ username, onLogout, hideProfile }: AppNavbarProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const displayName = username ?? user?.username ?? user?.name ?? 'Pengguna'
  const email = user?.email ?? ''

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex w-full items-center justify-between gap-4">
        <button
          type="button"
          className="inline-flex items-center rounded-lg transition-opacity hover:opacity-85"
          onClick={() => navigate(paths.home)}
          aria-label="Kembali ke beranda"
        >
          <BrandIcon />
        </button>

        {!hideProfile && (
          <div className="flex items-center gap-3">
            <ProfileTrigger username={displayName} email={email} onLogout={onLogout} />
          </div>
        )}
      </div>
    </header>
  )
}
