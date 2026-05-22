import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AppNavbar,
  BackLink,
  Badge,
  BuktiLampiran,
  Button,
  Input,
  PageHeaderCard,
  PhotoUploadCard,
  Modal
} from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'

import { paths } from '../router/paths'
import { useAuth } from '../auth/AuthContext'
import { useLogoutRedirect } from '../auth/useLogoutRedirect'
import { emailRequirementText, isValidEmail, isValidPhoneNumber, normalizeDigits, phoneRequirementText } from '../utils/validation'

type ReportFormErrors = {
  reporterName?: string
  appName?: string
  contact?: string
  email?: string
  appLink?: string
  description?: string
  evidence?: string
  general?: string
}

type RegulationItem = {
  id_regulasi: number
  nama_kriteria: string
  deskripsi?: string | null
}

export function ReportApplicationPage() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [reporterName, setReporterName] = useState(user?.name ?? '')
  const [appName, setAppName] = useState('')
  const [contact, setContact] = useState('')
  const [appLink, setAppLink] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([])
  const [regulations, setRegulations] = useState<RegulationItem[]>([])
  const [selectedRegulationIds, setSelectedRegulationIds] = useState<number[]>([])
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<ReportFormErrors>({})
  const handleLogout = useLogoutRedirect()

  const handleEvidenceFilesChange = (files: File[]) => {
    setEvidenceFiles((prev) => {
      const next = [...prev]

      for (const file of files) {
        const alreadyExists = next.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        )

        if (!alreadyExists) {
          next.push(file)
        }
      }

      return next
    })
  }

  const handleRemoveEvidenceFile = (targetFile: File) => {
    setEvidenceFiles((prev) =>
      prev.filter(
        (file) =>
          !(
            file.name === targetFile.name &&
            file.size === targetFile.size &&
            file.lastModified === targetFile.lastModified
          ),
      ),
    )
  }

  const evidencePreviews = useMemo(
    () => evidenceFiles.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    [evidenceFiles],
  )

  const validateForm = () => {
    const nextErrors: ReportFormErrors = {}

    if (!reporterName.trim()) {
      nextErrors.reporterName = 'Nama pelapor wajib diisi.'
    }

    if (!appName.trim()) {
      nextErrors.appName = 'Nama aplikasi wajib diisi.'
    } else if (appName.trim().length < 5) {
      nextErrors.appName = 'Nama aplikasi minimal 5 karakter.'
    }

    if (!email.trim()) {
      nextErrors.email = 'Email wajib diisi.'
    } else if (!isValidEmail(email.trim())) {
      nextErrors.email = emailRequirementText
    }

    if (!contact.trim()) {
      nextErrors.contact = 'Kontak wajib diisi.'
    } else if (!isValidPhoneNumber(normalizeDigits(contact))) {
      nextErrors.contact = phoneRequirementText
    }

    if (!appLink.trim()) {
      nextErrors.appLink = 'Tautan aplikasi wajib diisi.'
    } else {
      try {
        new URL(appLink.trim())
      } catch {
        nextErrors.appLink = 'Format tautan aplikasi tidak valid.'
      }
    }

    if (!description.trim()) {
      nextErrors.description = 'Deskripsi laporan wajib diisi.'
    } else if (description.trim().length < 20) {
      nextErrors.description = 'Deskripsi laporan minimal 20 karakter.'
    }

    return nextErrors
  }

  const mapSubmitError = (message: string): ReportFormErrors => {
    if (message.includes('nama_pelapor')) {
      return { reporterName: message }
    }

    if (message.includes('kontak_pelapor')) {
      return { contact: message }
    }

    if (message.includes('judul_laporan')) {
      return { appName: message }
    }

    if (message.includes('isi_laporan')) {
      return { description: message }
    }

    if (message.includes('email')) {
      return { email: message }
    }

    if (message.includes('tautan_aplikasi')) {
      return { appLink: message }
    }

    if (message.includes('foto_bukti')) {
      return { evidence: message }
    }

    return { general: message }
  }

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${apiConfig.baseUrl}/api/regulasi`, { signal: controller.signal })
      .then((response) => response.json())
      .then((json) => {
        const items = Array.isArray(json?.data) ? json.data : []
        setRegulations(items)
      })
      .catch(() => setRegulations([]))

    return () => {
      controller.abort()
      evidencePreviews.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [evidencePreviews])

  const toggleRegulation = (id: number) => {
    setSelectedRegulationIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ))
  }

  const handleSubmit = async () => {
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const form = new FormData()
      form.append('judul_laporan', appName)
      form.append('isi_laporan', description)
      form.append('nama_pelapor', reporterName)
      form.append('kontak_pelapor', normalizeDigits(contact))
      form.append('email_pelapor', email)
      form.append('tautan_aplikasi', appLink)
      selectedRegulationIds.forEach((id) => form.append('regulasi_ids[]', String(id)))
      evidenceFiles.forEach((file) => {
        form.append('foto_bukti[]', file)
      })

      if (evidenceFiles.length === 0) {
        form.append('foto_bukti', '')
      }

      const response = await fetch(`${apiConfig.baseUrl}/api/laporan`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: form,
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const message = payload?.message ?? 'Gagal mengirim laporan'
        throw new Error(message)
      }

      setIsSuccessModalOpen(true)
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Gagal mengirim laporan'
      setErrors(mapSubmitError(message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={handleLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Homepage" to={paths.home} />}
          title="Laporkan Aplikasi"
          description="Laporkan aplikasi yang mencurigakan atau bermasalah dengan menyertakan tautan, kronologi singkat, dan bukti pendukung."
        />

        <section
          className="space-y-5 border bg-white p-6 shadow-sm"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <Input
            label="Nama Pelapor"
            type="text"
            placeholder="Masukkan nama pelapor"
            value={reporterName}
            onChange={(event) => setReporterName(event.target.value)}
            error={errors.reporterName}
          />

          <Input
            label="Nama Aplikasi"
            type="text"
            placeholder="Masukkan nama aplikasi yang dilaporkan"
            value={appName}
            onChange={(event) => setAppName(event.target.value)}
            error={errors.appName}
          />

          <Input
            label="No HP / Kontak"
            type="tel"
            placeholder="Masukkan nomor yang bisa dihubungi"
            value={contact}
            inputMode="numeric"
            maxLength={12}
            onChange={(event) => setContact(normalizeDigits(event.target.value).slice(0, 12))}
            error={errors.contact}
          />
          <p className="-mt-3 text-xs text-slate-400">{phoneRequirementText}</p>

          <Input
            label="Email"
            type="email"
            placeholder="Masukkan email yang bisa dihubungi"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />
          <p className="-mt-3 text-xs text-slate-400">{emailRequirementText}</p>

          <Input
            label="Tautan Aplikasi"
            type="url"
            placeholder="Masukkan link aplikasi atau website"
            value={appLink}
            onChange={(event) => setAppLink(event.target.value)}
            error={errors.appLink}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
              Deskripsi Singkat
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Jelaskan singkat alasan laporan kamu"
              className="min-h-32 w-full px-4 py-3 text-sm transition-all duration-200 outline-none hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#1AA86E] focus:border-transparent focus:shadow-sm"
              style={{
                borderRadius: tokens.radius.md,
                border: `1px solid ${tokens.colors.slate[200]}`,
                backgroundColor: tokens.colors.slate[50],
                color: tokens.colors.slate[900],
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
                ...(errors.description ? { borderColor: '#f87171', backgroundColor: '#fff5f5' } : {}),
              }}
            />
            {errors.description && (
              <span className="text-xs" style={{ color: '#dc2626' }}>
                {errors.description}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
              Parameter Regulasi Terkait
            </label>

            <div className="flex flex-wrap gap-2">
              {regulations.length > 0 ? regulations.map((item) => (
                <Badge
                  key={item.id_regulasi}
                  onClick={() => toggleRegulation(item.id_regulasi)}
                  className={selectedRegulationIds.includes(item.id_regulasi) ? 'bg-[#E1F5EE] text-slate-900 border-[#A7F3D0]' : ''}
                >
                  {item.nama_kriteria}
                </Badge>
              )) : (
                <p className="text-sm text-slate-500">Belum ada parameter regulasi aktif.</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
              Bukti Screenshot
            </label>

            <PhotoUploadCard
              description="Upload screenshot aplikasi atau halaman terkait sebagai bukti pendukung laporan."
              multiple
              onFileChange={handleEvidenceFilesChange}
            />

            {evidencePreviews.length > 0 && (
              <div className="space-y-3">
                {evidencePreviews.map(({ file, previewUrl }, index) => (
                  <BuktiLampiran
                    key={`${file.name}-${index}`}
                    title={file.name}
                    size={`${Math.max(1, Math.round(file.size / 1024))} KB`}
                    imageUrl={previewUrl}
                    onRemove={() => handleRemoveEvidenceFile(file)}
                  />
                ))}
              </div>
            )}

            {errors.evidence && (
              <p className="text-xs" style={{ color: '#dc2626' }}>
                {errors.evidence}
              </p>
            )}
          </div>

        </section>

        {errors.general && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errors.general}
          </p>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
          </Button>
        </div>
      </main>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Laporan Berhasil Terkirim"
        description="Terima kasih atas laporan Anda. Kami akan segera melakukan pengecekan terhadap aplikasi tersebut."
      >
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              ID Laporan Anda: <span className="font-bold text-slate-900">#CP-240226001</span>
            </p>
            <p className="text-xs text-slate-400">
              Simpan ID ini untuk mengecek status laporan Anda di kemudian hari.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 pt-2">
            <Button className="w-full" onClick={() => navigate(paths.reportStatus)}>
              Cek Status Laporan
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => navigate(paths.home)}>
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
