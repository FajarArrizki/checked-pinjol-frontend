import { StatusPill } from './StatusPill'
import type { StatusPillValue } from './config/status-pill'
import { tokens } from '../config/tokens'

type ReportCardProps = {
  appName: string
  description: string
  status: StatusPillValue
  date: string
  onClick?: () => void
  className?: string
}

export function ReportCard({
  appName,
  description,
  status,
  date,
  onClick,
  className = '',
}: ReportCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col gap-4 cursor-pointer border p-6
        transition-all duration-200 hover:bg-slate-50 hover:shadow-md
        ${className}
      `.trim()}
      style={{
        borderRadius: tokens.radius.md,
        borderColor: tokens.colors.slate[200],
        backgroundColor: tokens.colors.white,
      }}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{appName}</h3>
        <p className="text-sm line-clamp-1" style={{ color: tokens.colors.slate[500] }}>{description}</p>
      </div>
      <div className="border-t pt-3" style={{ borderColor: tokens.colors.slate[200] }}>
        <div className="flex flex-col gap-3">
          <StatusPill status={status} />
          <span className="text-xs" style={{ color: tokens.colors.slate[400] }}>{date}</span>
        </div>
      </div>
    </div>
  )
}
