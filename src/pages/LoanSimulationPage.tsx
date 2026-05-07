import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AppNavbar,
  BackLink,
  Button,
  CalculationResultCard,
  CostBreakdownCard,
  Input,
  PageHeaderCard,
} from '../components'
import { tokens } from '../config/tokens'
import { paths } from '../router/paths'

const tenorOptions = [7, 14, 21, 30, 60, 90]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function LoanSimulationPage() {
  const [loanAmount, setLoanAmount] = useState('1000000')
  const [tenor, setTenor] = useState('30')
  const [dailyInterest, setDailyInterest] = useState('0.8')
  const [adminFee, setAdminFee] = useState('25000')
  const navigate = useNavigate()

  const calculation = useMemo(() => {
    const principal = Number(loanAmount) || 0
    const tenorDays = Number(tenor) || 0
    const interestRate = Number(dailyInterest) || 0
    const admin = Number(adminFee) || 0

    const interestAmount = principal * (interestRate / 100) * tenorDays
    const totalPayment = principal + interestAmount + admin
    const monthlyInstallment = totalPayment
    const apr = interestRate * 365

    return {
      principal,
      interestAmount,
      admin,
      totalPayment,
      monthlyInstallment,
      apr,
    }
  }, [loanAmount, tenor, dailyInterest, adminFee])

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={() => navigate(paths.login)} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Homepage" to={paths.home} />}
          title="Simulasi Pinjaman"
          description="Masukkan detail pinjaman untuk melihat estimasi cicilan, total pembayaran, dan rincian biaya secara lebih jelas."
        />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div
            className="space-y-5 border bg-white p-6 shadow-sm"
            style={{
              borderRadius: tokens.radius.lg,
              borderColor: tokens.colors.slate[200],
              boxShadow: tokens.shadow.sm,
            }}
          >
            <Input
              label="Jumlah Pinjaman"
              inputMode="numeric"
              value={loanAmount}
              onChange={(event) => setLoanAmount(event.target.value)}
              placeholder="Masukkan jumlah pinjaman"
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
                Tenor (hari)
              </label>
              <select
                value={tenor}
                onChange={(event) => setTenor(event.target.value)}
                className="w-full px-4 py-3 text-sm transition-all duration-200 outline-none hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#1AA86E] focus:border-transparent focus:shadow-sm"
                style={{
                  borderRadius: tokens.radius.md,
                  border: `1px solid ${tokens.colors.slate[200]}`,
                  backgroundColor: tokens.colors.slate[50],
                  color: tokens.colors.slate[900],
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
                }}
              >
                {tenorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} hari
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Bunga per Hari (%)"
              inputMode="decimal"
              value={dailyInterest}
              onChange={(event) => setDailyInterest(event.target.value)}
              placeholder="Masukkan bunga per hari"
            />

            <Input
              label="Biaya Admin (Opsional)"
              inputMode="numeric"
              value={adminFee}
              onChange={(event) => setAdminFee(event.target.value)}
              placeholder="Masukkan biaya admin"
            />
          </div>

          <div className="space-y-4">
            <CalculationResultCard
              monthlyInstallment={formatCurrency(calculation.monthlyInstallment)}
              totalPayment={formatCurrency(calculation.totalPayment)}
              apr={`${calculation.apr.toFixed(1)}%`}
            />

            <CostBreakdownCard
              principal={formatCurrency(calculation.principal)}
              interestLabel={`Bunga (${dailyInterest}% x ${tenor} hari)`}
              interestAmount={formatCurrency(calculation.interestAmount)}
              adminFee={formatCurrency(calculation.admin)}
              total={formatCurrency(calculation.totalPayment)}
            />
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary">Bagikan</Button>
          <Button>Simpan Simulasi</Button>
        </div>
      </main>
    </div>
  )
}
