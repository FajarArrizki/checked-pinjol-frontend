import { useState } from 'react'
import {
  StatCard,
  TableList,
  StatusPill,
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

export function RegulatorOverviewPage() {
  const [activeFilter, setActiveFilter] = useState('Semua')

  const stats = [
    {
      label: 'Laporan Hari Ini',
      value: 8,
      description: 'dari kemarin',
      descriptionHighlight: '+12%',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      )
    },
    {
      label: 'Laporan Tertunda',
      value: 23,
      description: 'jam terakhir',
      descriptionHighlight: '2',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      label: 'Aplikasi Baru',
      value: 5,
      description: 'baru hari ini',
      descriptionHighlight: '+1',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5h3.75m3.75 0h-3.75m0 0v-3.75m0 3.75v3.75M12 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      label: 'Tindakan Selesai',
      value: 142,
      description: 'tingkat penyelesaian',
      descriptionHighlight: '98%',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    }
  ]

  const filters = ['Semua', 'Diproses', 'Selesai', 'Pending']

  const [recentReports, setRecentReports] = useState<Report[]>([
    { id: 1, app: 'UangKilat', reporter: 'Budi S.', date: '24/2/2026', status: 'process' },
    { id: 2, app: 'CashNow', reporter: 'Siti A.', date: '24/2/2026', status: 'process' },
    { id: 3, app: 'PinjamDuit', reporter: 'Ahmad R.', date: '23/2/2026', status: 'process' },
    { id: 4, app: 'LoanFast', reporter: 'Linda W.', date: '23/2/2026', status: 'process' },
    { id: 5, app: 'TunaiSekarang', reporter: 'Dedi S.', date: '22/2/2026', status: 'process' },
  ])

  const handleStatusChange = (id: number, newStatus: StatusPillValue) => {
    setRecentReports(current => 
      current.map(report => report.id === id ? { ...report, status: newStatus } : report)
    )
  }

  return (
    <div className="w-full h-full flex flex-col gap-8 p-[15px]">
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold mb-6" style={{ color: tokens.colors.slate[800] }}>Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              label={stat.label}
              value={stat.value}
              description={stat.description}
              descriptionHighlight={stat.descriptionHighlight}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <TableList
          title=""
          headerContent={
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[800] }}>Laporan Terbaru</h2>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {filters.map(filter => (
                    <button key={filter} onClick={() => setActiveFilter(filter)}>
                      <CategoryPill active={activeFilter === filter}>{filter}</CategoryPill>
                    </button>
                  ))}
                </div>
                <div className="w-full sm:w-auto sm:max-w-xs flex-1">
                  <SearchBar placeholder="Cari laporan..." />
                </div>
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
              showingCount={5}
              totalCount={12}
              itemLabel="reports"
              currentPage={1}
              totalPages={3}
              pageSize={10}
              pageSizeOptions={[10, 25, 50]}
            />
          }
        >
          {recentReports.map((report) => (
            <tr key={report.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[800] }}>{report.app}</td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{report.reporter}</td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{report.date}</td>
              <td className="px-4 py-4 text-sm">
                <StatusDropdown 
                  status={report.status} 
                  onChange={(newStatus) => handleStatusChange(report.id, newStatus)} 
                />
              </td>
              <td className="px-4 py-4 text-sm font-medium" style={{ color: tokens.colors.slate[400] }}>
                <a href="#" className="hover:text-[#1AA86E] transition-colors">Hubungi</a>
              </td>
            </tr>
          ))}
        </TableList>
      </div>
    </div>
  )
}
