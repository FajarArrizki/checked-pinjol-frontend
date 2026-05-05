type CostBreakdownCardProps = {
  principal: string
  interestLabel: string
  interestAmount: string
  adminFee: string
  total: string
}

export function CostBreakdownCard({
  principal,
  interestLabel,
  interestAmount,
  adminFee,
  total,
}: CostBreakdownCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">Rincian Biaya</h3>
        <span className="text-sm font-medium text-slate-500">Total</span>
      </div>

      <div className="space-y-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <span className="text-sm text-slate-600">Pinjaman Pokok</span>
          <span className="text-sm font-semibold text-slate-900">{principal}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-sm text-slate-600">{interestLabel}</span>
          <span className="text-sm font-semibold text-slate-900">{interestAmount}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-sm text-slate-600">Biaya Admin</span>
          <span className="text-sm font-semibold text-slate-900">{adminFee}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
        <span className="text-sm font-semibold text-slate-900">Total Rincian Biaya</span>
        <span className="text-base font-bold text-slate-900">{total}</span>
      </div>
    </div>
  )
}
