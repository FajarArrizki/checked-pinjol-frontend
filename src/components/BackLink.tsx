import type { MouseEventHandler } from 'react'

type BackLinkProps = {
  toLabel: string
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

const baseClassName =
  'inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-colors hover:bg-slate-50'

const iconClassName = 'flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600'

function BackContent({ toLabel }: Pick<BackLinkProps, 'toLabel'>) {
  return (
    <>
      <span className={iconClassName}>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </span>

      <span className="text-sm font-medium text-slate-900">Kembali ke {toLabel}</span>
    </>
  )
}

export function BackLink({ toLabel, href, onClick }: BackLinkProps) {
  if (href) {
    return (
      <a href={href} onClick={onClick} className={baseClassName}>
        <BackContent toLabel={toLabel} />
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className={baseClassName}>
      <BackContent toLabel={toLabel} />
    </button>
  )
}
