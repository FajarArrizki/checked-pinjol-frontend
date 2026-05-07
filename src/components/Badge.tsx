import type { ReactNode } from 'react'
import { tokens } from '../config/tokens'

type BadgeProps = {
  children: ReactNode
  variant?: 'default' | 'dashed'
  onClick?: () => void
  className?: string
}

export function Badge({ children, variant = 'default', onClick, className = '' }: BadgeProps) {
  const isDashed = variant === 'dashed'
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium
        ${isDashed ? 'border border-dashed text-slate-400 hover:bg-slate-50' : 'border bg-slate-50 text-slate-600'}
        ${className}
      `.trim()}
      style={{
        borderColor: isDashed ? tokens.colors.slate[300] : tokens.colors.slate[200]
      }}
    >
      {children}
    </Component>
  )
}
