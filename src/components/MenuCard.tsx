import type { ReactNode } from 'react'

import { tokens } from '../config/tokens'

type MenuCardProps = {
  title: string
  description?: string
  icon: ReactNode
  onClick?: () => void
  colorTheme?: {
    bg: string
    icon: string
    iconBg: string
  }
}

export function MenuCard({ title, description, icon, onClick, colorTheme }: MenuCardProps) {
  const theme = colorTheme || {
    bg: 'white',
    icon: tokens.colors.slate[700],
    iconBg: tokens.colors.slate[100],
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[160px] w-full flex-col items-start justify-between p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[100],
        backgroundColor: 'white',
        boxShadow: tokens.shadow.sm,
      }}
    >
      <div className="flex w-full items-start justify-between">
        <span
          className="flex h-14 w-14 items-center justify-center transition-transform duration-500 group-hover:scale-110"
          style={{
            borderRadius: tokens.radius.md,
            backgroundColor: theme.iconBg,
            color: theme.icon,
          }}
        >
          {icon}
        </span>
        <span className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          <svg className="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
      
      <div className="mt-4">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-1 text-xs font-medium text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </button>
  )
}
