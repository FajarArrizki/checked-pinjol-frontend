type PhotoUploadCardProps = {
  description: string
}

export function PhotoUploadCard({ description }: PhotoUploadCardProps) {
  return (
    <button
      type="button"
      className="flex min-h-48 w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm transition-colors hover:bg-slate-50"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16V8m0 0-3 3m3-3 3 3M4.75 15.75v1.5A1.75 1.75 0 0 0 6.5 19h11a1.75 1.75 0 0 0 1.75-1.75v-1.5"
          />
        </svg>
      </span>

      <p className="max-w-xs text-sm leading-6 text-slate-500">{description}</p>
    </button>
  )
}
