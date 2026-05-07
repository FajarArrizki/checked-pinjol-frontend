import {
  AppNavbar,
  BackLink,
  BuktiLampiran,
  PageHeaderCard,
  StatusPill,
} from '../components'
import heroImage from '../assets/hero.png'
import { tokens } from '../config/tokens'

type ReportStatus = 'process' | 'selesai' | 'terminate'

export type ReportDetail = {
  appName: string
  description: string
  status: ReportStatus
  date: string
  link: string
  chronology: string
}

type ReportDetailPageProps = {
  report: ReportDetail
  onBack?: () => void
  onLogout?: () => void
}

export function ReportDetailPage({ report, onBack, onLogout }: ReportDetailPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={onLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Status Laporan Saya" onClick={onBack} />}
          title="Detail Laporan"
          description="Tinjau detail laporan secara lengkap, termasuk status penanganan, kronologi, tautan aplikasi, dan bukti lampiran."
        />

        <section
          className="space-y-5 border bg-white p-6 shadow-sm"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: tokens.colors.slate[200] }}>
            <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[900] }}>
              Informasi Laporan
            </h2>

            <StatusPill status={report.status} />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Nama Aplikasi</span>
              <span className="text-sm" style={{ color: tokens.colors.slate[900] }}>{report.appName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Dilaporkan Pada</span>
              <span className="text-sm" style={{ color: tokens.colors.slate[900] }}>{report.date}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Tautan</span>
              <span className="text-sm break-all" style={{ color: tokens.colors.slate[900] }}>{report.link}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Deskripsi Kronologi</span>
              <p className="text-sm leading-7" style={{ color: tokens.colors.slate[900] }}>{report.chronology}</p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Bukti Lampiran</span>
              <BuktiLampiran title="bukti-laporan.png" size="1.4 MB" imageUrl={heroImage} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
