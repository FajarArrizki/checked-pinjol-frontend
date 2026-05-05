import { tokens } from '../../config/tokens'

export const paginationConfig = {
  container: {
    borderRadius: tokens.radius.lg,
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.white,
    boxShadow: tokens.shadow.sm,
  },
  control: {
    borderRadius: tokens.radius.sm,
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.white,
    color: tokens.colors.slate[600],
  },
  activePage: {
    borderColor: tokens.colors.slate[900],
    backgroundColor: tokens.colors.slate[900],
    color: tokens.colors.white,
  },
  inactivePage: {
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.white,
    color: tokens.colors.slate[700],
  },
  select: {
    borderRadius: tokens.radius.sm,
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.white,
    color: tokens.colors.slate[900],
  },
} as const
