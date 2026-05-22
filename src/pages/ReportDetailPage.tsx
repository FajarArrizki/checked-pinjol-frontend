import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  AppNavbar,
  Badge,
  BackLink,
  BuktiLampiran,
  OjkResponseHeader,
  PageHeaderCard,
  StatusPill,
} from '../components'
import { tokens } from '../config/tokens'
import { paths } from '../router/paths'
import { useLogoutRedirect } from '../auth/useLogoutRedirect'
import { useAuth } from '../auth/AuthContext'
import { useEffect, useState } from 'react'
import { apiConfig } from '../config/api'
import heroImage from '../assets/hero.png'
import type { StatusPillValue } from '../components/config/status-pill'

const supportingFaqItems = [
  {
    question: 'Apa arti status selesai pada laporan saya?',
    answer:
      'Status selesai berarti laporan sudah ditinjau dan penanganan awal dari pihak regulator telah ditutup. Jika masih dibutuhkan, Anda tetap dapat menyimpan bukti dan tanggapan ini untuk tindak lanjut berikutnya.',
  },
  {
    question: 'Apakah tanggapan admin bisa berubah lagi?',
    answer:
      'Tanggapan yang tampil adalah balasan terakhir yang tersimpan pada sistem. Jika ada pembaruan lanjutan dari admin regulator, isi tanggapan pada halaman ini akan ikut diperbarui sesuai data terbaru.',
  },
  {
    question: 'Apa yang perlu saya lakukan setelah menerima tanggapan?',
    answer:
      'Periksa isi balasan dengan teliti, simpan nomor laporan Anda, dan simpan seluruh bukti pendukung. Jika diminta langkah tambahan, ikuti arahan yang tertulis pada tanggapan regulator.',
  },
  {
    question: 'Berapa lama laporan biasanya diproses?',
    answer:
      'Lama proses dapat berbeda tergantung kelengkapan data, bukti yang dikirim, dan kebutuhan verifikasi lanjutan. Status pada halaman ini akan diperbarui ketika ada perkembangan baru dari admin regulator.',
  },
  {
    question: 'Apakah saya perlu mengirim bukti tambahan setelah laporan dibuat?',
    answer:
      'Jika ada perkembangan kasus atau bukti baru yang penting, simpan dokumentasinya terlebih dahulu. Bila diminta oleh admin atau diperlukan untuk kasus lanjutan, bukti tambahan tersebut dapat digunakan sebagai referensi tindak lanjut berikutnya.',
  },
  {
    question: 'Apakah saya bisa membuat laporan baru untuk kasus yang sama?',
    answer:
      'Sebaiknya gunakan laporan yang sudah ada sebagai referensi utama jika kasusnya masih sama. Buat laporan baru hanya jika ada kejadian berbeda, aplikasi berbeda, atau perkembangan baru yang memang perlu dicatat terpisah.',
  },
]

const statusGuidance: Record<StatusPillValue, { title: string; description: string }> = {
  diproses: {
    title: 'Laporan Anda sedang ditangani oleh admin regulator.',
    description:
      'Status diproses berarti laporan sedang diperiksa bersama data dan bukti yang Anda kirim. Pada tahap ini, Anda hanya perlu memantau pembaruan status dan menunggu tanggapan resmi pada halaman detail laporan.',
  },
  selesai: {
    title: 'Laporan Anda sudah memiliki hasil penanganan awal.',
    description:
      'Status selesai menunjukkan bahwa admin regulator telah memberikan hasil penanganan atau balasan terakhir untuk laporan ini. Simpan tanggapan tersebut sebagai referensi jika Anda membutuhkan tindak lanjut berikutnya.',
  },
  ditolak: {
    title: 'Laporan belum dapat dilanjutkan pada tahap ini.',
    description:
      'Status ditolak biasanya berarti laporan memerlukan data tambahan, bukti yang lebih kuat, atau tidak sesuai cakupan penanganan saat ini. Periksa kembali detail laporan Anda dan siapkan informasi pendukung bila diperlukan.',
  },
  pending: {
    title: 'Laporan Anda sedang ditangani oleh admin regulator.',
    description:
      'Status diproses berarti laporan sedang diperiksa bersama data dan bukti yang Anda kirim. Pada tahap ini, Anda hanya perlu memantau pembaruan status dan menunggu tanggapan resmi pada halaman detail laporan.',
  },
  process: {
    title: 'Laporan Anda sedang ditangani oleh admin regulator.',
    description:
      'Status diproses berarti laporan sedang diperiksa bersama data dan bukti yang Anda kirim. Pada tahap ini, Anda hanya perlu memantau pembaruan status dan menunggu tanggapan resmi pada halaman detail laporan.',
  },
  terminate: {
    title: 'Laporan belum dapat dilanjutkan pada tahap ini.',
    description:
      'Status ditolak biasanya berarti laporan memerlukan data tambahan, bukti yang lebih kuat, atau tidak sesuai cakupan penanganan saat ini. Periksa kembali detail laporan Anda dan siapkan informasi pendukung bila diperlukan.',
  },
}

export type ReportDetail = {
  appName: string
  description: string
  status: StatusPillValue
  date: string
  link: string
  chronology: string
  regulatorResponse?: {
    name: string
    respondedAt: string
    message: string
    imageUrl?: string
  }
  regulations?: Array<{
    id: number
    name: string
  }>
  attachments?: Array<{
    title: string
    size: string
    imageUrl?: string
  }>
}

export function ReportDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const handleLogout = useLogoutRedirect()
  const { token } = useAuth()
  const [report, setReport] = useState<ReportDetail | null>((location.state as { report?: ReportDetail } | null)?.report ?? null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const buildUploadUrl = (relativePath: string) =>
    `${apiConfig.baseUrl}/api/uploads/${relativePath.replace(/^\/+/, '')}`

  useEffect(() => {
    const stateReport = (location.state as { report?: ReportDetail } | null)?.report
    if (stateReport) {
      setReport(stateReport)
    }

    if (!id || !token) return

    let alive = true

    async function loadReport() {
      try {
        const response = await fetch(`${apiConfig.baseUrl}/api/laporan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const json = await response.json()

        if (!alive || !json?.data) return

        const attachments = Array.isArray(json.data.lampiran)
          ? json.data.lampiran.map((item: any) => ({
              title: String(item.nama_file ?? 'bukti-laporan'),
              size: item.ukuran_file ? `${Math.max(1, Math.round(Number(item.ukuran_file) / 1024))} KB` : 'Bukti',
              imageUrl: item.file_path ? buildUploadUrl(String(item.file_path)) : undefined,
            }))
          : []

        const primaryImage = json.data.foto_bukti ? buildUploadUrl(String(json.data.foto_bukti)) : undefined

        if (!attachments.some((attachment: { imageUrl?: string }) => attachment.imageUrl === primaryImage) && primaryImage) {
          attachments.push({
            title: 'bukti-laporan',
            size: 'Bukti utama',
            imageUrl: primaryImage,
          })
        }

        const replyMessage = json.data.tanggapan_ojk ? String(json.data.tanggapan_ojk) : ''
        const replyAt = json.data.tanggal_tanggapan ?? ''

        setReport({
          appName: json.data.judul_laporan ?? json.data.nama_pinjol ?? 'Laporan',
          description: json.data.isi_laporan ?? '',
          status: normalizeStatus(String(json.data.status_laporan ?? 'diproses')),
          date: json.data.tanggal_lapor ?? '',
          link: json.data.tautan_aplikasi ?? '',
          chronology: json.data.isi_laporan ?? '',
          regulations: Array.isArray(json.data.regulasi)
            ? json.data.regulasi.map((item: { id_regulasi: number; nama_kriteria: string }) => ({
                id: item.id_regulasi,
                name: item.nama_kriteria,
              }))
            : [],
          attachments,
          regulatorResponse: replyMessage || replyAt
            ? {
                name: 'Satgas Pasti (OJK)',
                respondedAt: replyAt || '22 Februari 2026, 14:30 WIB',
                message: replyMessage || 'Laporan telah ditinjau oleh regulator. Mohon pantau tindak lanjut resmi sesuai hasil verifikasi data dan bukti yang tersedia.',
                imageUrl: heroImage,
              }
            : undefined,
        })
      } catch {
        if (alive) {
          setReport(null)
        }
      }
    }

    const refreshOnFocus = () => {
      if (token && id) {
        loadReport().catch(() => setReport(null))
      }
    }

    const refreshOnVisibility = () => {
      if (document.visibilityState === 'visible' && token && id) {
        loadReport().catch(() => setReport(null))
      }
    }

    loadReport().catch(() => setReport(null))
    window.addEventListener('focus', refreshOnFocus)
    document.addEventListener('visibilitychange', refreshOnVisibility)

    return () => {
      alive = false
      window.removeEventListener('focus', refreshOnFocus)
      document.removeEventListener('visibilitychange', refreshOnVisibility)
    }
  }, [location.pathname, location.state, token, id])

  if (!report) {
    navigate(paths.reportStatus)
    return null
  }

  const guidance = statusGuidance[report.status] ?? statusGuidance.diproses

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={handleLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Status Laporan Saya" to={paths.reportStatus} />}
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
              <span className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Jenis Regulasi</span>
              <div className="flex flex-wrap gap-2">
                {report.regulations?.length ? report.regulations.map((regulation) => (
                  <Badge key={regulation.id}>{regulation.name}</Badge>
                )) : (
                  <p className="text-sm" style={{ color: tokens.colors.slate[500] }}>
                    Belum ada jenis regulasi terkait.
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Bukti Lampiran</span>
              {report.attachments?.length ? (
                <div className="space-y-3">
                  {report.attachments.map((attachment, index) => (
                    <BuktiLampiran
                      key={`${attachment.title}-${index}`}
                      title={attachment.title}
                      size={attachment.size}
                      imageUrl={attachment.imageUrl}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: tokens.colors.slate[500] }}>
                  Tidak ada bukti lampiran yang tersimpan.
                </p>
              )}
            </div>

            <div className="space-y-4 border-t pt-5" style={{ borderColor: tokens.colors.slate[200] }}>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: tokens.colors.slate[200] }}>
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[900] }}>
                    Tanggapan Regulator
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: tokens.colors.slate[500] }}>
                    Status laporan, panduan singkat, dan balasan resmi dari admin regulator untuk laporan ini.
                  </p>
                </div>

                <StatusPill status={report.status} />
              </div>

              <div
                className="overflow-hidden border bg-white"
                style={{
                  borderRadius: tokens.radius.lg,
                  borderColor: tokens.colors.slate[200],
                  boxShadow: tokens.shadow.sm,
                }}
              >
                {report.regulatorResponse ? (
                  <>
                    <div className="border-b bg-slate-50 px-5 py-4" style={{ borderColor: tokens.colors.slate[200] }}>
                      <OjkResponseHeader
                        name={report.regulatorResponse.name}
                        respondedAt={report.regulatorResponse.respondedAt}
                        imageUrl={report.regulatorResponse.imageUrl}
                      />
                    </div>

                    <div className="space-y-4 px-5 py-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                          style={{
                            borderColor: '#BBF7D0',
                            backgroundColor: '#F0FDF4',
                            color: '#166534',
                          }}
                        >
                          Update Penanganan
                        </span>
                        <span className="text-xs" style={{ color: tokens.colors.slate[400] }}>
                          Tersimpan pada {report.regulatorResponse.respondedAt}
                        </span>
                      </div>

                      <div
                        className="rounded-2xl border bg-slate-50 px-4 py-4 text-sm leading-7"
                        style={{
                          borderColor: tokens.colors.slate[200],
                          color: tokens.colors.slate[700],
                        }}
                        dangerouslySetInnerHTML={{ __html: report.regulatorResponse.message }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 px-5 py-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium"
                        style={{
                          borderColor: tokens.colors.slate[200],
                          backgroundColor: tokens.colors.slate[50],
                          color: tokens.colors.slate[600],
                        }}
                      >
                        Belum Ada Tanggapan
                      </span>
                    </div>

                    <div className="rounded-2xl border bg-slate-50 px-5 py-5" style={{ borderColor: tokens.colors.slate[200] }}>
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
                          style={{
                            borderColor: '#BFDBFE',
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                          }}
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold leading-7" style={{ color: tokens.colors.slate[900] }}>
                            {guidance.title}
                          </h3>
                          <p className="mt-2 text-sm leading-7" style={{ color: tokens.colors.slate[600] }}>
                            {guidance.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-0 rounded-2xl bg-transparent">
                <div className="px-0 py-0">
                  <h3 className="text-sm font-bold" style={{ color: tokens.colors.slate[900] }}>
                    FAQ Pendukung
                  </h3>
                  <p className="mt-1 text-xs leading-6" style={{ color: tokens.colors.slate[500] }}>
                    Informasi tambahan ini bersifat tetap sebagai panduan singkat saat laporan Anda sedang diproses maupun sudah menerima tanggapan regulator.
                  </p>
                </div>

                <div className="mt-3 rounded-2xl bg-slate-50">
                  {supportingFaqItems.map((item, index) => {
                    const isOpen = openFaqIndex === index

                    return (
                      <div
                        key={item.question}
                        className={index > 0 ? 'border-t' : ''}
                        style={index > 0 ? { borderColor: tokens.colors.slate[200] } : undefined}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/70"
                          onClick={() => setOpenFaqIndex((current) => (current === index ? null : index))}
                        >
                          <span className="text-sm font-medium" style={{ color: tokens.colors.slate[700] }}>
                            {item.question}
                          </span>
                          <span
                            className={`text-lg leading-none transition-transform ${isOpen ? 'rotate-45' : ''}`}
                            style={{ color: tokens.colors.slate[400] }}
                          >
                            +
                          </span>
                        </button>

                        {isOpen ? (
                          <div className="px-4 pb-4">
                            <div
                              className="px-0 py-0 text-sm leading-7"
                              style={{ color: tokens.colors.slate[600] }}
                            >
                              {item.answer}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
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
