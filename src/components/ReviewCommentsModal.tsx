import { useEffect, useState } from 'react'
import { apiConfig } from '../config/api'
import { Modal, Button, ReviewStars } from './index'

type ReviewItem = {
  id_ulasan: number
  nama_pengulas: string
  rating: number
  komentar: string
  created_at?: string | null
}

type ReviewCommentsModalProps = {
  isOpen: boolean
  onClose: () => void
  pinjolId: number | null
  pinjolName: string
}

export function ReviewCommentsModal({ isOpen, onClose, pinjolId, pinjolName }: ReviewCommentsModalProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen || !pinjolId) return

    let cancelled = false
    setLoading(true)
    setError('')

    fetch(`${apiConfig.baseUrl}/api/ulasan?id_pinjol=${pinjolId}&per_page=20`)
      .then((response) => response.json().then((json) => ({ response, json })))
      .then(({ response, json }) => {
        if (cancelled) return
        if (!response.ok) {
          throw new Error(json?.message ?? 'Gagal memuat ulasan')
        }

        setReviews(Array.isArray(json.data) ? json.data : [])
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Gagal memuat ulasan')
        setReviews([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isOpen, pinjolId])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ulasan Pengguna"
      description={pinjolName ? `Komentar dan rating user untuk ${pinjolName}.` : 'Komentar dan rating user.'}
    >
      <div className="flex max-h-[65vh] flex-col gap-4 overflow-hidden">
        {loading ? <p className="text-sm text-slate-500">Memuat ulasan...</p> : null}
        {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        {!loading && !error && reviews.length === 0 ? (
          <p className="text-sm text-slate-500">Belum ada komentar user untuk pinjol ini.</p>
        ) : null}

        {!loading && !error && reviews.length > 0 ? (
          <div className="custom-scrollbar space-y-3 overflow-y-auto pr-2">
            {reviews.map((review) => (
              <div key={review.id_ulasan} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{review.nama_pengulas}</p>
                    <ReviewStars rating={Number(review.rating)} />
                  </div>
                  <p className="text-sm leading-7 text-slate-600">{review.komentar}</p>
                  {review.created_at ? <p className="text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString('id-ID')}</p> : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex shrink-0 justify-end pt-2">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </Modal>
  )
}
