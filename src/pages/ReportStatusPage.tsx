import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppNavbar,
  BackLink,
  PaginationBar,
  PageHeaderCard,
  ReportCard,
  SearchBar,
} from '../components'
import { tokens } from '../config/tokens'
import { paths } from '../router/paths'

export type ReportSummary = {
  appName: string
  description: string
  status: 'process' | 'selesai' | 'terminate'
  date: string
  link: string
  chronology: string
}

const reportItems: ReportSummary[] = [
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
  {
    appName: 'Cepat Cair Plus',
    description: 'Pengguna melaporkan adanya biaya tersembunyi yang tidak dijelaskan di awal.',
    status: 'process' as const,
    date: '19 Februari 2026',
    link: 'https://cepatcairplus.example.com',
    chronology: 'Aplikasi memotong biaya admin yang sangat besar di awal tanpa ada penjelasan di rincian biaya.',
  },
  {
    appName: 'Dana Kita',
    description: 'Laporan selesai diproses dan data aplikasi telah diperbarui.',
    status: 'selesai' as const,
    date: '18 Februari 2026',
    link: 'https://danakita.example.com',
    chronology: 'Melaporkan masalah teknis saat pengajuan. Sudah diselesaikan oleh tim dukungan.',
  },
]

export function ReportStatusPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredReports = useMemo(() => {
    return reportItems.filter((item) => {
      const matchesSearch = 
        item.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredReports.slice(startIndex, startIndex + pageSize)
  }, [filteredReports, currentPage, pageSize])

  const totalPages = Math.ceil(filteredReports.length / pageSize)

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={() => navigate(paths.login)} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Homepage" to={paths.home} />}
          title="Status Laporan Saya"
          description="Pantau setiap laporan yang telah kamu kirim, mulai dari verifikasi awal hingga hasil penanganan akhir."
        />

        <section
          className="space-y-5 border bg-white p-6 shadow-sm"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-1 flex-col gap-1 sm:max-w-md">
              <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
                Cari Laporan
              </label>
              <SearchBar 
                placeholder="Masukkan nama aplikasi atau deskripsi..." 
                className="h-[46px] max-w-full" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>

            <div className="flex flex-1 flex-col gap-1 sm:max-w-xs">
              <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
                Filter Status
              </label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full appearance-none px-4 pr-10 py-3 text-sm transition-all duration-200 outline-none hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#1AA86E] focus:border-transparent focus:shadow-sm"
                  style={{
                    borderRadius: tokens.radius.md,
                    border: `1px solid ${tokens.colors.slate[200]}`,
                    backgroundColor: tokens.colors.slate[50],
                    color: tokens.colors.slate[900],
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
                  }}
                >
                  <option value="all">Semua Status</option>
                  <option value="process">Diproses</option>
                  <option value="selesai">Selesai</option>
                  <option value="terminate">Ditolak</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-h-[400px]">
            {paginatedReports.length > 0 ? (
              paginatedReports.map((item) => (
                <ReportCard
                  key={`${item.appName}-${item.status}`}
                  appName={item.appName}
                  description={item.description}
                  status={item.status}
                  date={item.date}
                  className="w-full"
                  onClick={() => navigate(paths.reportDetail, { state: { report: item } })}
                />
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center py-12 text-center text-slate-400">
                <p>Tidak ada laporan yang sesuai dengan pencarian kamu.</p>
              </div>
            )}
          </div>

          <PaginationBar
            showingCount={paginatedReports.length}
            totalCount={filteredReports.length}
            itemLabel="laporan"
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50]}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
          />
        </section>
      </main>
    </div>
  )
}

