import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppNavbar, BackLink, Button, PageHeaderCard, RatingSelector, PhotoUploadCard, BuktiLampiran, Modal } from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'
import { paths } from '../router/paths'
import { useLogoutRedirect } from '../auth/useLogoutRedirect'
import { useAuth } from '../auth/AuthContext'

type PinjolOption = { id: number; name: string }

export function ReviewPage() {
  const navigate = useNavigate()
  const handleLogout = useLogoutRedirect()
  const { token, user } = useAuth()
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [rating, setRating] = useState(5)
  const [pinjolId, setPinjolId] = useState('')
  const [pinjolOptions, setPinjolOptions] = useState<PinjolOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  useEffect(() => {
    fetch(`${apiConfig.baseUrl}/api/pinjol`)
      .then((res) => res.json())
      .then((json) => {
        const items = Array.isArray(json.data) ? json.data : []
        const mapped = items.map((item: any) => ({ id: Number(item.id_pinjol), name: String(item.nama_pinjol) }))
        setPinjolOptions(mapped)
        if (items[0]?.id_pinjol) {
          setPinjolId(String(items[0].id_pinjol))
        }
      })
      .catch(() => setPinjolOptions([]))
  }, [])

  const imagePreviews = useMemo(
    () => images.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    [images],
  )

  useEffect(() => {
    return () => {
      imagePreviews.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [imagePreviews])

  const handleImagesChange = (files: File[]) => {
    setImages((prev) => {
      const next = [...prev]

      for (const file of files) {
        const exists = next.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified,
        )

        if (!exists) next.push(file)
      }

      return next
    })
  }

  const handleRemoveImage = (targetFile: File) => {
    setImages((prev) =>
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

  async function handleSubmit() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/ulasan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id_pinjol: Number(pinjolId),
          nama_pengulas: user?.name ?? 'Pengguna Anonim',
          rating,
          komentar: comment,
        }),
      })

      const json = await response.json()
      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal mengirim ulasan')
      }

      setIsSuccessModalOpen(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Gagal mengirim ulasan')
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
          title="Tulis Ulasan"
          description="Bantu lindungi masyarakat dari pinjol illegal"
        />

        <section
          className="flex flex-col gap-6 p-6 border bg-white shadow-sm"
          style={{
            borderRadius: tokens.radius.lg,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>
              Berikan Rating
            </label>
            <RatingSelector defaultValue={5} onChange={setRating} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>
              Pilih Pinjol
            </label>
            <select
              value={pinjolId}
              onChange={(e) => setPinjolId(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1AA86E]"
              style={{ borderColor: tokens.colors.slate[200] }}
            >
              {pinjolOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>
              Tulis Komentar
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagikan pengalaman anda dengan aplikasi ini..."
              rows={5}
              className="w-full resize-none px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
              style={{
                borderRadius: tokens.radius.md,
                border: `1px solid ${tokens.colors.slate[200]}`,
                color: tokens.colors.slate[900],
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>
              Tambahkan Screenshot (Opsional)
            </label>

            <PhotoUploadCard
              description="Klik untuk upload screenshot atau bukti lainnya."
              multiple
              onFileChange={handleImagesChange}
            />

            {imagePreviews.length > 0 && (
              <div className="space-y-3">
                {imagePreviews.map(({ file, previewUrl }, index) => (
                  <BuktiLampiran
                    key={`${file.name}-${index}`}
                    title={file.name}
                    size={`${Math.max(1, Math.round(file.size / 1024))} KB`}
                    imageUrl={previewUrl}
                    onRemove={() => handleRemoveImage(file)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#EEF2FF' }}>
            <span className="font-semibold" style={{ color: tokens.colors.slate[700] }}>Catatan : </span>
            <span style={{ color: tokens.colors.slate[600] }}>Ulasan anda akan membantu pengguna lain dalam memilih aplikasi pinjaman aman dan terpercaya</span>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button className="w-full py-3 font-semibold" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim Ulasan'}
          </Button>
        </section>
      </main>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Ulasan Berhasil Terkirim"
        description="Terima kasih atas ulasan kamu. Masukan kamu sangat membantu pengguna lain memilih aplikasi yang lebih aman."
      >
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Ulasan kamu sudah berhasil disimpan.
            </p>
            <p className="text-xs text-slate-400">
              Kamu bisa menutup modal ini dan tetap berada di halaman ulasan.
            </p>
          </div>

          <Button className="w-full" onClick={() => navigate(paths.home)}>
            Kembali ke Beranda
          </Button>
        </div>
      </Modal>
    </div>
  )
}
