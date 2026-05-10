import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppNavbar, BackLink, Button, PageHeaderCard, RatingSelector } from '../components'
import { tokens } from '../config/tokens'
import { paths } from '../router/paths'

export function ReviewPage() {
  const navigate = useNavigate()
  const [comment, setComment] = useState('')
  const [image, setImage] = useState<File | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) setImage(e.target.files[0])
  }

  function handleSubmit() {
    alert('Ulasan berhasil dikirim!')
    navigate(paths.home)
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={() => navigate(paths.login)} />
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
          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>
              Berikan Rating
            </label>
            <RatingSelector />
          </div>

          {/* Komentar */}
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

          {/* Upload Screenshot */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>
              Tambahkan Screenshot (Opsional)
            </label>
            <label
              className="flex cursor-pointer flex-col items-center justify-center gap-2 py-10 transition-colors hover:bg-slate-50"
              style={{
                borderRadius: tokens.radius.md,
                border: `1px dashed ${tokens.colors.slate[300]}`,
              }}
            >
              <input
                type="file"
                accept="image/jpg,image/png"
                className="hidden"
                onChange={handleImageChange}
              />
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: tokens.colors.slate[400] }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              {image ? (
                <p className="text-sm font-medium" style={{ color: tokens.colors.brand.primary }}>{image.name}</p>
              ) : (
                <>
                  <p className="text-sm" style={{ color: tokens.colors.slate[400] }}>Klik untuk upload screenshot atau bukti lainnya</p>
                  <p className="text-xs" style={{ color: tokens.colors.slate[400] }}>JPG, PNG (Maks. 5MB)</p>
                </>
              )}
            </label>
          </div>

          {/* Catatan */}
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: '#EEF2FF' }}
          >
            <span className="font-semibold" style={{ color: tokens.colors.slate[700] }}>Catatan : </span>
            <span style={{ color: tokens.colors.slate[600] }}>Ulasan anda akan membantu pengguna lain dalam memilih aplikasi pinjaman aman dan terpercaya</span>
          </div>

          <Button className="w-full py-3 font-semibold" onClick={handleSubmit}>
            Kirim Ulasan
          </Button>
        </section>
      </main>
    </div>
  )
}