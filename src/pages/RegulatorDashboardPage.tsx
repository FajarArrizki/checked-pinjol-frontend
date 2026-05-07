import { useState } from 'react'

import { AppNavbar, Sidebar } from '../components'
import { tokens } from '../config/tokens'
import {
  RegulatorIncomingReportsPage,
  RegulatorOverviewPage,
  RegulatorRegisteredLoansPage,
  RegulatorSettingsPage,
} from './index'

type RegulatorDashboardPageProps = {
  onLogout?: () => void
}

export function RegulatorDashboardPage({ onLogout }: RegulatorDashboardPageProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState<'overview' | 'incoming' | 'registered' | 'settings'>('overview')

  const sidebarItems = [
    { label: 'Overview', active: activeMenu === 'overview', onClick: () => setActiveMenu('overview') },
    { label: 'Laporan Masuk', active: activeMenu === 'incoming', onClick: () => setActiveMenu('incoming') },
    {
      label: 'Pinjaman Online Terdaftar',
      active: activeMenu === 'registered',
      onClick: () => setActiveMenu('registered'),
    },
    { label: 'Pengaturan', active: activeMenu === 'settings', onClick: () => setActiveMenu('settings') },
  ]

  const content = {
    overview: <RegulatorOverviewPage />,
    incoming: <RegulatorIncomingReportsPage />,
    registered: <RegulatorRegisteredLoansPage />,
    settings: <RegulatorSettingsPage />,
  }[activeMenu]

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar username="Regulator" onLogout={onLogout} />

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
            {content}
          </div>
        </section>
      </main>
    </div>
  )
}
