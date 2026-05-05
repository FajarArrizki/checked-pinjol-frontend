import type { ReactNode } from 'react'

type MenuCardProps = {
  title: string
  icon: ReactNode
}

export function MenuCard({ title, icon }: MenuCardProps) {
  return (
    <button
      type="button"
      className="flex min-h-36 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-colors hover:bg-slate-50"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        {icon}
      </span>
      <span className="text-sm font-semibold text-slate-900">{title}</span>
    </button>
  )
}
