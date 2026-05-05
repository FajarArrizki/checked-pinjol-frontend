import { tokens } from '../../config/tokens'

export const surfaceConfig = {
  card: {
    borderRadius: tokens.radius.lg,
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.white,
    boxShadow: tokens.shadow.sm,
  },
  subtle: {
    borderRadius: tokens.radius.md,
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.white,
  },
  softBadge: {
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.slate[100],
    color: tokens.colors.slate[600],
  },
} as const
