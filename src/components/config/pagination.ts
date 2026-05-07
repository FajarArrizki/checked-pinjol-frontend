import { tokens } from '../../config/tokens'

export const paginationConfig = {
  container: {
    backgroundColor: 'transparent',
  },
  control: {
    borderRadius: tokens.radius.sm,
    borderColor: tokens.colors.slate[200],
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: tokens.colors.white,
    color: tokens.colors.slate[600],
  },
  activePage: {
    borderRadius: tokens.radius.sm,
    borderColor: tokens.colors.brand.primary,
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: tokens.colors.brand.soft,
    color: tokens.colors.slate[900],
  },
  inactivePage: {
    borderRadius: tokens.radius.sm,
    borderColor: tokens.colors.slate[200],
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: tokens.colors.white,
    color: tokens.colors.slate[700],
  },
  select: {
    borderRadius: tokens.radius.sm,
    borderColor: tokens.colors.brand.primary,
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: tokens.colors.brand.soft,
    color: tokens.colors.slate[600],
  },
} as const
