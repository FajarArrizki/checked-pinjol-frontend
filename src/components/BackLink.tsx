import type { MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'

import { backLinkConfig } from './config/back-link'
import { tokens } from '../config/tokens'

type BackLinkProps = {
  toLabel: string
  to?: string
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

const baseClassName =
  'inline-flex items-center gap-3 border bg-white px-3 py-2 text-left shadow-sm transition-colors hover:bg-slate-50'

const iconClassName = 'flex h-9 w-9 items-center justify-center'

function BackContent({ toLabel }: Pick<BackLinkProps, 'toLabel'>) {
  return (
    <>
      <span
        className={iconClassName}
        style={{
          ...backLinkConfig.icon,
        }}
      >
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

      <span className="text-sm font-medium" style={{ color: tokens.colors.slate[900] }}>Kembali ke {toLabel}</span>
    </>
  )
}

export function BackLink({ toLabel, to, href, onClick }: BackLinkProps) {
  if (to) {
    return (
      <Link
        to={to}
        className={baseClassName}
        style={{
          ...backLinkConfig.button,
          borderRadius: tokens.radius.full,
        }}
      >
        <BackContent toLabel={toLabel} />
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={baseClassName}
        style={{
          ...backLinkConfig.button,
          borderRadius: tokens.radius.full,
        }}
      >
        <BackContent toLabel={toLabel} />
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClassName}
      style={{
        ...backLinkConfig.button,
        borderRadius: tokens.radius.full,
      }}
    >
      <BackContent toLabel={toLabel} />
    </button>
  )
}
