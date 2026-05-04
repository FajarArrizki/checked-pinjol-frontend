import type { PropsWithChildren } from 'react'

import { BrandIcon, Button, ProfileTrigger } from '../components'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen w-[min(1120px,calc(100%-32px))] py-8 max-sm:w-[min(100%-20px,1120px)]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm max-sm:px-4">
        <BrandIcon />

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary">Login</Button>
          <Button>Register</Button>
          <ProfileTrigger username="Fajar Arrizki" />
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
