import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { paths } from '../router/paths'
import { getRoleHomePath, useAuth } from './AuthContext'
import type { AuthRole } from './authApi'

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles?: AuthRole[]
}>

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace />
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to={getRoleHomePath(role)} replace />
  }

  return children
}

export function PublicRoute({ children }: PropsWithChildren) {
  const { isAuthenticated, role } = useAuth()

  if (isAuthenticated) {
    return <Navigate to={getRoleHomePath(role)} replace />
  }

  return children
}
