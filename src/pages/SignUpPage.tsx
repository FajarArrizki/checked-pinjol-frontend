import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BrandIcon, AppNavbar, Input, Button } from '../components'
import { paths } from '../router/paths'
import { useAuth } from '../auth/AuthContext'
import { isApiError } from '../auth/authApi'
import { emailRequirementText, isStrongPassword, isValidEmail, isValidPhoneNumber, normalizeDigits, passwordRequirementText, phoneRequirementText } from '../utils/validation'

export function SignUpPage() {
  const { register } = useAuth()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [noHp, setNoHp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // MENERIMA DATA DARI HALAMAN LOGIN (JIKA ADA)
  useEffect(() => {
    const state = location.state as { email?: string; password?: string } | null
    if (state) {
      if (state.email) setEmail(state.email)
      if (state.password) {
        setPassword(state.password)
        setConfirmPassword(state.password) // Samakan konfirmasinya sekalian biar user nyaman
      }
    }
  }, [location.state])

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

      // Berhasil daftar -> lempar email ke login page
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
                placeholder="Masukkan nama lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Email"
                type="email"
                placeholder="Masukkan alamat email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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
                autoComplete="tel"
              />
              <span className="text-xs text-slate-400">
                {phoneRequirementText}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Password"
                type="password"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <span className="text-xs text-slate-400">
                {passwordRequirementText}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Konfirmasi Password"
                type="password"
                placeholder="Masukkan kembali password Anda"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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

          {/* Login link (ditambah mb-8 sebagai pengganti margin divider yang dihapus) */}
          <p className="text-sm text-slate-500 mb-8">
            Sudah punya akun?{' '}
            <button
              className="text-blue-500 font-medium hover:underline"
              // LEMPAR BALIK DATA EMAIL & PASSWORD KE LOGIN JIKA BATAL DAFTAR
              onClick={() => navigate(paths.login, { state: { email, password } })}
            >
              Masuk
            </button>
          </p>

        </div>
      </main>
    </div>
  )
}