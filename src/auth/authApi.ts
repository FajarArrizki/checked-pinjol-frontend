import { apiConfig } from '../config/api'

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data?: T
}

export type AuthRole = 'user' | 'admin' | 'superadmin'

export type AuthUser = {
  id: number
  name: string
  email: string
  role: AuthRole
  username?: string
  noHp?: string
  type: 'user' | 'admin'
}

export type AuthSession = {
  token: string
  user: AuthUser
}

export type PendingAdminTwoFactor = {
  requiresTwoFactor: true
  challengeToken: string
  user: AuthUser
}

export type LoginInput = {
  identifier: string
  password: string
}

export type LoginMode = 'user' | 'admin'

export type RegisterInput = {
  name: string
  email: string
  noHp: string
  password: string
}

class ApiError extends Error {
  status: number
  payload?: unknown

  constructor(
    status: number,
    message: string,
    payload?: unknown,
  ) {
    super(message)
    this.status = status
    this.payload = payload
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${apiConfig.baseUrl}${path}`, init)
  const raw = await response.text()
  const data = raw ? JSON.parse(raw) as ApiEnvelope<T> : null

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message ?? `Request failed with status ${response.status}`,
      data,
    )
  }

  return (data as ApiEnvelope<T>)?.data as T
}

function normalizeUser(payload: any, fallbackRole: AuthRole): AuthUser {
  if (payload?.id_user) {
    return {
      id: Number(payload.id_user),
      name: String(payload.nama ?? ''),
      email: String(payload.email ?? ''),
      noHp: payload.no_hp ? String(payload.no_hp) : undefined,
      role: 'user',
      type: 'user',
    }
  }

  if (payload?.id_admin) {
    return {
      id: Number(payload.id_admin),
      name: String(payload.nama ?? ''),
      email: String(payload.email ?? ''),
      username: payload.username ? String(payload.username) : undefined,
      role: (payload.role as AuthRole) ?? fallbackRole,
      type: 'admin',
    }
  }

  return {
    id: Number(payload?.id ?? 0),
    name: String(payload?.nama ?? ''),
    email: String(payload?.email ?? ''),
    role: fallbackRole,
    type: fallbackRole === 'user' ? 'user' : 'admin',
  }
}

export async function registerUser(input: RegisterInput): Promise<AuthSession> {
  const data = await request<any>('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nama: input.name,
      email: input.email,
      no_hp: input.noHp,
      password: input.password,
    }),
  })

  return {
    token: '',
    user: normalizeUser(data, 'user'),
  }
}

export async function loginUser(input: LoginInput): Promise<AuthSession> {
  const data = await request<{ token: string; user: any }>('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.identifier,
      password: input.password,
    }),
  })

  return {
    token: data.token,
    user: normalizeUser(data.user, 'user'),
  }
}

export async function loginAdmin(input: LoginInput): Promise<AuthSession> {
  const data = await request<{ token?: string; user: any; requires_two_factor?: boolean; challenge_token?: string }>('/api/auth/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: input.identifier,
      password: input.password,
    }),
  })

  if (data.requires_two_factor && data.challenge_token) {
    throw new ApiError(409, 'OTP diperlukan', {
      requiresTwoFactor: true,
      challengeToken: data.challenge_token,
      user: normalizeUser(data.user, (data.user?.role as AuthRole) ?? 'admin'),
    } satisfies PendingAdminTwoFactor)
  }

  return {
    token: data.token as string,
    user: normalizeUser(data.user, (data.user?.role as AuthRole) ?? 'admin'),
  }
}

export async function verifyAdminTwoFactor(challengeToken: string, otp: string): Promise<AuthSession> {
  const data = await request<{ token: string; user: any }>('/api/auth/admin/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ challenge_token: challengeToken, otp }),
  })

  return {
    token: data.token,
    user: normalizeUser(data.user, (data.user?.role as AuthRole) ?? 'admin'),
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}
