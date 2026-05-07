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
} from '../components'
import heroImage from '../assets/hero.png'
import { tokens } from '../config/tokens'

import { paths } from '../router/paths'

export function ReportApplicationPage() {
  const [appLink, setAppLink] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

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
          <Button>Kirim Laporan</Button>
        </div>
      </main>
    </div>
  )
}
