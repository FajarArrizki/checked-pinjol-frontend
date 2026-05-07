import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AppNavbar,
  BackLink,
  BuktiLampiran,
  Button,
  Input,
  PageHeaderCard,
  PhotoUploadCard,
  Modal
} from '../components'
import heroImage from '../assets/hero.png'
import { tokens } from '../config/tokens'

import { paths } from '../router/paths'

export function ReportApplicationPage() {
  const [appLink, setAppLink] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    // In a real app, this would be an API call
    setIsSuccessModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={() => navigate(paths.login)} />

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
            label="Tautan Aplikasi"
            type="url"
            placeholder="Masukkan link aplikasi atau website"
            value={appLink}
            onChange={(event) => setAppLink(event.target.value)}
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
              }}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
              Bukti Screenshot
            </label>

            <PhotoUploadCard description="Upload screenshot aplikasi atau halaman terkait sebagai bukti pendukung laporan." />

            <BuktiLampiran title="screenshot-aplikasi.png" size="1.4 MB" imageUrl={heroImage} />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="Masukkan email yang bisa dihubungi"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </section>

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Kirim Laporan</Button>
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
