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
    { label: 'Manajemen User', active: location.pathname === paths.regulatorSuperAdmin, onClick: () => navigate(paths.regulatorSuperAdmin) },
    { label: 'Manajemen Konten', active: location.pathname === paths.regulatorContent, onClick: () => navigate(paths.regulatorContent) },
    { label: 'Pengaturan', active: location.pathname === paths.regulatorSettings, onClick: () => navigate(paths.regulatorSettings) },
  ]

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col">
      <AppNavbar username="Regulator" onLogout={() => navigate(paths.login)} />

      <main className="flex flex-1 overflow-hidden w-full bg-slate-50">
        <Sidebar
          title="Checked"
          items={sidebarItems}
          collapsed={collapsed}
          onToggle={() => setCollapsed((current) => !current)}
        />

        <section className="min-w-0 flex-1 p-4 sm:p-8 overflow-hidden flex flex-col">
          <div
            className="flex-1 w-full rounded-2xl bg-white shadow-sm flex flex-col overflow-hidden"
            style={{
              borderRadius: tokens.radius.xl,
              boxShadow: tokens.shadow.sm,
            }}
          >
            <div className="flex-1 flex flex-col min-h-0">
              <Outlet />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
