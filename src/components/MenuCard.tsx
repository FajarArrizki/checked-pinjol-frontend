import type { ReactNode } from 'react'

import { tokens } from '../config/tokens'

type MenuCardProps = {
  title: string
  icon: ReactNode
  onClick?: () => void
}

export function MenuCard({ title, icon, onClick }: MenuCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-36 w-full flex-col items-center justify-center gap-4 border bg-white p-5 text-center transition-colors hover:bg-slate-50"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[200],
        boxShadow: tokens.shadow.sm,
      }}
    >
      <span
        className="flex h-14 w-14 items-center justify-center text-slate-700"
        style={{
          borderRadius: tokens.radius.lg,
          backgroundColor: tokens.colors.slate[100],
          color: tokens.colors.slate[700],
        }}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{title}</span>
    </button>
  )
}
