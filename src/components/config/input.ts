import { tokens } from '../../config/tokens'

export const inputConfig = {
  fieldStyle: {
    borderRadius: tokens.radius.sm,
    borderColor: tokens.colors.slate[300],
    backgroundColor: tokens.colors.white,
    color: tokens.colors.slate[900],
  },
  focusRingColor: tokens.colors.slate[900],
  errorStyle: {
    borderColor: tokens.colors.danger.base,
  },
  labelColor: tokens.colors.slate[600],
  errorColor: tokens.colors.danger.base,
  placeholderColor: tokens.colors.slate[400],
} as const
