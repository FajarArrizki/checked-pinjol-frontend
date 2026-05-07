import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandIcon } from '../components'
import { Input } from '../components'
import { Button } from '../components'
import { paths } from '../router/paths'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'user' | 'regulator'>('user')
  const navigate = useNavigate()

  const isRegulator = mode === 'regulator'

  const handleLogin = () => {
    if (isRegulator) {
      navigate(paths.regulatorOverview)
      return
    }

    navigate(paths.home)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 px-8 py-4">
        <BrandIcon />
      </header>

      {/* Form */}
      <main className="flex flex-1 items-start justify-center pt-16 px-4">
        <div className="w-full max-w-md flex flex-col items-center gap-6">

        <BrandIcon variant="logo" />

          {/* Form fields */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                label={isRegulator ? 'Email Regulator' : 'Email'}
                type="email"
                placeholder={isRegulator ? 'Enter regulator email address' : 'Enter your email address'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="text-xs text-slate-400">
                {isRegulator ? 'Use your registered regulator account to continue.' : 'We will never share your email.'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Password"
                type="password"
                placeholder={isRegulator ? 'Enter regulator password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="text-xs text-slate-400">
                {isRegulator ? 'Access is limited to authorized regulator accounts.' : 'Make sure your password is secure.'}
              </span>
            </div>

            <Button
              variant="secondary"
              className="w-full mt-2 rounded-xl border-slate-900 text-slate-900 font-semibold py-3"
              onClick={handleLogin}
            >
              {isRegulator ? 'Login as Regulator' : 'Login'}
            </Button>
          </div>

          {/* Sign Up link */}
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <button className="text-blue-500 font-medium hover:underline">
              Sign Up
            </button>
          </p>

          {/* Divider */}
          <div className="w-full border-t border-slate-200" />

          {/* Log in as Regulator */}
          <button
            type="button"
            onClick={() => setMode((current) => (current === 'user' ? 'regulator' : 'user'))}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8"
          >
            {isRegulator ? 'Back to User Login' : 'Log In as Regulator'}
          </button>

        </div>
      </main>
    </div>
  )
}
