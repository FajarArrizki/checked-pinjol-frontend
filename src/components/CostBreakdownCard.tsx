import { tokens } from '../config/tokens'

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
    <div
      className="border bg-white p-5 shadow-sm"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[200],
        boxShadow: tokens.shadow.sm,
      }}
    >
      <div className="flex items-center justify-between gap-4 border-b pb-4" style={{ borderColor: tokens.colors.slate[200] }}>
        <h3 className="text-lg font-semibold" style={{ color: tokens.colors.slate[900] }}>Rincian Biaya</h3>
        <span className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>Total</span>
      </div>

      <div className="space-y-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <span className="text-sm" style={{ color: tokens.colors.slate[600] }}>Pinjaman Pokok</span>
          <span className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{principal}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-sm" style={{ color: tokens.colors.slate[600] }}>{interestLabel}</span>
          <span className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{interestAmount}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <span className="text-sm" style={{ color: tokens.colors.slate[600] }}>Biaya Admin</span>
          <span className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{adminFee}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t pt-4" style={{ borderColor: tokens.colors.slate[200] }}>
        <span className="text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>Total Rincian Biaya</span>
        <span className="text-base font-bold" style={{ color: tokens.colors.slate[900] }}>{total}</span>
      </div>
    </div>
  )
}
