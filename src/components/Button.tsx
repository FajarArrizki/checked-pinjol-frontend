import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import { buttonVariantClasses, buttonVariantStyles, type ButtonVariant } from './config/button'
import { tokens } from '../config/tokens'

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: ButtonVariant
}

export function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition-colors ${buttonVariantClasses[variant]} ${className}`.trim()}
      style={{
        borderRadius: tokens.radius.sm,
        ...buttonVariantStyles[variant],
      }}
      {...props}
    >
      {children}
    </button>
  )
}
