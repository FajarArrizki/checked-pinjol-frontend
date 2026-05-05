import { useState } from 'react'

import {
  ratingSelectorLabels,
  ratingSelectorStarStyle,
  type RatingValue,
} from './config/rating-selector'
import { tokens } from '../config/tokens'

type RatingSelectorProps = {
  defaultValue?: RatingValue
}

export function RatingSelector({ defaultValue = 5 }: RatingSelectorProps) {
  const [rating, setRating] = useState<RatingValue>(defaultValue)

  return (
    <div
      className="border bg-white p-5 shadow-sm"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[200],
        boxShadow: tokens.shadow.sm,
      }}
    >
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
                  active ? '' : '',
                ].join(' ')}
                style={{
                  ...(active ? ratingSelectorStarStyle.active : ratingSelectorStarStyle.inactive),
                }}
              >
                <path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 5.11a.56.56 0 0 0 .47.34l5.52.44a.56.56 0 0 1 .32.98l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.39a.56.56 0 0 1-.84.61L12.3 17.6a.56.56 0 0 0-.6 0l-4.71 2.93a.56.56 0 0 1-.84-.61l1.28-5.39a.56.56 0 0 0-.18-.56l-4.2-3.6a.56.56 0 0 1 .32-.98l5.52-.44a.56.56 0 0 0 .47-.34l2.12-5.11Z" />
              </svg>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>{ratingSelectorLabels[rating]}</p>
    </div>
  )
}
