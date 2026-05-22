import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandIcon, AppNavbar, Input, Button } from '../components'
import { paths } from '../router/paths'
import { useAuth } from '../auth/AuthContext'
import { isApiError } from '../auth/authApi'
import { emailRequirementText, isStrongPassword, isValidEmail, isValidPhoneNumber, normalizeDigits, passwordRequirementText, phoneRequirementText } from '../utils/validation'

export function SignUpPage() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [noHp, setNoHp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async () => {
    setError('')

    const normalizedPhone = normalizeDigits(noHp)

    if (!isValidEmail(email.trim())) {
      setError(emailRequirementText)
      return
    }

    if (!isValidPhoneNumber(normalizedPhone)) {
      setError(phoneRequirementText)
      return
    }

    if (!isStrongPassword(password)) {
      setError(passwordRequirementText)
      return
    }

    if (password !== confirmPassword) {
      setError('Password tidak cocok.')
      return
    }

    setLoading(true)

    try {
      await register({
        name,
        email,
        noHp: normalizedPhone,
        password,
      })

      navigate(paths.login, { state: { email } })
    } catch (err) {
      setError(isApiError(err) ? err.message : 'Pendaftaran gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppNavbar hideProfile />

      <main className="flex flex-1 items-start justify-center pt-16 px-4">
        <div className="w-full max-w-md flex flex-col items-center gap-6">

          <BrandIcon variant="logo" />

          {/* Form fields */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                label="Nama Lengkap"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="text-xs text-slate-400">
                {emailRequirementText}
              </span>
              </div>

            <div className="flex flex-col gap-1">
              <Input
                label="No. HP"
                type="tel"
                placeholder="08xxxxxxxxxx"
                value={noHp}
                inputMode="numeric"
                maxLength={12}
                onChange={(e) => setNoHp(normalizeDigits(e.target.value).slice(0, 12))}
              />
              <span className="text-xs text-slate-400">
                {phoneRequirementText}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="text-xs text-slate-400">
                {passwordRequirementText}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Konfirmasi Password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && password !== confirmPassword && (
                <span className="text-xs text-red-500">
                  Password tidak cocok.
                </span>
              )}
            </div>

            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              variant="secondary"
              className="w-full mt-2 rounded-xl border-slate-900 text-slate-900 font-semibold py-3"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </Button>
          </div>

          {/* Login link */}
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <button
              className="text-blue-500 font-medium hover:underline"
              onClick={() => navigate(paths.login)}
            >
              Log In
            </button>
          </p>

          {/* Divider */}
          <div className="w-full border-t border-slate-200 mb-8" />

        </div>
      </main>
    </div>
  )
}
