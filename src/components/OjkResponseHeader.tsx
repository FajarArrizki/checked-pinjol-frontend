import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type OjkResponseHeaderProps = {
  name: string
  respondedAt: string
  imageUrl?: string
}

export function OjkResponseHeader({ name, respondedAt, imageUrl }: OjkResponseHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full"
        style={{
          ...surfaceConfig.softBadge,
          borderRadius: tokens.radius.full,
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.125a7.5 7.5 0 0 1 15 0"
            />
          </svg>
        )}
      </span>

      <div>
        <p className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{name}</p>
        <p className="mt-1 text-sm" style={{ color: tokens.colors.slate[500] }}>{respondedAt}</p>
      </div>
    </div>
  )
}
