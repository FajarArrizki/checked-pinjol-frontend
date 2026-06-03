import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

import {
  TableList,
  PaginationBar,
  SearchBar,
  CategoryPill,
  Modal,
  Button,
  Badge,
  BuktiLampiran,
  StatusPill,
} from '../components'
import { tokens } from '../config/tokens'
import type { StatusPillValue } from '../components/config/status-pill'
import { useAuth } from '../auth/AuthContext'
import {
  getAdminReports,
  getAdminReportDetail,
  replyAdminReport,
  type PaginatedReportsResponse,
  type AdminReportDetail,
} from '../auth/adminApi'
import { apiConfig } from '../config/api'

type ReportRow = {
  id: number
  app: string
  title: string
  reporter: string
  contact: string | null
  email: string | null
  code: string
  date: string
  status: StatusPillValue
}

type ReplyState = {
  status: StatusPillValue
  content: string
}

type SelectedReportSummary = {
  id: number
  app: string
  title: string
  reporter: string
  contact: string | null
  email: string | null
  code: string
  date: string
  status: StatusPillValue
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

export function RegulatorIncomingReportsPage() {
  const { token } = useAuth()
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [reports, setReports] = useState<ReportRow[]>([])
  const [meta, setMeta] = useState<PaginatedReportsResponse['meta']>({ current_page: 1, per_page: 10, total: 0, total_pages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null)
  const [selectedReport, setSelectedReport] = useState<AdminReportDetail | null>(null)
  const [selectedSummary, setSelectedSummary] = useState<SelectedReportSummary | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [replyState, setReplyState] = useState<ReplyState>({ status: 'diproses', content: '' })
  const [replyLoading, setReplyLoading] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)
  const [replySuccess, setReplySuccess] = useState<string | null>(null)

  async function loadReports(params?: { page?: number; perPage?: number; search?: string; active?: string }) {
    if (!token) return

    const backendStatus = (params?.active ?? activeFilter) === 'Diproses'
      ? 'diproses'
      : (params?.active ?? activeFilter) === 'Selesai'
        ? 'selesai'
        : (params?.active ?? activeFilter) === 'Ditolak'
          ? 'ditolak'
          : ''

    const response = await getAdminReports(token, {
      page: params?.page ?? currentPage,
      perPage: params?.perPage ?? pageSize,
      search: params?.search ?? searchQuery,
      status: backendStatus,
    })

    setMeta(response.meta)
    setReports(
      response.data.map((item) => ({
        id: item.id_laporan,
        app: item.nama_pinjol ?? item.judul_laporan,
        title: item.judul_laporan,
        reporter: item.nama_pelapor,
        contact: item.kontak_pelapor,
        email: item.email_pelapor,
        code: item.kode_laporan,
        date: new Date(item.tanggal_lapor).toLocaleDateString('id-ID'),
        status: mapStatus(item.status_laporan),
      })),
    )

    return response
  }

  useEffect(() => {
    if (!token) return

    let cancelled = false
    setLoading(true)
    setError(null)

    loadReports()
      .then(() => {
        if (cancelled) return
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Gagal memuat laporan')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, activeFilter, searchQuery, currentPage, pageSize])

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

  const filterKeys = ['Semua', 'Diproses', 'Selesai', 'Ditolak'] as const

  const filterLabels: Record<string, string> = {
    Semua: 'Semua',
    Diproses: `Diproses (${meta.status_counts?.diproses ?? 0})`,
    Selesai: `Selesai (${meta.status_counts?.selesai ?? 0})`,
    Ditolak: `Ditolak (${meta.status_counts?.ditolak ?? 0})`,
  }

  const totalPages = meta.total_pages

  function openDetail(id: number) {
    const summary = reports.find((item) => item.id === id) ?? null
    setSelectedSummary(summary)
    setSelectedReportId(id)
    setIsDetailOpen(true)
  }

  function openContact(id: number) {
    const summary = reports.find((item) => item.id === id) ?? null
    setSelectedSummary(summary)
    setReplyError(null)
    setReplySuccess(null)
    if (summary) {
      setReplyState({ status: summary.status, content: '' })
    }
    setSelectedReportId(id)
    setIsContactOpen(true)
  }

  function buildUploadUrl(relativePath: string) {
    return `${apiConfig.baseUrl}/api/uploads/${relativePath.replace(/^\/+/, '')}`
  }

  async function submitReply() {
    if (!token || !selectedReportId) return

    setReplyLoading(true)
    setReplyError(null)
    setReplySuccess(null)

    try {
      const updated = await replyAdminReport(token, selectedReportId, {
        status_laporan: toBackendStatus(replyState.status),
        tanggapan_ojk: replyState.content,
      })

      setSelectedReport(updated)
      setSelectedReportId(updated.id_laporan)
      setSelectedSummary((curr) => (curr && curr.id === updated.id_laporan ? { ...curr, status: mapStatus(updated.status_laporan) } : curr))
      setReports((curr) => curr.map((item) => (item.id === updated.id_laporan ? { ...item, status: mapStatus(updated.status_laporan) } : item)))
      setReplySuccess('Tanggapan berhasil dikirim ke pelapor.')

      await loadReports()
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : 'Gagal menyimpan balasan')
    } finally {
      setReplyLoading(false)
    }
  }

  const attachments = (selectedReport?.lampiran ?? []).map((item: any) => ({
    title: String(item.nama_file ?? 'bukti-laporan'),
    size: item.ukuran_file ? `${Math.max(1, Math.round(Number(item.ukuran_file) / 1024))} KB` : 'Bukti',
    imageUrl: item.file_path ? buildUploadUrl(String(item.file_path)) : undefined,
  }))

  if (!token) return null

  return (
    <div className="w-full h-full flex flex-col p-[15px] overflow-y-auto custom-scrollbar">
      <h1 className="pb-5 text-2xl font-semibold" style={{ color: tokens.colors.slate[700] }}>
        Laporan Masuk
      </h1>

      {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <TableList
          title=""
          headerContent={
            <div className="flex flex-col gap-6">
              <SearchBar
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="w-full max-w-full"
              />

              <div className="flex items-center gap-2 flex-wrap">
                {filterKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => { setActiveFilter(key); setCurrentPage(1) }}
                  >
                    <CategoryPill active={activeFilter === key}>{filterLabels[key]}</CategoryPill>
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
              showingCount={reports.length}
              totalCount={meta.total}
              itemLabel="reports"
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              pageSizeOptions={[10, 25, 50]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size: number) => { setPageSize(size); setCurrentPage(1) }}
            />
          }
        >
          {loading ? (
            <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>Memuat laporan...</td></tr>
          ) : reports.length === 0 ? (
            <tr><td className="px-4 py-6 text-sm text-slate-500" colSpan={5}>Tidak ada laporan.</td></tr>
          ) : reports.map((report) => (
            <tr
              key={report.id}
              onClick={() => openDetail(report.id)}
              className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-4 text-sm font-semibold" style={{ color: tokens.colors.slate[700] }}>
                {report.app}
              </td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>
                {report.reporter}
              </td>
              <td className="px-4 py-4 text-sm" style={{ color: tokens.colors.slate[600] }}>
                {report.date}
              </td>
              <td className="px-4 py-4 text-sm" onClick={(e) => e.stopPropagation()}>
                <StatusPill status={report.status} />
              </td>
              <td className="px-4 py-4 text-sm font-medium" style={{ color: tokens.colors.slate[400] }} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3">
                  <button type="button" className="hover:text-[#1AA86E] transition-colors" onClick={() => openContact(report.id)}>Hubungi</button>
                  <button
                    type="button"
                    className="hover:text-[#1AA86E] transition-colors"
                    onClick={() => openDetail(report.id)}
                  >
                    Detail
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </TableList>

      <Modal
        isOpen={isDetailOpen}
        onClose={() => { setIsDetailOpen(false); setSelectedReportId(null); setSelectedReport(null) }}
        title="Detail Laporan"
        description={selectedReport?.kode_laporan ?? 'Detail lengkap laporan'}
      >
        {detailLoading ? (
          <p className="text-sm text-slate-500">Memuat detail laporan...</p>
        ) : selectedReport ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{selectedReport.judul_laporan}</h3>
                <p className="text-sm text-slate-500">Pelapor: {selectedReport.nama_pelapor}</p>
              </div>
              <StatusPill status={mapStatus(selectedReport.status_laporan)} />
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
              <div><span className="block text-slate-500">Kontak</span><span className="font-medium text-slate-900">{selectedReport.kontak_pelapor ?? '-'}</span></div>
              <div><span className="block text-slate-500">Email</span><span className="font-medium text-slate-900">{selectedReport.email_pelapor ?? '-'}</span></div>
              <div><span className="block text-slate-500">Tautan Aplikasi</span><span className="break-all font-medium text-slate-900">{selectedReport.tautan_aplikasi ?? '-'}</span></div>
              <div><span className="block text-slate-500">Status Pinjol</span><span className="font-medium text-slate-900">{selectedReport.status_pinjol ?? '-'}</span></div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Isi Laporan</h4>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700" dangerouslySetInnerHTML={{ __html: selectedReport.isi_laporan ?? '' }} />
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Parameter Regulasi</h4>
              <div className="flex flex-wrap gap-2">
                {selectedReport.regulasi?.length ? selectedReport.regulasi.map((item: { id_regulasi: number; nama_kriteria: string }) => (
                  <Badge key={item.id_regulasi}>{item.nama_kriteria}</Badge>
                )) : <p className="text-sm text-slate-500">Belum ada parameter regulasi terkait.</p>}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-700">Bukti Lampiran</h4>
              <div className="space-y-3">
                {attachments.length ? attachments.map((attachment, index) => (
                  <BuktiLampiran key={`${attachment.title}-${index}`} title={attachment.title} size={attachment.size} imageUrl={attachment.imageUrl} />
                )) : <p className="text-sm text-slate-500">Tidak ada lampiran.</p>}
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-slate-700">Balasan Admin</h4>
              </div>
              <div className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: selectedReport.tanggapan_ojk ?? '<p>Belum ada balasan admin.</p>' }} />
            </div>

            {selectedReport?.foto_bukti ? (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-700">Bukti Gambar</h4>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <img
                    src={selectedReport.foto_bukti.startsWith('http') ? selectedReport.foto_bukti : `${apiConfig.baseUrl}/api/uploads/${selectedReport.foto_bukti.replace(/^\/+/, '')}`}
                    alt={selectedReport.judul_laporan ?? 'Bukti laporan'}
                    className="max-h-72 w-full rounded-xl object-contain"
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={isContactOpen}
        onClose={() => { setIsContactOpen(false); setSelectedReportId(null); setSelectedReport(null); setReplySuccess(null) }}
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
