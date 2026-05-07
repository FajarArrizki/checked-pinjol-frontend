import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import {
  HomePage,
  LoanSimulationPage,
  LoginPage,
  RegulatorDashboardPage,
  RegulatorIncomingReportsPage,
  RegulatorOverviewPage,
  RegulatorRegisteredLoansPage,
  RegulatorSettingsPage,
  ReportApplicationPage,
  ReportDetailPage,
  ReportStatusPage,
} from '../pages'
import { paths } from './paths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={paths.login} replace />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.simulation} element={<LoanSimulationPage />} />
        <Route path={paths.reportApplication} element={<ReportApplicationPage />} />
        <Route path={paths.reportStatus} element={<ReportStatusPage />} />
        <Route path={paths.reportDetail} element={<ReportDetailPage />} />

        <Route path={paths.regulatorOverview} element={<RegulatorDashboardPage />}>
          <Route index element={<RegulatorOverviewPage />} />
          <Route path="incoming-reports" element={<RegulatorIncomingReportsPage />} />
          <Route path="registered-loans" element={<RegulatorRegisteredLoansPage />} />
          <Route path="settings" element={<RegulatorSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
