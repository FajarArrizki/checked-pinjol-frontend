import type { ReactNode } from 'react'

import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type TableColumn = {
  key: string
  label: string
}

type TableListProps = {
  title?: string
  description?: string
  columns: TableColumn[]
  children?: ReactNode
  pagination?: ReactNode
  headerContent?: ReactNode
}

export function TableList({ title, description, columns, children, pagination, headerContent }: TableListProps) {
  return (
    <section className="flex flex-col h-full overflow-hidden">
      {headerContent && (
        <div className="mb-3 shrink-0">
          {headerContent}
        </div>
      )}
      
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[900] }}>{title}</h2>
            {description ? <p className="mt-1 text-sm" style={{ color: tokens.colors.slate[600] }}>{description}</p> : null}
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-auto border rounded-lg custom-scrollbar relative" style={{ ...surfaceConfig.subtle }}>
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 shadow-sm" style={{ backgroundColor: tokens.colors.slate[50] }}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-medium"
                  style={{ color: tokens.colors.slate[600] }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>{children}</tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="mt-4 shrink-0">
          {pagination}
        </div>
      )}
    </section>
  )
}
