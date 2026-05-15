import { useMemo, useState } from 'react'

import {
  AppNavbar,
  BackLink,
  Button,
  Input,
  PageHeaderCard,
  RiskLevelIndicator,
  LoanSimulationResultCard,
  SavedSimulations,
  type SavedSimulationItem,
} from '../components'
import { tokens } from '../config/tokens'
import { apiConfig } from '../config/api'
import { paths } from '../router/paths'
import { useLogoutRedirect } from '../auth/useLogoutRedirect'
import { useAuth } from '../auth/AuthContext'

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
  const [isAgreed, setIsAgreed] = useState(false)
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulationItem[]>([])
  const [result, setResult] = useState<null | {
    monthlyInstallment: string
    totalPayment: string
    monthlyInterest: string
    apr: string
    principal: string
    interestLabel: string
    interestAmount: string
    adminFee: string
    total: string
  }>(null)
  const [loading, setLoading] = useState(false)
  const handleLogout = useLogoutRedirect()
  const { token } = useAuth()

  const calculation = useMemo(() => {
    const principal = Number(loanAmount) || 0
    const tenorDays = Number(tenor) || 0
    const interestRate = Number(dailyInterest) || 0
    const admin = Number(adminFee) || 0

    const interestAmount = principal * (interestRate / 100) * tenorDays
    const totalPayment = principal + interestAmount + admin
    const monthlyInstallment = totalPayment
    const apr = interestRate * 365

    const monthlyInterestRate = interestRate * 30

    return {
      principal,
      interestAmount,
      admin,
      totalPayment,
      monthlyInstallment,
      apr,
      monthlyInterestRate,
    }
  }, [loanAmount, tenor, dailyInterest, adminFee])

  const handleSaveSimulation = () => {
    const newItem: SavedSimulationItem = {
      id: Date.now().toString(),
      loanAmount,
      tenor,
      dailyInterest,
      adminFee,
      totalPayment: formatCurrency(calculation.totalPayment),
      date: new Date().toLocaleDateString('id-ID'),
    }

    setSavedSimulations((prev) => [newItem, ...prev].slice(0, 5))
    alert('Simulasi berhasil disimpan!')
  }

  const handleSaveToBackend = async () => {
    await fetch(`${apiConfig.baseUrl}/api/simulasi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        jumlah_pinjaman: Number(loanAmount),
        tenor_hari: Number(tenor),
        bunga_per_hari: Number(dailyInterest),
        biaya_admin: Number(adminFee),
      }),
    })
  }

  const handleSimulate = async () => {
    setLoading(true)

    try {
      const response = await fetch(`${apiConfig.baseUrl}/api/simulasi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          jumlah_pinjaman: Number(loanAmount),
          tenor_hari: Number(tenor),
          bunga_per_hari: Number(dailyInterest),
          biaya_admin: Number(adminFee),
        }),
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json?.message ?? 'Gagal menghitung simulasi')
      }

      const data = json.data
      setResult({
        monthlyInstallment: formatCurrency(Number(data.cicilan_per_bulan)),
        totalPayment: formatCurrency(Number(data.total_bayar)),
        monthlyInterest: `${(Number(dailyInterest) * 30).toFixed(1)}%`,
        apr: `${Number(data.apr_tahunan).toFixed(1)}%`,
        principal: formatCurrency(Number(data.jumlah_pinjaman)),
        interestLabel: `Bunga (${dailyInterest}% x ${tenor} hari)`,
        interestAmount: formatCurrency(Number(data.total_bunga)),
        adminFee: formatCurrency(Number(data.biaya_admin)),
        total: formatCurrency(Number(data.total_bayar)),
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReloadSimulation = (item: SavedSimulationItem) => {
    setLoanAmount(item.loanAmount)
    setTenor(item.tenor)
    setDailyInterest(item.dailyInterest)
    setAdminFee(item.adminFee)
    setIsAgreed(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={handleLogout} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <PageHeaderCard
          back={<BackLink toLabel="Homepage" to={paths.home} />}
          title="Simulasi Pinjaman"
          description="Masukkan detail pinjaman untuk melihat estimasi cicilan, total pembayaran, dan rincian biaya secara lebih jelas."
        />

        <section className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div
            className="flex h-full flex-col space-y-5 border bg-white p-6 shadow-sm"
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
              <div className="relative">
                <select
                  value={tenor}
                  onChange={(event) => setTenor(event.target.value)}
                  className="w-full appearance-none px-4 pr-10 py-3 text-sm transition-all duration-200 outline-none hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#1AA86E] focus:border-transparent focus:shadow-sm"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
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

            <RiskLevelIndicator dailyInterest={Number(dailyInterest)} />

            <div className="flex flex-col gap-4 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1AA86E] focus:ring-[#1AA86E]"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                />
                <span className="text-sm leading-tight text-slate-600">
                  Saya setuju bahwa ini cuman simulasi bukan real
                </span>
              </label>

              <Button className="w-full py-3 font-semibold" disabled={!isAgreed || loading} onClick={async () => { await handleSimulate(); await handleSaveToBackend() }}>
                {loading ? 'Menghitung...' : 'Simulasikan Sekarang'}
              </Button>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Simulasi Tersimpan
                </label>
                <button 
                  onClick={handleSaveSimulation}
                  className="text-xs font-semibold text-brand-primary hover:underline"
                >
                  + Simpan Sekarang
                </button>
              </div>
              
              <SavedSimulations simulations={savedSimulations} onReload={handleReloadSimulation} />
            </div>
          </div>

          <div className="h-full">
            <LoanSimulationResultCard {...result ?? {}} />
          </div>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary">Bagikan</Button>
        </div>
      </main>
    </div>
  )
}
