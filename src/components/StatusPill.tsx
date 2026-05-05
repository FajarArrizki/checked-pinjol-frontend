import { statusPillConfig, type StatusPillValue } from './config/status-pill'
import { tokens } from '../config/tokens'

type StatusPillProps = {
  status: StatusPillValue
}

export function StatusPill({ status }: StatusPillProps) {
  const config = statusPillConfig[status]

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium',
      ].join(' ')}
      style={{
        borderRadius: tokens.radius.full,
        ...config.style,
      }}
    >
      {config.label}
    </span>
  )
}
