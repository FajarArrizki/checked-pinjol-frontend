import { useState } from 'react'

import {
  HomePage,
  LoanSimulationPage,
  LoginPage,
  ReportApplicationPage,
  ReportDetailPage,
  ReportStatusPage,
} from './pages'
import type { ReportDetail } from './pages'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'home' | 'simulation' | 'report-application' | 'report-status' | 'report-detail'>('login')
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null)

  if (currentPage === 'report-detail' && selectedReport) {
    return (
      <ReportDetailPage
        report={selectedReport}
        onBack={() => setCurrentPage('report-status')}
        onLogout={() => setCurrentPage('login')}
      />
    )
  }

  if (currentPage === 'report-status') {
    return (
      <ReportStatusPage
        onBack={() => setCurrentPage('home')}
        onLogout={() => setCurrentPage('login')}
        onOpenDetail={(report) => {
          setSelectedReport(report)
          setCurrentPage('report-detail')
        }}
      />
    )
  }

  if (currentPage === 'report-application') {
    return <ReportApplicationPage onBack={() => setCurrentPage('home')} onLogout={() => setCurrentPage('login')} />
  }

  if (currentPage === 'simulation') {
    return <LoanSimulationPage onBack={() => setCurrentPage('home')} onLogout={() => setCurrentPage('login')} />
  }

  if (currentPage === 'home') {
    return (
      <HomePage
        onLogout={() => setCurrentPage('login')}
        onOpenSimulation={() => setCurrentPage('simulation')}
        onOpenReportApplication={() => setCurrentPage('report-application')}
        onOpenReportStatus={() => setCurrentPage('report-status')}
      />
    )
  }

  return <LoginPage onLogin={() => setCurrentPage('home')} />
}

export default App
