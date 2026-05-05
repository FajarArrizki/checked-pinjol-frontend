import { tokens } from '../config/tokens'

type CalculationResultCardProps = {
  monthlyInstallment: string
  totalPayment: string
  apr: string
}

export function CalculationResultCard({
  monthlyInstallment,
  totalPayment,
  apr,
}: CalculationResultCardProps) {
  return (
    <div
      className="overflow-hidden border bg-white shadow-sm"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[200],
        boxShadow: tokens.shadow.sm,
      }}
    >
      <div
        className="px-5 py-4 text-white"
        style={{
          backgroundColor: tokens.colors.brand.primary,
          color: tokens.colors.white,
        }}
      >
        <h3 className="text-lg font-semibold">Hasil Perhitungan</h3>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-sm" style={{ color: tokens.colors.slate[500] }}>Cicilan per Bulan</p>
          <p className="mt-2 text-3xl font-bold" style={{ color: tokens.colors.slate[900] }}>{monthlyInstallment}</p>
        </div>

        <div className="grid gap-4 border-t pt-4 sm:grid-cols-2" style={{ borderColor: tokens.colors.slate[200] }}>
          <div className="flex items-start justify-between gap-4 sm:block">
            <p className="text-sm" style={{ color: tokens.colors.slate[500] }}>Total Bayar</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{totalPayment}</p>
          </div>

          <div className="flex items-start justify-between gap-4 sm:block">
            <p className="text-sm" style={{ color: tokens.colors.slate[500] }}>APR (Tahunan)</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: tokens.colors.slate[900] }}>{apr}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
