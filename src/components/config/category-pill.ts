import { tokens } from '../../config/tokens'

export const categoryPillStyles = {
  active: {
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.brand.primary,
    color: tokens.colors.white,
  },
  inactive: {
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.slate[100],
    color: tokens.colors.slate[500],
  },
} as const
