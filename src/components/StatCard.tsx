import type { ReactNode } from 'react'

import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type StatCardProps = {
  label: string
  value: string | number
  icon: ReactNode
  description?: string
  descriptionHighlight?: string
  className?: string
}

export function StatCard({
  label,
  value,
  icon,
  description,
  descriptionHighlight,
  className = '',
}: StatCardProps) {
  return (
    <div className={`flex flex-col gap-3 p-5 ${className}`} style={{ ...surfaceConfig.card }}>
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: tokens.colors.slate[500] }}>{label}</span>
        <span style={{ color: tokens.colors.slate[400] }}>{icon}</span>
      </div>
      <span className="text-3xl font-semibold" style={{ color: tokens.colors.slate[900] }}>{value}</span>
      {description && (
        <p className="text-xs" style={{ color: tokens.colors.slate[400] }}>
          {descriptionHighlight && (
            <span className="font-medium" style={{ color: tokens.colors.brand.primary }}>{descriptionHighlight} </span>
          )}
          {description}
        </p>
      )}
    </div>
  )
}
