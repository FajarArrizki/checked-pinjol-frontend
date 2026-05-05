import { tokens } from '../../config/tokens'

export const spinnerSizeClass = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
} as const

export const spinnerStyle = {
  color: tokens.colors.brand.primary,
} as const
