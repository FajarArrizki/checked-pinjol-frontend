import { tokens } from '../config/tokens'
import { ReviewStars } from './ReviewStars'

type LegalityResultCardProps = {
  pinjolId?: number | null
  name: string
  found: boolean
  status?: string
  website?: string
  alamat?: string
  tahunBerdiri?: string | number
  rating?: number
  totalReviews?: number
  message: string
  onOpenReviews?: () => void
}

export function LegalityResultCard({ name, found, status, website, alamat, tahunBerdiri, rating = 0, totalReviews = 0, message, onOpenReviews }: LegalityResultCardProps) {
  const isSafe = found && status !== 'ilegal'
  const statusLabel = status ? status.replace(/_/g, ' ') : '-'

  return (
    <div
      className="flex flex-col gap-5 border bg-white p-6 shadow-sm"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: isSafe ? tokens.colors.brand.soft : tokens.colors.danger.soft,
        boxShadow: tokens.shadow.sm,
        backgroundColor: isSafe ? tokens.colors.brand.softStrong : tokens.colors.danger.soft,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: tokens.colors.slate[500] }}>Hasil Pencarian</p>
          <h3 className="text-2xl font-bold" style={{ color: isSafe ? tokens.colors.brand.dark : tokens.colors.danger.dark }}>
            {isSafe ? 'Aman / Legal' : 'Berbahaya / Ilegal'}
          </h3>
          <p className="max-w-2xl text-sm leading-6" style={{ color: tokens.colors.slate[700] }}>{message}</p>
        </div>
        <span className="rounded-full border px-3 py-1.5 text-xs font-semibold" style={{ backgroundColor: tokens.colors.white, borderColor: tokens.colors.slate[200], color: tokens.colors.slate[700] }}>
          {name}
        </span>
      </div>

      {found && (
        <div className="space-y-4 rounded-2xl border bg-white p-5" style={{ borderColor: tokens.colors.slate[200] }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: tokens.colors.slate[400] }}>Nama Pinjol</p>
              <p className="mt-2 break-words text-sm font-semibold leading-6" style={{ color: tokens.colors.slate[900] }}>{name}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: tokens.colors.slate[400] }}>Tahun Berdiri</p>
              <p className="mt-2 text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{tahunBerdiri ?? '-'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: tokens.colors.slate[400] }}>Rating Pengguna</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <ReviewStars rating={rating} />
                <button
                  type="button"
                  onClick={onOpenReviews}
                  className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white"
                  style={{
                    borderColor: tokens.colors.slate[200],
                    backgroundColor: tokens.colors.white,
                    color: tokens.colors.slate[700],
                  }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75h6.75m-6.75 3h4.5m6.375-1.125c0 4.97-4.534 9-10.125 9a10.61 10.61 0 0 1-4.158-.844L3 21l1.364-3.409A8.964 8.964 0 0 1 2.25 11.625c0-4.97 4.534-9 10.125-9S22.5 6.655 22.5 11.625Z" />
                  </svg>
                  {totalReviews} ulasan
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: tokens.colors.slate[400] }}>Website</p>
              <p className="mt-2 break-all text-sm font-semibold leading-6" style={{ color: tokens.colors.slate[900] }}>{website ?? '-'}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: tokens.colors.slate[400] }}>Alamat</p>
              <p className="mt-2 text-sm font-semibold leading-6" style={{ color: tokens.colors.slate[900] }}>{alamat ?? '-'}</p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: tokens.colors.slate[400] }}>Status Legalitas</p>
              <p className="mt-2 text-sm font-semibold capitalize" style={{ color: tokens.colors.slate[900] }}>{statusLabel}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
