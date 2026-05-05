import { StatusPill } from './StatusPill'
import { surfaceConfig } from './config/surface'
import { tokens } from '../config/tokens'

type ReportStatus = 'process' | 'selesai' | 'terminate'  // ← sesuaikan ini

type ReportCardProps = {
  appName: string
  description: string
  status: ReportStatus
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
        flex flex-col gap-3 cursor-pointer
        transition-all hover:bg-slate-50
        ${className}
      `.trim()}
      style={{
        ...surfaceConfig.card,
      }}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{appName}</h3>
        <p className="text-sm line-clamp-1" style={{ color: tokens.colors.slate[500] }}>{description}</p>
      </div>
      <StatusPill status={status} />
      <span className="text-xs" style={{ color: tokens.colors.slate[400] }}>{date}</span>
    </div>
  )
}
