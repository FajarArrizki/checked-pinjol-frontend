import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandIcon, AppNavbar, Input, Button } from '../components'
import { paths } from '../router/paths'

export function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSignUp = () => {
    // nanti disambungkan ke API
    navigate(paths.home)
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
                We will never share your email.
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
                Make sure your password is secure.
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

            <Button
              variant="secondary"
              className="w-full mt-2 rounded-xl border-slate-900 text-slate-900 font-semibold py-3"
              onClick={handleSignUp}
            >
              Sign Up
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