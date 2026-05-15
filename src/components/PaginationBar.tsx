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
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function PaginationBar({
  showingCount,
  totalCount,
  itemLabel = 'articles',
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
}: PaginationBarProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)
  void showingCount

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4" style={{ ...paginationConfig.container }}>
      <p className="text-sm" style={{ color: tokens.colors.slate[500] }}>
        Showing {startItem} to {endItem} of {totalCount} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center transition-colors hover:bg-slate-50"
          style={{ ...paginationConfig.control }}
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
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
              onClick={() => onPageChange?.(page)}
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
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
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
        <div className="relative">
          <select
            defaultValue={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="min-h-10 appearance-none px-3 pr-8 text-sm font-medium outline-none"
            style={{ ...paginationConfig.select }}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
