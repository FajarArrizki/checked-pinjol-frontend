import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { AppNavbar, Sidebar } from '../components'
import { paths } from '../router/paths'
import { tokens } from '../config/tokens'

export function RegulatorDashboardPage() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const sidebarItems = [
    { label: 'Overview', active: location.pathname === paths.regulatorOverview, onClick: () => navigate(paths.regulatorOverview) },
    { label: 'Laporan Masuk', active: location.pathname === paths.regulatorIncomingReports, onClick: () => navigate(paths.regulatorIncomingReports) },
    {
      label: 'Pinjaman Online Terdaftar',
      active: location.pathname === paths.regulatorRegisteredLoans,
      onClick: () => navigate(paths.regulatorRegisteredLoans),
    },
    { label: 'Pengaturan', active: location.pathname === paths.regulatorSettings, onClick: () => navigate(paths.regulatorSettings) },
  ]

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar username="Regulator" onLogout={() => navigate(paths.login)} />

      <main className="mx-auto flex w-full max-w-6xl gap-6 px-6 pt-px pb-8">
        <Sidebar
          title="Dashboard"
          items={sidebarItems}
          collapsed={collapsed}
          onToggle={() => setCollapsed((current) => !current)}
        />

        <section
          className="min-w-0 flex-1"
        >
          <div
            className="h-full rounded-2xl bg-white p-6 shadow-sm"
            style={{
              borderRadius: tokens.radius.lg,
              boxShadow: tokens.shadow.sm,
            }}
          >
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  )
}
