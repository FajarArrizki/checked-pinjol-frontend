import { paginationConfig } from './config/pagination'
import { tokens } from '../config/tokens'

type PaginationBarProps = {
  showingCount: number
  totalCount: number
  itemLabel?: string
  currentPage: number
  totalPages: number
  pageSize: number
  pageSizeOptions: number[]
}

export function PaginationBar({
  showingCount,
  totalCount,
  itemLabel = 'articles',
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
}: PaginationBarProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4" style={{ ...paginationConfig.container }}>
      <p className="text-sm" style={{ color: tokens.colors.slate[500] }}>
        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center transition-colors hover:bg-slate-50"
          style={{ ...paginationConfig.control }}
          aria-label="Previous page"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M11.78 4.22a.75.75 0 0 1 0 1.06L7.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {pages.map((page) => {
          const isActive = page === currentPage

          return (
            <button
              key={page}
              type="button"
              className={[
                'inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm font-medium transition-colors hover:bg-slate-50',
              ].join(' ')}
              style={isActive ? paginationConfig.activePage : paginationConfig.inactivePage}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center transition-colors hover:bg-slate-50"
          style={{ ...paginationConfig.control }}
          aria-label="Next page"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M8.22 4.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L12.94 10 8.22 5.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm" style={{ color: tokens.colors.slate[500] }}>
        <select
          defaultValue={pageSize}
          className="min-h-10 px-3 text-sm font-medium outline-none"
          style={{ ...paginationConfig.select }}
        >
          {pageSizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
