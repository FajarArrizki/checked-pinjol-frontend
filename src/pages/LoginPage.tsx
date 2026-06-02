import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BrandIcon, AppNavbar, Input, Button } from '../components'
import { paths } from '../router/paths'
import { getRoleHomePath, useAuth } from '../auth/AuthContext'
import { isApiError, verifyAdminTwoFactor, type PendingAdminTwoFactor } from '../auth/authApi'

export function LoginPage() {
  const location = useLocation()
  const { login, establishSession, isAuthenticated, role } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [twoFactorState, setTwoFactorState] = useState<PendingAdminTwoFactor | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ identifier?: string; password?: string }>({})
  const navigate = useNavigate()
  const isAdminLogin = location.pathname === paths.adminLogin

  // Menerima data dari halaman SignUp (HANYA jika dioper secara sengaja)
  useEffect(() => {
    const state = location.state as { email?: string; password?: string } | null
    if (!isAdminLogin && state) {
      if (state.email) setIdentifier(state.email)
      if (state.password) setPassword(state.password)
    }
  }, [location.state, isAdminLogin])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getRoleHomePath(role), { replace: true })
    }
  }, [isAuthenticated, navigate, role])

  const handleLogin = async () => {
    setError('')
    setFieldErrors({})

    const nextFieldErrors: typeof fieldErrors = {}

    if (!identifier.trim()) {
      nextFieldErrors.identifier = isAdminLogin ? 'Username atau email wajib diisi.' : 'Email wajib diisi.'
    }

    if (!password.trim()) {
      nextFieldErrors.password = 'Password wajib diisi.'
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      return
    }

    setLoading(true)

    try {
      const session = await login({ identifier, password }, isAdminLogin ? 'admin' : 'user')
      navigate(getRoleHomePath(session.user.role), { replace: true })
    } catch (err) {
      if (isApiError(err) && err.status === 409) {
        const payload = err.payload as PendingAdminTwoFactor | undefined
        if (payload?.requiresTwoFactor) {
          setTwoFactorState(payload)
          setError('Masukkan OTP dari Google Authenticator')
        } else {
          setError(err.message)
        }
      } else {
        const message = isApiError(err) ? err.message : 'Login gagal'
        const lower = message.toLowerCase()
        if (lower.includes('password') && lower.includes('email')) {
          setFieldErrors({ identifier: message, password: message })
        } else if (lower.includes('password') && lower.includes('username')) {
          setFieldErrors({ identifier: message, password: message })
        } else if (lower.includes('password')) {
          setFieldErrors({ password: message })
        } else {
          setError(message)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!twoFactorState) return

    setError('')
    setFieldErrors({})

    if (!otp.trim()) {
      setFieldErrors({ password: 'OTP wajib diisi.' })
      return
    }

    setLoading(true)

    try {
      const session = await verifyAdminTwoFactor(twoFactorState.challengeToken, otp.trim())
      establishSession(session)
      navigate(getRoleHomePath(session.user.role), { replace: true })
    } catch (err) {
      setError(isApiError(err) ? err.message : 'Verifikasi OTP gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppNavbar hideProfile />

      {/* Form */}
      <main className="flex flex-1 items-start justify-center pt-16 px-4">
        <div className="w-full max-w-md flex flex-col items-center gap-6">

          <BrandIcon variant="logo" />

          {/* Form fields */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                label={isAdminLogin ? 'Username atau Email Admin' : 'Email User'}
                type={isAdminLogin ? 'text' : 'email'}
                placeholder={isAdminLogin ? 'Masukkan username atau email admin' : 'Masukkan email user'}
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setFieldErrors((c) => ({ ...c, identifier: undefined })) }}
                autoComplete="off"
                error={fieldErrors.identifier}
              />
              {!fieldErrors.identifier ? <span className="text-xs text-slate-400">
                {isAdminLogin
                  ? 'Admin dan superadmin bisa masuk dengan username atau email.'
                  : 'User masuk dengan email.'}
              </span> : null}
            </div>

            {!twoFactorState ? (
              <div className="flex flex-col gap-1">
              <Input
                label="Password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((c) => ({ ...c, password: undefined })) }}
                autoComplete="new-password"
                error={fieldErrors.password}
              />
              {!fieldErrors.password ? <span className="text-xs text-slate-400">
                  Gunakan akun yang sudah di-seed atau terdaftar di backend.
                </span> : null}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
              <Input
                label="OTP Google Authenticator"
                type="text"
                placeholder="Masukkan 6 digit OTP"
                value={otp}
                onChange={(e) => { setOtp(e.target.value); setFieldErrors((c) => ({ ...c, password: undefined })) }}
                autoComplete="off"
                error={fieldErrors.password}
              />
              {!fieldErrors.password ? <span className="text-xs text-slate-400">
                  OTP diperlukan karena 2FA aktif untuk akun admin ini.
                </span> : null}
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              variant="secondary"
              className="w-full mt-2 rounded-xl border-slate-900 text-slate-900 font-semibold py-3"
              onClick={twoFactorState ? handleVerifyOtp : handleLogin}
              disabled={loading}
            >
              {loading ? 'Memproses...' : twoFactorState ? 'Verifikasi OTP' : isAdminLogin ? 'Masuk Admin' : 'Masuk User'}
            </Button>

            {twoFactorState ? (
              <Button
                variant="secondary"
                className="w-full rounded-xl border-slate-200 text-slate-700 font-semibold py-3"
                onClick={() => {
                  setTwoFactorState(null)
                  setOtp('')
                  setError('')
                }}
                disabled={loading}
              >
                Kembali ke Login
              </Button>
            ) : null}
          </div>

          {/* Bagian Bawah Form */}
          {!isAdminLogin && (
            <>
              <p className="text-sm text-slate-500">
                Tidak punya akun user?{' '}
                <button
                  className="text-blue-500 font-medium hover:underline"
                  onClick={() => navigate(paths.signup, { state: { email: identifier, password } })}
                >
                  Daftar
                </button>
              </p>
              
              <div className="w-full border-t border-slate-200" />
            </>
          )}

        </div>
      </main>
    </div>
  )
}