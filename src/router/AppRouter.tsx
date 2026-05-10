import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import {
  HomePage,
  LoanSimulationPage,
  LoginPage,
  SignUpPage,
  ManajemenKontenPage,
  RegulatorDashboardPage,
  RegulatorIncomingReportsPage,
  RegulatorOverviewPage,
  RegulatorRegisteredLoansPage,
  RegulatorSettingsPage,
  SuperAdminPage,
  ReportApplicationPage,
  ReportDetailPage,
  ReportStatusPage,
  LegalityCheckPage,
  ReviewPage,
  EducationPage,
  ArticleDetailPage,
} from '../pages'
import { paths } from './paths'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={paths.login} replace />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.signup} element={<SignUpPage />} />
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.simulation} element={<LoanSimulationPage />} />
        <Route path={paths.reportApplication} element={<ReportApplicationPage />} />
        <Route path={paths.reportStatus} element={<ReportStatusPage />} />
        <Route path={paths.reportDetail} element={<ReportDetailPage />} />
        <Route path={paths.legalityCheck} element={<LegalityCheckPage />} />
        <Route path={paths.review} element={<ReviewPage />} />
        <Route path={paths.education} element={<EducationPage />} />
        <Route path={paths.articleDetail} element={<ArticleDetailPage />} />


        <Route path={paths.regulatorOverview} element={<RegulatorDashboardPage />}>
          <Route index element={<RegulatorOverviewPage />} />
          <Route path="incoming-reports" element={<RegulatorIncomingReportsPage />} />
          <Route path="registered-loans" element={<RegulatorRegisteredLoansPage />} />
          <Route path="content" element={<ManajemenKontenPage />} />
          <Route path="settings" element={<RegulatorSettingsPage />} />
          <Route path="super-admin" element={<SuperAdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
