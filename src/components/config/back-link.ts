import { tokens } from '../../config/tokens'

export const backLinkConfig = {
  button: {
    borderRadius: tokens.radius.full,
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.white,
    boxShadow: tokens.shadow.sm,
  },
  icon: {
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.slate[100],
    color: tokens.colors.slate[600],
  },
} as const
