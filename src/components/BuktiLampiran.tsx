import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type BuktiLampiranProps = {
  title: string
  size: string
  imageUrl?: string
}

export function BuktiLampiran({ title, size, imageUrl }: BuktiLampiranProps) {
  return (
    <div
      className="flex items-center gap-4 p-4"
      style={{
        ...surfaceConfig.card,
      }}
    >
      <span
        className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border"
        style={{
          ...surfaceConfig.subtle,
          backgroundColor: tokens.colors.slate[50],
          color: tokens.colors.slate[500],
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-7 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 7.5A2.25 2.25 0 0 1 6 5.25h12A2.25 2.25 0 0 1 20.25 7.5v9A2.25 2.25 0 0 1 18 18.75H6a2.25 2.25 0 0 1-2.25-2.25v-9Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 15 3.75-3.75 2.25 2.25 2.25-2.25L17.25 15" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75h.008v.008H8.25V9.75Z" />
          </svg>
        )}
      </span>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{title}</p>
        <p className="mt-1 text-sm" style={{ color: tokens.colors.slate[500] }}>{size}</p>
      </div>
    </div>
  )
}
