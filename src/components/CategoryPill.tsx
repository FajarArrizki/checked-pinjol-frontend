import type { ReactNode } from 'react'

import { categoryPillStyles } from './config/category-pill'
import { tokens } from '../config/tokens'

type CategoryPillProps = {
  active?: boolean
  children: ReactNode
}

export function CategoryPill({ active = false, children }: CategoryPillProps) {
  const styles = active ? categoryPillStyles.active : categoryPillStyles.inactive

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium',
      ].join(' ')}
      style={{
        borderRadius: tokens.radius.full,
        ...styles,
      }}
    >
      {children}
    </span>
  )
}
