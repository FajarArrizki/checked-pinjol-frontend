import { useState } from 'react'
import { BrandIcon } from '../components'
import { Input } from '../components'
import { Button } from '../components'

type LoginPageProps = {
  onLogin?: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
                label="Email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="text-xs text-slate-400">We will never share your email.</span>
            </div>

            <div className="flex flex-col gap-1">
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="text-xs text-slate-400">Make sure your password is secure.</span>
            </div>

            <Button
              variant="secondary"
              className="w-full mt-2 rounded-xl border-slate-900 text-slate-900 font-semibold py-3"
              onClick={onLogin}
            >
              Login
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
          <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8">
             Log In as Regulator
        </button>

        </div>
      </main>
    </div>
  )
}
