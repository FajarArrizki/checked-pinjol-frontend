import type { ReactNode } from 'react'

type CategoryPillProps = {
  active?: boolean
  children: ReactNode
}

export function CategoryPill({ active = false, children }: CategoryPillProps) {
  const className = active
    ? 'border-[#E2E8F0] bg-[#1AA86E] text-[#FFFFFF]'
    : 'border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B]'

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
