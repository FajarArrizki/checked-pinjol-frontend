import {
  AppNavbar,
  BackLink,
  PaginationBar,
  PageHeaderCard,
  ReportCard,
  SearchBar,
} from '../components'
import { tokens } from '../config/tokens'

type ReportStatusPageProps = {
  onBack?: () => void
  onLogout?: () => void
  onOpenDetail?: (report: {
    appName: string
    description: string
    status: 'process' | 'selesai' | 'terminate'
    date: string
    link: string
    chronology: string
  }) => void
}

const reportItems = [
  {
    appName: 'Pinjol Cepat Dana',
    description: 'Pengguna melaporkan bunga tidak sesuai dan penagihan yang terlalu agresif.',
    status: 'process' as const,
    date: '20 Februari 2026',
    link: 'https://pinjolcepatdana.example.com',
    chronology: 'Saya menemukan aplikasi menawarkan pinjaman dengan bunga yang berubah setelah proses pengajuan dan penagihan dilakukan secara agresif melalui beberapa kontak darurat.',
  },
  {
    appName: 'Dana Aman Sekali',
    description: 'Laporan sudah diverifikasi dan tindak lanjut awal telah diberikan oleh tim terkait.',
    status: 'selesai' as const,
    date: '20 Februari 2026',
    link: 'https://danaamansekali.example.com',
    chronology: 'Saya melaporkan perbedaan informasi antara halaman promosi dan rincian biaya akhir. Tim telah memberikan tindak lanjut dan status laporan dinyatakan selesai.',
  },
  {
    appName: 'Pinjam Kilat Pro',
    description: 'Laporan dihentikan karena lampiran bukti belum cukup untuk proses verifikasi lanjutan.',
    status: 'terminate' as const,
    date: '20 Februari 2026',
    link: 'https://pinjamkilatpro.example.com',
    chronology: 'Laporan dihentikan sementara karena bukti screenshot dan kronologi yang saya kirim belum cukup lengkap untuk diverifikasi lebih lanjut.',
  },
]

export function ReportStatusPage({ onBack, onLogout, onOpenDetail }: ReportStatusPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={onLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Homepage" onClick={onBack} />}
          title="Status Laporan Saya"
          description="Pantau perkembangan laporan yang sudah kamu kirim, mulai dari proses verifikasi sampai hasil akhir penanganan."
        />

        <section
          className="space-y-5 border bg-white p-6 shadow-sm"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <SearchBar placeholder="Cari laporan" />
            </div>

            <div className="flex flex-1 flex-col gap-1 sm:max-w-xs">
              <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
                Filter Status
              </label>
              <select
                className="w-full px-4 py-2 text-sm outline-none"
                style={{
                  borderRadius: tokens.radius.sm,
                  border: `1px solid ${tokens.colors.slate[300]}`,
                  backgroundColor: tokens.colors.white,
                  color: tokens.colors.slate[900],
                }}
                defaultValue="all"
              >
                <option value="all">Semua Status</option>
                <option value="process">Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="terminate">Ditolak</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {reportItems.map((item) => (
              <ReportCard
                key={`${item.appName}-${item.status}`}
                appName={item.appName}
                description={item.description}
                status={item.status}
                date={item.date}
                className="w-full p-6"
                onClick={() => onOpenDetail?.(item)}
              />
            ))}
          </div>

          <PaginationBar
            showingCount={3}
            totalCount={12}
            itemLabel="reports"
            currentPage={1}
            totalPages={4}
            pageSize={10}
            pageSizeOptions={[10, 20, 50]}
          />
        </section>
      </main>
    </div>
  )
}
