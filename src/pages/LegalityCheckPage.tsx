import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppNavbar, BackLink, Button, Input, PageHeaderCard } from '../components'
import { tokens } from '../config/tokens'
import { paths } from '../router/paths'

type CheckResult = 'safe' | 'dangerous' | null

export function LegalityCheckPage() {
  const navigate = useNavigate()
  const [appName, setAppName] = useState('')
  const [result, setResult] = useState<CheckResult>(null)

  function handleCheck() {
    if (!appName.trim()) return
    setResult(Math.random() > 0.5 ? 'safe' : 'dangerous')
  }

  if (result === 'safe') {
    return (
      <div className="min-h-screen bg-white">
        <AppNavbar onLogout={() => navigate(paths.login)} />
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
          <div
            className="flex flex-col items-center gap-6 p-16"
            style={{
              borderRadius: tokens.radius.lg,
              backgroundColor: tokens.colors.brand.soft,
            }}
          >
            <div
              className="flex h-24 w-24 items-center justify-center"
              style={{
                borderRadius: tokens.radius.full,
                backgroundColor: tokens.colors.white,
              }}
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: tokens.colors.brand.primary }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-3xl font-bold" style={{ color: tokens.colors.brand.dark }}>
                Aplikasi Pinjaman Online Aman
              </h2>
              <p className="text-sm" style={{ color: tokens.colors.brand.primary }}>
                Aplikasi ini terdaftar di Otoritas Jasa Keuangan (OJK)
              </p>
            </div>
            <button
              onClick={() => navigate(paths.home)}
              className="px-8 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
              style={{
                borderRadius: tokens.radius.md,
                border: `1px solid ${tokens.colors.slate[900]}`,
                backgroundColor: tokens.colors.white,
                color: tokens.colors.slate[900],
              }}
            >
              Kembali Ke Homepage
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (result === 'dangerous') {
    return (
      <div className="min-h-screen bg-white">
        <AppNavbar onLogout={() => navigate(paths.login)} />
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
          <div
            className="flex flex-col items-center gap-6 p-16"
            style={{
              borderRadius: tokens.radius.lg,
              backgroundColor: tokens.colors.danger.soft,
            }}
          >
            <div
              className="flex h-24 w-24 items-center justify-center"
              style={{
                borderRadius: tokens.radius.full,
                backgroundColor: tokens.colors.white,
              }}
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: tokens.colors.danger.dark }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-3xl font-bold" style={{ color: tokens.colors.danger.dark }}>
                Aplikasi Pinjaman Online Berbahaya
              </h2>
              <p className="text-sm" style={{ color: tokens.colors.danger.base }}>
                Aplikasi ini Tidak Terdaftar di Otoritas Jasa Keuangan (OJK)
              </p>
            </div>
            <button
              onClick={() => navigate(paths.home)}
              className="px-8 py-3 text-sm font-semibold transition-colors hover:bg-slate-50"
              style={{
                borderRadius: tokens.radius.md,
                border: `1px solid ${tokens.colors.slate[900]}`,
                backgroundColor: tokens.colors.white,
                color: tokens.colors.slate[900],
              }}
            >
              Kembali Ke Homepage
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={() => navigate(paths.login)} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Homepage" to={paths.home} />}
          title="Cek Legalitas Pinjol"
          description="Periksa apakah aplikasi pinjaman online terdaftar di OJK"
        />
        <section
          className="flex flex-col gap-6 p-6 border bg-white shadow-sm"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <Input
            label="Nama Aplikasi"
            placeholder="Contoh: PinjamanCepat"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />
          <Button className="w-full py-3 font-semibold" onClick={handleCheck}>
            Cek Legalitas
          </Button>
        </section>
      </main>
    </div>
  )
}