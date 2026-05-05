import { tokens } from '../../config/tokens'

export type RatingValue = 1 | 2 | 3 | 4 | 5

export const ratingSelectorLabels: Record<RatingValue, string> = {
  1: 'Sangat Buruk',
  2: 'Buruk',
  3: 'Cukup',
  4: 'Bagus',
  5: 'Sangat Bagus',
}

export const ratingSelectorStarStyle = {
  active: {
    fill: tokens.colors.warning.base,
    color: tokens.colors.warning.base,
  },
  inactive: {
    fill: tokens.colors.slate[200],
    color: tokens.colors.slate[200],
  },
} as const
