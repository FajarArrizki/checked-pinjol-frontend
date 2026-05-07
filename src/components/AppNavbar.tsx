import { BrandIcon } from './BrandIcon'
import { ProfileTrigger } from './ProfileTrigger'

type AppNavbarProps = {
  username?: string
  onLogout?: () => void
  hideProfile?: boolean
}

export function AppNavbar({ username = 'Fajar Arrizki', onLogout, hideProfile }: AppNavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex w-full items-center justify-between gap-4">
        <BrandIcon />

        {!hideProfile && (
          <div className="flex items-center gap-3">
            <ProfileTrigger username={username} onLogout={onLogout} />
          </div>
        )}
      </div>
    </header>
  )
}
