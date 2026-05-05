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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-[#1AA86E] px-5 py-4 text-white">
        <h3 className="text-lg font-semibold">Hasil Perhitungan</h3>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-sm text-slate-500">Cicilan per Bulan</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{monthlyInstallment}</p>
        </div>

        <div className="grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
          <div className="flex items-start justify-between gap-4 sm:block">
            <p className="text-sm text-slate-500">Total Bayar</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{totalPayment}</p>
          </div>

          <div className="flex items-start justify-between gap-4 sm:block">
            <p className="text-sm text-slate-500">APR (Tahunan)</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{apr}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
