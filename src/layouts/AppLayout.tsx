import type { PropsWithChildren } from 'react'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="mx-auto min-h-screen w-[min(1120px,calc(100%-32px))] py-6 pb-12 max-sm:w-[min(100%-20px,1120px)] max-sm:pt-4">
      <header className="mb-6 flex items-center justify-between rounded-[20px] border border-slate-700/40 bg-slate-950/60 px-5 py-[18px] shadow-[0_24px_80px_rgba(2,8,23,0.38)] backdrop-blur-xl max-sm:px-4 max-sm:py-4">
        <div>
          <p className="m-0 text-base font-bold text-slate-50">checked-pinjol-frontend</p>
          <p className="mt-1 mb-0 text-[0.95rem] text-slate-400">Initial frontend foundation</p>
        </div>
      </header>

      <main className="grid gap-6">{children}</main>
    </div>
  )
}
