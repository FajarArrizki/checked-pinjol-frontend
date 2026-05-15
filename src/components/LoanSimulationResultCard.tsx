import { tokens } from '../config/tokens'

type LoanSimulationResultCardProps = {
  monthlyInstallment?: string
  totalPayment?: string
  monthlyInterest?: string
  apr?: string
  principal?: string
  interestLabel?: string
  interestAmount?: string
  adminFee?: string
  total?: string
}

export function LoanSimulationResultCard({
  monthlyInstallment,
  totalPayment,
  monthlyInterest,
  apr,
  principal,
  interestLabel,
  interestAmount,
  adminFee,
  total,
}: LoanSimulationResultCardProps) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden border bg-white shadow-sm"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[200],
        boxShadow: tokens.shadow.sm,
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4"
        style={{
          backgroundColor: tokens.colors.brand.primary,
        }}
      >
        <h3 className="text-lg font-bold text-white">Hasil Perhitungan</h3>
      </div>

      <div className="flex flex-1 flex-col divide-y divide-slate-100">
        {/* Main Result */}
        <div className="p-6">
          <p className="text-sm font-medium" style={{ color: tokens.colors.slate[500] }}>
            Cicilan per Bulan
          </p>
          <p className="mt-1 text-4xl font-bold" style={{ color: tokens.colors.slate[900] }}>
            {monthlyInstallment ?? '-'}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t pt-6" style={{ borderColor: tokens.colors.slate[100] }}>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: tokens.colors.slate[400] }}>
                Total Bayar
              </p>
              <p className="mt-1 text-sm font-bold" style={{ color: tokens.colors.slate[900] }}>
                {totalPayment ?? '-'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: tokens.colors.slate[400] }}>
                Bunga (Bulanan)
              </p>
              <p className="mt-1 text-sm font-bold" style={{ color: tokens.colors.slate[900] }}>
                {monthlyInterest ?? '-'}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: tokens.colors.slate[400] }}>
                APR (Tahunan)
              </p>
              <p className="mt-1 text-sm font-bold" style={{ color: tokens.colors.slate[900] }}>
                {apr ?? '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Breakdown Section */}
        <div className="bg-slate-50/50 p-6">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest" style={{ color: tokens.colors.slate[400] }}>
            Rincian Biaya
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: tokens.colors.slate[500] }}>Pinjaman Pokok</span>
              <span className="font-medium" style={{ color: tokens.colors.slate[900] }}>{principal ?? '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: tokens.colors.slate[500] }}>{interestLabel ?? '-'}</span>
              <span className="font-medium" style={{ color: tokens.colors.slate[900] }}>{interestAmount ?? '-'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: tokens.colors.slate[500] }}>Biaya Admin</span>
              <span className="font-medium" style={{ color: tokens.colors.slate[900] }}>{adminFee ?? '-'}</span>
            </div>
            
            <div className="mt-4 flex justify-between border-t pt-4 text-base font-bold" style={{ borderColor: tokens.colors.slate[200] }}>
              <span style={{ color: tokens.colors.slate[900] }}>Total Rincian Biaya</span>
              <span style={{ color: tokens.colors.brand.primary }}>{total ?? '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
