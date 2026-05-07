import { tokens } from '../../config/tokens'

export type ButtonVariant = 'primary' | 'secondary' | 'danger'

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: 'text-white hover:opacity-90',
  secondary: 'border hover:opacity-90',
  danger: 'text-white hover:opacity-90',
}

export const buttonVariantStyles: Record<ButtonVariant, Record<string, string>> = {
  primary: {
    backgroundColor: tokens.colors.brand.primary,
    color: tokens.colors.white,
  },
  secondary: {
    borderColor: tokens.colors.brand.primary,
    backgroundColor: tokens.colors.brand.soft,
    color: tokens.colors.brand.primary,
  },
  danger: {
    backgroundColor: tokens.colors.danger.base,
    color: tokens.colors.white,
  },
}
