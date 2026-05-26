import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { paths } from '../router/paths'

export function useLogoutRedirect() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return () => {
    const currentPath = window.location.pathname
    const isAdminArea = currentPath.startsWith('/regulator') || currentPath.startsWith('/admin')

    logout()

    if (isAdminArea) {
      navigate('/admin/login', { replace: true, state: {} }) // state dikosongkan secara paksa
    } else {
      navigate(paths.login, { replace: true, state: {} }) // state dikosongkan secara paksa
    }
  }
}