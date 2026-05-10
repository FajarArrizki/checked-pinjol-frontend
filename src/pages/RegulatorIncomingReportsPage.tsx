// src/pages/RegulatorIncomingReportsPage.tsx

import { useState, useMemo } from 'react'
import {
  TableList,
  StatusDropdown,
  PaginationBar,
  SearchBar,
  CategoryPill,
  ReportAcceptedModal,
  ReportRejectedModal,
} from '../components'
import { tokens } from '../config/tokens'
import type { StatusPillValue } from '../components/config/status-pill'

type Report = {
  id: number
  app: string
  reporter: string
  date: string
  status: StatusPillValue
  description: string
}

const allReports: Report[] = [
  { id: 1, app: 'UangKilat', reporter: 'Budi S.', date: '24/2/2026', status: 'process', description: 'Aplikasi melakukan penagihan kasar dan menyebarkan data pribadi ke kontak.' },
  { id: 2, app: 'CashNow', reporter: 'Siti A.', date: '24/2/2026', status: 'process', description: 'Bunga sangat tinggi dan tidak terdaftar OJK.' },
  { id: 3, app: 'PinjamDuit', reporter: 'Ahmad R.', date: '23/2/2026', status: 'process', description: 'Aplikasi meminta akses kontak dan galeri secara paksa.' },
  { id: 4, app: 'LoanFast', reporter: 'Linda W.', date: '23/2/2026', status: 'selesai', description: 'Penagihan dilakukan di luar jam yang diizinkan.' },
  { id: 5, app: 'TunaiSekarang', reporter: 'Dedi S.', date: '22/2/2026', status: 'terminate', description: 'Biaya admin dipotong sangat besar tanpa penjelasan.' },
  { id: 6, app: 'DanaKilat', reporter: 'Rani P.', date: '21/2/2026', status: 'process', description: 'Ancaman verbal kepada peminjam yang terlambat bayar.' },
  { id: 7, app: 'PinjamanCepat', reporter: 'Joko W.', date: '20/2/2026', status: 'selesai', description: 'Bunga berubah setelah proses pengajuan selesai.' },
]

const filters = ['Semua', 'Diproses', 'Selesai', 'Ditolak']

const filterMap: Record<string, StatusPillValue | null> = {
  'Semua': null,
  'Diproses': 'process',
  'Selesai': 'selesai',
  'Ditolak': 'terminate',
}

export function RegulatorIncomingReportsPage() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [reports, setReports] = useState<Report[]>(allReports)
  const [acceptModal, setAcceptModal] = useState<Report | null>(null)
  const [rejectModal, setRejectModal] = useState<Report | null>(null)

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchStatus = filterMap[activeFilter] === null || r.status === filterMap[activeFilter]
      const matchSearch =
        r.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reporter.toLowerCase().includes(searchQuery.toLowerCase())
      return matchStatus && matchSearch
    })
  }, [reports, activeFilter, searchQuery])

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredReports.slice(start, start + pageSize)
  }, [filteredReports, currentPage, pageSize])

  const totalPages = Math.ceil(filteredReports.length / pageSize)

  function handleStatusChange(id: number, newStatus: StatusPillValue) {
    setReports((curr) =>
      curr.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-[15px]">
      <h1 className="text-2xl font-semibold" style={{ color: tokens.colors.slate[800] }}>
        Laporan Masuk
      </h1>

      <TableList
        title=""
        headerContent={
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => { setActiveFilter(filter); setCurrentPage(1) }}
                  >
                    <CategoryPill active={activeFilter === filter}>{filter}</CategoryPill>
                  </button>
                ))}
              </div>
              <div className="w-full sm:w-auto sm:max-w-xs flex-1">
                <SearchBar
                  placeholder="Cari laporan..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                />
              </div>
            </div>
          </div>
        }
        columns={[
          { key: 'app', label: 'Nama Aplikasi' },
          { key: 'reporter', label: 'Pelapor' },
          { key: 'date', label: 'Tanggal' },
          { key: 'description', label: 'Deskripsi' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: 'Aksi' },
        ]}
        pagination={
          <PaginationBar
            showingCount={paginatedReports.length}
            totalCount={filteredReports.length}
            itemLabel="laporan"
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50]}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1) }}
          />
        }
      >
        {paginatedReports.map((report) => (
          <tr key={report.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
            <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[800] }}>
              {report.app}
            </td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>
              {report.reporter}
            </td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>
              {report.date}
            </td>
            <td className="px-4 py-4 text-sm max-w-xs" style={{ color: tokens.colors.slate[600] }}>
              <span className="line-clamp-2">{report.description}</span>
            </td>
            <td className="px-4 py-4 text-sm">
              <StatusDropdown
                status={report.status}
                onChange={(newStatus) => handleStatusChange(report.id, newStatus)}
              />
            </td>
            <td className="px-4 py-4 text-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAcceptModal(report)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: tokens.colors.brand.soft,
                    color: tokens.colors.brand.primary,
                  }}
                >
                  Terima
                </button>
                <button
                  onClick={() => setRejectModal(report)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: tokens.colors.danger.soft,
                    color: tokens.colors.danger.base,
                  }}
                >
                  Tolak
                </button>
              </div>
            </td>
          </tr>
        ))}
      </TableList>

      {/* Modal Terima */}
      {acceptModal && (
        <ReportAcceptedModal
          appName={acceptModal.app}
          onConfirm={() => {
            handleStatusChange(acceptModal.id, 'selesai')
            setAcceptModal(null)
          }}
          onCancel={() => setAcceptModal(null)}
        />
      )}

      {/* Modal Tolak */}
      {rejectModal && (
        <ReportRejectedModal
          appName={rejectModal.app}
          onConfirm={() => {
            handleStatusChange(rejectModal.id, 'terminate')
            setRejectModal(null)
          }}
          onCancel={() => setRejectModal(null)}
        />
      )}
    </div>
  )
}