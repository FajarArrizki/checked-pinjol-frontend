import type { ReactNode } from 'react'
import { tokens } from '../config/tokens'

type SectionCardProps = {
  title: string
  children: ReactNode
  className?: string
}

export function SectionCard({ title, children, className = '' }: SectionCardProps) {
  return (
    <div
      className={`p-6 border rounded-xl ${className}`}
      style={{ borderColor: tokens.colors.slate[200] }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: tokens.colors.slate[800] }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
