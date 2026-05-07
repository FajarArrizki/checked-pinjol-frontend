import { tokens } from '../../config/tokens'

export const inputConfig = {
  fieldStyle: {
    borderRadius: tokens.radius.md,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: tokens.colors.slate[200],
    backgroundColor: tokens.colors.slate[50],
    color: tokens.colors.slate[900],
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  focusRingColor: tokens.colors.slate[900],
  errorStyle: {
    borderColor: tokens.colors.danger.base,
  },
  labelColor: tokens.colors.slate[600],
  errorColor: tokens.colors.danger.base,
  placeholderColor: tokens.colors.slate[400],
} as const
