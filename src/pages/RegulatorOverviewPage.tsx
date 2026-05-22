import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import {
  StatCard,
  TableList,
  PaginationBar,
  SearchBar,
  CategoryPill,
  Modal,
  Button,
  Badge,
  StatusPill,
} from '../components'
import { tokens } from '../config/tokens'
import type { StatusPillValue } from '../components/config/status-pill'
import { useAuth } from '../auth/AuthContext'
import { getAdminDashboard, getAdminReportDetail, replyAdminReport, type AdminDashboardResponse, type AdminReportDetail } from '../auth/adminApi'

type Report = {
  id: number
  app: string
  title: string
  reporter: string
  contact?: string | null
  email?: string | null
  code?: string
  date: string
  status: StatusPillValue
}

type ReplyState = {
  status: StatusPillValue
  content: string
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
    [{ color: [] }, { background: [] }],
  ],
}

export function RegulatorOverviewPage() {
  const { token } = useAuth()
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null)
  const [selectedSummary, setSelectedSummary] = useState<Report | null>(null)
  const [selectedReport, setSelectedReport] = useState<AdminReportDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [replyState, setReplyState] = useState<ReplyState>({ status: 'diproses', content: '' })
  const [replyLoading, setReplyLoading] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)
  const [replySuccess, setReplySuccess] = useState<string | null>(null)

  async function loadDashboard() {
    if (!token) return

    const data = await getAdminDashboard(token)
    setDashboard(data)
    setReports(
      data.laporan_terbaru.map((item) => ({
        id: item.id_laporan,
        app: item.nama_pinjol ?? item.judul_laporan,
        title: item.judul_laporan,
        reporter: item.nama_pelapor,
        contact: null,
        email: null,
        code: item.kode_laporan,
        date: new Date(item.tanggal_lapor).toLocaleDateString('id-ID'),
        status: mapStatus(item.status_laporan),
      })),
    )
  }

  useEffect(() => {
    if (!token) return

    let cancelled = false
    setLoading(true)
    setError(null)

    loadDashboard()
      .then(() => {
        if (cancelled) return
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Gagal memuat dashboard')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const stats = [
    {
      label: 'Laporan Hari Ini',
      value: dashboard?.overview.laporan_hari_ini ?? 0,
      description: 'laporan masuk hari ini',
      descriptionHighlight: String(dashboard?.overview.laporan_hari_ini ?? 0),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      ),
    },
    {
      label: 'Laporan Tertunda',
      value: dashboard?.overview.laporan_tertunda ?? 0,
      description: 'belum selesai',
      descriptionHighlight: String(dashboard?.overview.laporan_tertunda ?? 0),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: 'Aplikasi Baru',
      value: dashboard?.overview.aplikasi_baru_hari_ini ?? 0,
      description: 'hari ini',
      descriptionHighlight: String(dashboard?.overview.aplikasi_baru_hari_ini ?? 0),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5h3.75m3.75 0h-3.75m0 0v-3.75m0 3.75v3.75M12 2.25a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: 'Tindakan Selesai',
      value: dashboard?.overview.tindakan_selesai ?? 0,
      description: 'tingkat penyelesaian',
      descriptionHighlight: `${dashboard?.overview.tingkat_penyelesaian ?? 0}%`,
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
  ]

  const filters = ['Semua', 'Diproses', 'Selesai']

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.app.toLowerCase().includes(query.toLowerCase()) ||
      report.reporter.toLowerCase().includes(query.toLowerCase())

    if (activeFilter === 'Semua') return matchesSearch
    if (activeFilter === 'Diproses') return matchesSearch && report.status === 'diproses'
    if (activeFilter === 'Selesai') return matchesSearch && report.status === 'selesai'
    return matchesSearch
  })

  const paginatedReports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize))

  function openDetail(id: number) {
    setSelectedSummary(reports.find((item) => item.id === id) ?? null)
    setSelectedReportId(id)
    setIsDetailOpen(true)
  }

  function openContact(id: number) {
    setSelectedSummary(reports.find((item) => item.id === id) ?? null)
    setSelectedReportId(id)
    setReplyError(null)
    setReplySuccess(null)
    setIsContactOpen(true)
  }

  async function submitReply() {
    if (!token || selectedReportId === null) return

    setReplyLoading(true)
    setReplyError(null)
    setReplySuccess(null)

    try {
      const updated = await replyAdminReport(token, selectedReportId, {
        status_laporan: toBackendStatus(replyState.status),
        tanggapan_ojk: replyState.content,
      })

      setSelectedReport(updated)
      setReports((current) => current.map((report) => (
        report.id === updated.id_laporan ? { ...report, status: mapStatus(updated.status_laporan) } : report
      )))
      setSelectedSummary((current) => (
        current && current.id === updated.id_laporan ? { ...current, status: mapStatus(updated.status_laporan) } : current
      ))
      setReplySuccess('Tanggapan berhasil dikirim ke pelapor.')
      await loadDashboard()
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : 'Gagal menyimpan balasan')
    } finally {
      setReplyLoading(false)
    }
  }

  useEffect(() => {
    if (!token || selectedReportId === null) return

    let cancelled = false
    setDetailLoading(true)

    getAdminReportDetail(token, selectedReportId)
      .then((data) => {
        if (cancelled) return
        setSelectedReport(data)
        setReplyState({
          status: mapStatus(data.status_laporan),
          content: data.tanggapan_ojk ?? '',
        })
      })
      .catch(() => {
        if (cancelled) return
        setSelectedReport(null)
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, selectedReportId])

  return (
    <div className="w-full h-full flex flex-col gap-8 p-[15px]">
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold mb-6" style={{ color: tokens.colors.slate[700] }}>Overview</h1>

        {error ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        
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
              <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[700] }}>Laporan Terbaru</h2>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {filters.map(filter => (
                    <button key={filter} onClick={() => setActiveFilter(filter)}>
                      <CategoryPill active={activeFilter === filter}>{filter}</CategoryPill>
                    </button>
                  ))}
                </div>
                <div className="w-full sm:w-auto sm:max-w-xs flex-1">
                  <SearchBar placeholder="Cari laporan..." value={query} onChange={(e) => setQuery(e.target.value)} />
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
              showingCount={paginatedReports.length}
              totalCount={filteredReports.length}
              itemLabel="reports"
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 25, 50]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
            />
          }
        >
          {loading ? (
            <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>Memuat data overview...</td></tr>
          ) : paginatedReports.length === 0 ? (
            <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>Tidak ada laporan yang cocok.</td></tr>
          ) : paginatedReports.map((report) => (
            <tr key={report.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[700] }}>{report.app}</td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{report.reporter}</td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>{report.date}</td>
              <td className="px-4 py-4 text-sm">
                <StatusPill status={report.status} />
              </td>
              <td className="px-4 py-4 text-sm font-medium" style={{ color: tokens.colors.slate[400] }}>
                <div className="flex items-center gap-3">
                  <button type="button" className="hover:text-[#1AA86E] transition-colors" onClick={() => openContact(report.id)}>Hubungi</button>
                  <button type="button" className="hover:text-[#1AA86E] transition-colors" onClick={() => openDetail(report.id)}>Detail</button>
                </div>
              </td>
            </tr>
          ))}
        </TableList>
      </div>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedReportId(null); setSelectedReport(null); setSelectedSummary(null) }}
        title={selectedReport?.judul_laporan ?? selectedSummary?.title ?? 'Detail Laporan'}
        description={selectedReport?.kode_laporan ?? selectedSummary?.code ?? 'Detail lengkap laporan'}
      >
        {detailLoading && !selectedReport ? (
          <p className="text-sm text-slate-500">Memuat detail laporan...</p>
        ) : (
          <div className="space-y-4 pb-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
              <p className="font-semibold text-slate-900">{selectedReport?.judul_laporan ?? selectedSummary?.title ?? '-'}</p>
              <p className="mt-1 text-slate-500">{selectedReport?.kode_laporan ?? selectedSummary?.code ?? '-'}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div><span className="block text-slate-500">Nama Pelapor</span><span className="font-medium text-slate-900">{selectedReport?.nama_pelapor ?? selectedSummary?.reporter ?? '-'}</span></div>
              <div><span className="block text-slate-500">Kontak</span><span className="font-medium text-slate-900">{selectedReport?.kontak_pelapor ?? selectedSummary?.contact ?? '-'}</span></div>
              <div><span className="block text-slate-500">Email</span><span className="font-medium text-slate-900">{selectedReport?.email_pelapor ?? selectedSummary?.email ?? '-'}</span></div>
              <div><span className="block text-slate-500">Status</span><span className="font-medium text-slate-900">{selectedReport?.status_laporan ?? selectedSummary?.status ?? '-'}</span></div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Isi Laporan</h4>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700" dangerouslySetInnerHTML={{ __html: selectedReport?.isi_laporan ?? '' }} />
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Parameter Regulasi</h4>
              <div className="flex flex-wrap gap-2">
                {selectedReport?.regulasi?.length ? selectedReport.regulasi.map((item: { id_regulasi: number; nama_kriteria: string }) => (
                  <Badge key={item.id_regulasi}>{item.nama_kriteria}</Badge>
                )) : <p className="text-sm text-slate-500">Belum ada parameter regulasi terkait.</p>}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isContactOpen}
        onClose={() => { setIsContactOpen(false); setSelectedReportId(null); setSelectedReport(null); setSelectedSummary(null); setReplySuccess(null) }}
        title={selectedReport?.judul_laporan ?? selectedSummary?.title ?? 'Hubungi Laporan'}
        description={selectedReport?.kode_laporan ?? selectedSummary?.code ?? 'Balas laporan'}
      >
        {detailLoading && !selectedReport ? (
          <p className="text-sm text-slate-500">Memuat data laporan...</p>
        ) : replySuccess ? (
          <div className="space-y-4 pb-1">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-emerald-900">Tanggapan Berhasil Dikirim</h3>
                <p className="text-sm text-emerald-800">{replySuccess}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div><span className="block text-slate-500">Nama Pelapor</span><span className="font-medium text-slate-900">{selectedReport?.nama_pelapor ?? selectedSummary?.reporter ?? '-'}</span></div>
              <div><span className="block text-slate-500">Kode Laporan</span><span className="font-medium text-slate-900">{selectedReport?.kode_laporan ?? selectedSummary?.code ?? '-'}</span></div>
              <div>
                <span className="mb-2 block text-slate-500">Status Terbaru</span>
                <StatusPill status={mapStatus(selectedReport?.status_laporan ?? toBackendStatus(replyState.status))} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => { setReplySuccess(null); setIsContactOpen(false) }}>Tutup</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm">
              <p className="font-semibold text-slate-900">{selectedReport?.judul_laporan ?? selectedSummary?.title ?? '-'}</p>
              <p className="mt-1 text-slate-500">{selectedReport?.kode_laporan ?? selectedSummary?.code ?? '-'}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div><span className="block text-slate-500">Nama Pelapor</span><span className="font-medium text-slate-900">{selectedReport?.nama_pelapor ?? selectedSummary?.reporter ?? '-'}</span></div>
              <div><span className="block text-slate-500">Kontak</span><span className="font-medium text-slate-900">{selectedReport?.kontak_pelapor ?? selectedSummary?.contact ?? '-'}</span></div>
              <div><span className="block text-slate-500">Email</span><span className="font-medium text-slate-900">{selectedReport?.email_pelapor ?? selectedSummary?.email ?? '-'}</span></div>
              <div><span className="block text-slate-500">Kode Laporan</span><span className="font-medium text-slate-900">{selectedReport?.kode_laporan ?? selectedSummary?.code ?? '-'}</span></div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Isi Laporan</h4>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700" dangerouslySetInnerHTML={{ __html: selectedReport?.isi_laporan ?? '' }} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: tokens.colors.slate[700] }}>Status</label>
              <select
                value={replyState.status}
                onChange={(e) => setReplyState((curr) => ({ ...curr, status: e.target.value as StatusPillValue }))}
                className="w-full px-4 py-3 text-sm outline-none"
                style={{ border: `1px solid ${tokens.colors.slate[200]}`, borderRadius: tokens.radius.sm }}
              >
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 quill-container">
              <label className="text-sm font-medium" style={{ color: tokens.colors.slate[700] }}>Tanggapan</label>
              <ReactQuill
                theme="snow"
                value={replyState.content}
                onChange={(value) => setReplyState((curr) => ({ ...curr, content: value }))}
                modules={quillModules}
                className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200"
                placeholder="Tulis tanggapan admin di sini..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setIsContactOpen(false)}>Batal</Button>
              <Button onClick={submitReply} disabled={replyLoading}>{replyLoading ? 'Mengirim...' : 'Kirim'}</Button>
            </div>

            {replyError ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {replyError}
              </p>
            ) : null}
          </div>
        )}
      </Modal>

      <style>{`
        .quill-container .ql-editor {
          min-height: 140px;
          max-height: 180px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  )
}

function mapStatus(status: string): StatusPillValue {
  if (status === 'menunggu' || status === 'pending') return 'diproses'
  if (status === 'diproses' || status === 'process') return 'diproses'
  if (status === 'selesai') return 'selesai'
  if (status === 'ditolak' || status === 'terminate') return 'ditolak'
  return 'diproses'
}

function toBackendStatus(status: StatusPillValue): string {
  if (status === 'pending') return 'diproses'
  if (status === 'diproses' || status === 'process') return 'diproses'
  if (status === 'selesai') return 'selesai'
  if (status === 'ditolak' || status === 'terminate') return 'ditolak'
  return 'diproses'
}
