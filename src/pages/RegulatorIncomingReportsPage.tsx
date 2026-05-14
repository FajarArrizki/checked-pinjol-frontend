import { useState, useMemo } from 'react'
import {
  TableList,
  StatusDropdown,
  PaginationBar,
  SearchBar,
  CategoryPill,
} from '../components'
import { tokens } from '../config/tokens'
import type { StatusPillValue } from '../components/config/status-pill'

type Report = {
  id: number
  app: string
  reporter: string
  date: string
  status: StatusPillValue
}

const allReports: Report[] = [
  { id: 1, app: 'UangKilat', reporter: 'Budi S.', date: '24/2/2026', status: 'process' },
  { id: 2, app: 'CashNow', reporter: 'Siti A.', date: '24/2/2026', status: 'process' },
  { id: 3, app: 'PinjamDuit', reporter: 'Ahmad R.', date: '23/2/2026', status: 'process' },
  { id: 4, app: 'LoanFast', reporter: 'Linda W.', date: '23/2/2026', status: 'process' },
  { id: 5, app: 'TunaiSekarang', reporter: 'Dedi S.', date: '22/2/2026', status: 'selesai' },
]

export function RegulatorIncomingReportsPage() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [reports, setReports] = useState<Report[]>(allReports)

  const filterCounts = useMemo(() => ({
    menunggu: reports.filter((r) => r.status === 'process').length,
    diproses: reports.filter((r) => r.status === 'process').length,
    selesai: reports.filter((r) => r.status === 'selesai').length,
  }), [reports])

  const filters = [
    'Semua',
    `Menunggu (${filterCounts.menunggu})`,
    `Diproses (${filterCounts.diproses})`,
    `Selesai (${filterCounts.selesai})`,
  ]

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchSearch =
        r.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reporter.toLowerCase().includes(searchQuery.toLowerCase())

      if (activeFilter === 'Semua') return matchSearch
      if (activeFilter.startsWith('Menunggu')) return matchSearch && r.status === 'process'
      if (activeFilter.startsWith('Diproses')) return matchSearch && r.status === 'process'
      if (activeFilter.startsWith('Selesai')) return matchSearch && r.status === 'selesai'
      return matchSearch
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
            {/* SearchBar full width */}
            <SearchBar
              placeholder="Cari laporan..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="w-full max-w-full"
            />

            {/* Filter Tabs */}
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
          </div>
        }
        columns={[
          { key: 'app', label: 'Nama Aplikasi' },
          { key: 'reporter', label: 'Pelapor' },
          { key: 'date', label: 'Tanggal' },
          { key: 'status', label: 'Status' },
          { key: 'action', label: 'Aksi' },
        ]}
        pagination={
          <PaginationBar
            showingCount={paginatedReports.length}
            totalCount={filteredReports.length}
            itemLabel="reports"
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
          <tr
            key={report.id}
            className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[800] }}>
              {report.app}
            </td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>
              {report.reporter}
            </td>
            <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>
              {report.date}
            </td>
            <td className="px-4 py-4 text-sm">
              <StatusDropdown
                status={report.status}
                onChange={(newStatus) => handleStatusChange(report.id, newStatus)}
              />
            </td>
            <td className="px-4 py-4 text-sm font-medium" style={{ color: tokens.colors.slate[400] }}>
              Hubungi
            </td>
          </tr>
        ))}
      </TableList>
    </div>
  )
}