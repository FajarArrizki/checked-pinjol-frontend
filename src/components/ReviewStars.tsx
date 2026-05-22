type ReviewStarsProps = {
  rating: number
  totalReviews?: number
}

export function ReviewStars({ rating, totalReviews }: ReviewStarsProps) {
  const safeRating = Number.isFinite(rating) ? Math.max(0, Math.min(5, rating)) : 0

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            style={{
              fill: star <= Math.round(safeRating) ? '#FBBF24' : '#E2E8F0',
              color: star <= Math.round(safeRating) ? '#FBBF24' : '#E2E8F0',
            }}
          >
            <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 5.11a.56.56 0 0 0 .47.34l5.52.44a.56.56 0 0 1 .32.98l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.39a.56.56 0 0 1-.84.61L12.3 17.6a.56.56 0 0 0-.6 0l-4.71 2.93a.56.56 0 0 1-.84-.61l1.28-5.39a.56.56 0 0 0-.18-.56l-4.2-3.6a.56.56 0 0 1 .32-.98l5.52-.44a.56.56 0 0 0 .47-.34l2.12-5.11Z" />
          </svg>
        ))}
      </div>

      <span className="text-sm font-medium text-slate-900">{safeRating.toFixed(1)}</span>
      {typeof totalReviews === 'number' ? (
        <span className="text-sm text-slate-500">({totalReviews} ulasan)</span>
      ) : null}
    </div>
  )
}
