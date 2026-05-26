import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, getRoleHomePath } from '../auth/AuthContext'
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
  const location = useLocation() 
  const { user } = useAuth()
  const displayName = username ?? user?.username ?? user?.name ?? 'Pengguna'
  const email = user?.email ?? ''

  // Fungsi navigasi pintar berdasarkan lokasi URL saat ini
  const handleLogoClick = () => {
    const currentPath = location.pathname

    // 1. CEK DULU: Apakah user sudah login?
    // Jika 'user' kosong/null, berarti dia belum login, jangan kasih masuk!
    if (!user) {
      if (currentPath.startsWith('/admin')) {
        navigate('/admin/login') // Tahan di halaman login admin
      } else {
        navigate('/login') // Tahan di halaman login user
      }
      return // Hentikan eksekusi kode di bawahnya
    }

    // 2. JIKA USER SUDAH LOGIN:
    const isAdminArea = currentPath.startsWith('/admin') || currentPath.includes('/regulator')

    if (isAdminArea) {
      // Jika sedang di area admin, arahkan ke dashboard admin
      if (user?.role) {
        navigate(getRoleHomePath(user.role))
      } else {
        navigate('/admin/login') // Fallback jika terjadi error pada role
      }
    } else {
      // Jika sedang di area user biasa, arahkan ke home/dashboard user
      navigate(paths.home)
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex w-full items-center justify-between gap-4">
        <button
          type="button"
          className="inline-flex items-center rounded-lg transition-opacity hover:opacity-85"
          onClick={handleLogoClick}
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