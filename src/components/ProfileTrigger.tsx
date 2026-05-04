type ProfileTriggerProps = {
  username: string
}

export function ProfileTrigger({ username }: ProfileTriggerProps) {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-colors hover:bg-slate-50"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
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

      <span className="text-sm font-medium text-slate-900">{username}</span>

      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 text-slate-500"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}
