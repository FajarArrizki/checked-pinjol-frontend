import type { ReactNode } from 'react'

import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type TableColumn = {
  key: string
  label: string
}

type TableListProps = {
  title: string
  description?: string
  columns: TableColumn[]
  children?: ReactNode
}

export function TableList({ title, description, columns, children }: TableListProps) {
  return (
    <section className="bg-white p-6" style={{ ...surfaceConfig.card }}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: tokens.colors.slate[900] }}>{title}</h2>
          {description ? <p className="mt-1 text-sm" style={{ color: tokens.colors.slate[600] }}>{description}</p> : null}
        </div>
      </div>

      <div className="overflow-x-auto border" style={{ ...surfaceConfig.subtle }}>
        <table className="min-w-full border-collapse">
          <thead style={{ backgroundColor: tokens.colors.slate[50] }}>
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
    </section>
  )
}
