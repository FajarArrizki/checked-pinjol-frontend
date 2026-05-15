import { useNavigate } from 'react-router-dom'

import { useAuth } from './AuthContext'
import { paths } from '../router/paths'

export function useLogoutRedirect() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return () => {
    logout()
    navigate(paths.login, { replace: true })
  }
}
