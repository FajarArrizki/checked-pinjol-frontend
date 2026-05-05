import { StatusPill } from './StatusPill'

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
        rounded-2xl border border-slate-200 bg-white p-5
        flex flex-col gap-3 cursor-pointer
        hover:border-slate-300 hover:shadow-sm transition-all
        ${className}
      `.trim()}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-900">{appName}</h3>
        <p className="text-sm text-slate-500 line-clamp-1">{description}</p>
      </div>
      <StatusPill status={status} />
      <span className="text-xs text-slate-400">{date}</span>
    </div>
  )
}