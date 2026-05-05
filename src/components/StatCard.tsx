import type { ReactNode } from 'react'

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
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-slate-400">{icon}</span>
      </div>
      <span className="text-3xl font-semibold text-slate-900">{value}</span>
      {description && (
        <p className="text-xs text-slate-400">
          {descriptionHighlight && (
            <span className="text-[#1D9E75] font-medium">{descriptionHighlight} </span>
          )}
          {description}
        </p>
      )}
    </div>
  )
}