import { useState } from 'react'
import { AppNavbar, BackLink, Button, Input, PageHeaderCard, LegalityResultCard, ReviewCommentsModal } from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'
import { paths } from '../router/paths'
import { useAuth } from '../auth/AuthContext'
import { useLogoutRedirect } from '../auth/useLogoutRedirect'

type CheckResultItem = {
  id_pinjol: number
  nama_pinjol: string
  status_pinjol: string
  website?: string
  tahun_berdiri?: string
  alamat?: string
  rating_rata_rata?: number
  total_ulasan?: number
}

type CheckResult = {
  ditemukan: boolean
  kata_kunci: string
  total: number
  hasil: CheckResultItem[]
  pesan: string
} | null

export function LegalityCheckPage() {
  const handleLogout = useLogoutRedirect()
  const { token } = useAuth()
  const [appName, setAppName] = useState('')
  const [result, setResult] = useState<CheckResult>(null)
  const [reviewTarget, setReviewTarget] = useState<CheckResultItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheck() {
    if (!appName.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/pinjol/cek?nama=${encodeURIComponent(appName)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal cek legalitas')
      }

      setResult(json.data)
    } catch (checkError) {
      setError(checkError instanceof Error ? checkError.message : 'Gagal cek legalitas')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={handleLogout} />
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
          {result && (
            <LegalityResultCard
              name={result.kata_kunci}
              found={result.ditemukan}
              status={result.hasil[0]?.status_pinjol}
              website={result.hasil[0]?.website}
              alamat={result.hasil[0]?.alamat}
              tahunBerdiri={result.hasil[0]?.tahun_berdiri}
              rating={Number(result.hasil[0]?.rating_rata_rata ?? 0)}
              totalReviews={Number(result.hasil[0]?.total_ulasan ?? 0)}
              message={result.pesan}
              onOpenReviews={() => setReviewTarget(result.hasil[0] ?? null)}
            />
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <Button className="w-full py-3 font-semibold" onClick={handleCheck} disabled={loading}>
            {loading ? 'Mengecek...' : 'Cek Legalitas'}
          </Button>
        </section>
      </main>

      <ReviewCommentsModal
        isOpen={reviewTarget !== null}
        onClose={() => setReviewTarget(null)}
        pinjolId={reviewTarget?.id_pinjol ?? null}
        pinjolName={reviewTarget?.nama_pinjol ?? ''}
      />
    </div>
  )
}
