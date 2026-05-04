type StatusPillValue = 'process' | 'selesai' | 'terminate'

type StatusPillProps = {
  status: StatusPillValue
}

const statusStyles: Record<StatusPillValue, string> = {
  process: 'border-[#1AA86E] bg-[#E7FFF5] text-[#475569]',
  selesai: 'border-[#64748B] bg-[#E2E8F0] text-[#64748B]',
  terminate: 'border-[#DC2626] bg-[#FEE2E2] text-[#B91C1C]',
}

const statusLabels: Record<StatusPillValue, string> = {
  process: 'In Process',
  selesai: 'Selesai',
  terminate: 'Terminate',
}

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium',
        statusStyles[status],
      ].join(' ')}
    >
      {statusLabels[status]}
    </span>
  )
}
