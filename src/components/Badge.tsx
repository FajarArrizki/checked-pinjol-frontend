import type { ReactNode } from 'react'
import { tokens } from '../config/tokens'

type BadgeProps = {
  children: ReactNode
  variant?: 'default' | 'dashed'
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function Badge({ children, variant = 'default', selected, onClick, className = '' }: BadgeProps) {
  const isDashed = variant === 'dashed'
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium
        ${isDashed ? 'border border-dashed text-slate-400 hover:bg-slate-50' : 'text-slate-600'}
        ${selected ? 'border-[#A7F3D0] bg-[#E1F5EE] text-slate-900' : 'border bg-slate-50'}
        ${className}
      `.trim()}
      style={{
        borderColor: selected ? '#A7F3D0' : (isDashed ? tokens.colors.slate[300] : tokens.colors.slate[200])
      }}
    >
      {children}
    </Component>
  )
}
