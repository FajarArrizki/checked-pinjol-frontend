import { tokens } from '../../config/tokens'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white hover:opacity-90',
  secondary: 'border bg-white hover:bg-slate-50',
  danger: 'text-white hover:opacity-90',
}

export const buttonVariantStyles: Record<ButtonVariant, Record<string, string>> = {
  primary: {
    backgroundColor: tokens.colors.slate[900],
    color: tokens.colors.white,
  },
  secondary: {
    borderColor: tokens.colors.slate[300],
    backgroundColor: tokens.colors.white,
    color: tokens.colors.slate[900],
  },
  danger: {
    backgroundColor: tokens.colors.danger.base,
    color: tokens.colors.white,
  },
}
