import { useState } from 'react'

type RatingValue = 1 | 2 | 3 | 4 | 5

const ratingLabels: Record<RatingValue, string> = {
  1: 'Sangat Buruk',
  2: 'Buruk',
  3: 'Cukup',
  4: 'Bagus',
  5: 'Sangat Bagus',
}

type RatingSelectorProps = {
  defaultValue?: RatingValue
}

export function RatingSelector({ defaultValue = 5 }: RatingSelectorProps) {
  const [rating, setRating] = useState<RatingValue>(defaultValue)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        {([1, 2, 3, 4, 5] as RatingValue[]).map((value) => {
          const active = value <= rating

          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="transition-transform hover:scale-105"
              aria-label={`Rating ${value}`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className={[
                  'h-8 w-8',
                  active ? 'fill-[#FBBF24] text-[#FBBF24]' : 'fill-slate-200 text-slate-200',
                ].join(' ')}
              >
                <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 5.11a.56.56 0 0 0 .47.34l5.52.44a.56.56 0 0 1 .32.98l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.39a.56.56 0 0 1-.84.61L12.3 17.6a.56.56 0 0 0-.6 0l-4.71 2.93a.56.56 0 0 1-.84-.61l1.28-5.39a.56.56 0 0 0-.18-.56l-4.2-3.6a.56.56 0 0 1 .32-.98l5.52-.44a.56.56 0 0 0 .47-.34l2.12-5.11Z" />
              </svg>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-sm font-medium text-slate-600">{ratingLabels[rating]}</p>
    </div>
  )
}
