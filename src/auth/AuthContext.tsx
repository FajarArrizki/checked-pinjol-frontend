import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react'

import { loginAdmin, loginUser, registerUser, type AuthRole, type AuthSession, type AuthUser, type LoginInput, type LoginMode, type RegisterInput } from './authApi'

const AUTH_STORAGE_KEY = 'checked-pinjol.auth'

type StoredAuth = {
  token: string
  user: AuthUser
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  role: AuthRole | null
  isAuthenticated: boolean
  login: (input: LoginInput, mode?: LoginMode) => Promise<AuthSession>
  register: (input: RegisterInput) => Promise<AuthSession>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as StoredAuth
    if (!parsed?.token || !parsed?.user) return null
    return parsed
  } catch {
    return null
  }
}

function saveStoredAuth(session: AuthSession): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [stored, setStored] = useState<StoredAuth | null>(() => {
    if (typeof window === 'undefined') return null
    return readStoredAuth()
  })

  const value = useMemo<AuthContextValue>(() => {
    async function login(input: LoginInput, mode: LoginMode = 'user'): Promise<AuthSession> {
      const session = mode === 'admin' ? await loginAdmin(input) : await loginUser(input)
      const normalized = { token: session.token, user: session.user }
      setStored(normalized)
      saveStoredAuth(normalized)
      return normalized
    }

    async function register(input: RegisterInput): Promise<AuthSession> {
      return registerUser(input)
    }

    function logout(): void {
      setStored(null)
      clearStoredAuth()
    }

    return {
      user: stored?.user ?? null,
      token: stored?.token ?? null,
      role: stored?.user.role ?? null,
      isAuthenticated: Boolean(stored?.token && stored?.user),
      login,
      register,
      logout,
    }
  }, [stored])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export function getRoleHomePath(role: AuthRole | null): string {
  if (role === 'admin' || role === 'superadmin') {
    return '/regulator'
  }

  return '/home'
}
