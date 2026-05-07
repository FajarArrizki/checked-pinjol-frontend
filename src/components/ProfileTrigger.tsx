import { useState } from 'react'

import { profileTriggerConfig } from './config/profile-trigger'
import { tokens } from '../config/tokens'

type ProfileTriggerProps = {
  username: string
  onLogout?: () => void
}

export function ProfileTrigger({ username, onLogout }: ProfileTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-11 items-center gap-3 border bg-white px-3 py-2 text-left shadow-sm transition-colors hover:bg-slate-50"
        style={{
          ...profileTriggerConfig.button,
        }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            ...profileTriggerConfig.avatar,
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.125a7.5 7.5 0 0 1 15 0"
            />
          </svg>
        </span>

        <span className="text-sm font-medium" style={{ color: tokens.colors.slate[900] }}>{username}</span>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          style={{ color: tokens.colors.slate[500] }}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute right-0 mt-2 min-w-[160px] border bg-white p-2 shadow-sm"
          style={{
            borderRadius: tokens.radius.md,
            borderColor: tokens.colors.slate[200],
            boxShadow: tokens.shadow.sm,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onLogout?.()
            }}
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-slate-50"
            style={{ color: tokens.colors.slate[900] }}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  )
}
