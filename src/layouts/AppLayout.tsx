import type { PropsWithChildren } from 'react'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-title">checked-pinjol-frontend</p>
          <p className="brand-subtitle">Initial frontend foundation</p>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  )
}
