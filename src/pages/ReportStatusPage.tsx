import { useEffect, useMemo, useState } from 'react'
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
import { apiConfig } from '../config/api'
import { paths } from '../router/paths'
import { useLogoutRedirect } from '../auth/useLogoutRedirect'
import { useAuth } from '../auth/AuthContext'
import type { StatusPillValue } from '../components/config/status-pill'

export type ReportSummary = {
  id: number
  appName: string
  description: string
  status: StatusPillValue
  date: string
  link: string
  chronology: string
}

export function ReportStatusPage() {
  const navigate = useNavigate()
  const handleLogout = useLogoutRedirect()
  const { token } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    async function loadReports() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${apiConfig.baseUrl}/api/laporan`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const json = await response.json()

        if (!alive || !response.ok) {
          throw new Error(json?.message || 'Gagal memuat laporan')
        }

        const items = Array.isArray(json.data) ? json.data : []
        setReports(items.map((item: any) => ({
          id: Number(item.id_laporan ?? item.id ?? 0),
          appName: item.judul_laporan ?? item.nama_pinjol ?? 'Laporan',
          description: item.isi_laporan ?? '',
          status: normalizeStatus(String(item.status_laporan ?? 'diproses')),
          date: item.tanggal_lapor ?? '',
          link: item.tautan_aplikasi ?? '',
          chronology: item.isi_laporan ?? '',
        })))
      } catch (err) {
        if (alive) {
          setReports([])
          setError(err instanceof Error ? err.message : 'Gagal memuat laporan')
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    const refreshOnFocus = () => {
      if (token) {
        loadReports().catch(() => setReports([]))
      }
    }

    const refreshOnVisibility = () => {
      if (document.visibilityState === 'visible' && token) {
        loadReports().catch(() => setReports([]))
      }
    }

    if (token) {
      loadReports().catch(() => setReports([]))
      window.addEventListener('focus', refreshOnFocus)
      document.addEventListener('visibilitychange', refreshOnVisibility)
    }

    return () => {
      alive = false
      window.removeEventListener('focus', refreshOnFocus)
      document.removeEventListener('visibilitychange', refreshOnVisibility)
    }
  }, [token])

  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchesSearch = 
        item.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter, reports])

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredReports.slice(startIndex, startIndex + pageSize)
  }, [filteredReports, currentPage, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize))

  const isEmpty = !loading && !error && reports.length === 0

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={handleLogout} />

      <main className="flex w-full flex-col gap-6 px-8 py-8">
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
            {loading ? (
              <div className="flex flex-1 items-center justify-center py-12 text-sm text-slate-400">
                Memuat laporan...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : paginatedReports.length > 0 ? (
              paginatedReports.map((item) => (
                <ReportCard
                  key={item.id}
                  appName={item.appName}
                  description={item.description}
                  status={item.status}
                  date={item.date}
                  className="w-full"
                  onClick={() => navigate(paths.reportDetail.replace(':id', String(item.id)), { state: { report: item } })}
                />
              ))
            ) : isEmpty ? (
              <div className="flex flex-1 items-center justify-center py-12 text-center text-slate-400">
                <div className="max-w-sm space-y-2">
                  <p className="text-base font-medium text-slate-700">Belum ada laporan</p>
                  <p className="text-sm leading-6">Semua laporan yang kamu kirim akan muncul di sini setelah tersimpan di backend.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center py-12 text-center text-slate-400">
                <p>Tidak ada laporan yang sesuai dengan pencarian kamu.</p>
              </div>
            )}
          </div>

          {!loading && !error && filteredReports.length > 0 && (
            <PaginationBar
              showingCount={paginatedReports.length}
              totalCount={filteredReports.length}
              itemLabel="laporan"
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 20, 50]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size: number) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
            />
          )}
        </section>
      </main>
    </div>
  )
}

function normalizeStatus(status: string): StatusPillValue {
  if (status === 'menunggu' || status === 'pending') return 'diproses'
  if (status === 'diproses' || status === 'process') return 'diproses'
  if (status === 'selesai') return 'selesai'
  if (status === 'ditolak' || status === 'terminate') return 'ditolak'
  return 'diproses'
}
