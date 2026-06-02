import { useMemo, useState } from 'react'

import {
  AppNavbar,
  BackLink,
  Button,
  Input,
  Modal,
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

function normalizeCurrencyInput(value: string) {
  return value.replace(/\D/g, '')
}

function formatCurrencyInput(value: string) {
  if (!value) return ''
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(Number(value))
}

function normalizeIntegerInput(value: string) {
  return value.replace(/\D/g, '')
}

function resolveTenorDays(tenorValue: string, tenorUnit: 'hari' | 'bulan') {
  const numericValue = Number(tenorValue) || 0
  return tenorUnit === 'bulan' ? numericValue * 30 : numericValue
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

const SIMULASI_STORAGE_KEY = 'checked-pinjol.simulasi'

function loadSavedSimulations(): SavedSimulationItem[] {
  try {
    const raw = localStorage.getItem(SIMULASI_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedSimulationItem[]
  } catch {
    return []
  }
}

function saveSimulationsToStorage(items: SavedSimulationItem[]) {
  localStorage.setItem(SIMULASI_STORAGE_KEY, JSON.stringify(items))
}

export function LoanSimulationPage() {
  const [loanAmount, setLoanAmount] = useState('')
  const [tenor, setTenor] = useState('30')
  const [tenorUnit, setTenorUnit] = useState<'hari' | 'bulan'>('hari')
  const [dailyInterest, setDailyInterest] = useState('')
  const [adminFee, setAdminFee] = useState('')
  const [isAgreed, setIsAgreed] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulationItem[]>(loadSavedSimulations)
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
  const [fieldErrors, setFieldErrors] = useState<{ loanAmount?: string; tenor?: string; dailyInterest?: string }>({})
  const handleLogout = useLogoutRedirect()
  const { token } = useAuth()
  const tenorDays = resolveTenorDays(tenor, tenorUnit)

  const calculation = useMemo(() => {
    const principal = Number(loanAmount) || 0
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
  }, [loanAmount, tenorDays, dailyInterest, adminFee])

  const handleSaveSimulation = () => {
    setFieldErrors({})
    if (!loanAmount || tenorDays <= 0) {
      setFieldErrors({ loanAmount: 'Jumlah pinjaman wajib diisi.' })
      return
    }
    if (!tenor || Number(tenor) <= 0) {
      setFieldErrors({ tenor: 'Tenor wajib diisi.' })
      return
    }

    const newItem: SavedSimulationItem = {
      id: Date.now().toString(),
      loanAmount,
      tenor,
      tenorUnit,
      dailyInterest,
      adminFee,
      totalPayment: formatCurrency(calculation.totalPayment),
      date: new Date().toLocaleDateString('id-ID'),
    }

    setSavedSimulations((prev) => {
      const next = [newItem, ...prev].slice(0, 5)
      saveSimulationsToStorage(next)
      return next
    })
    setIsSaveModalOpen(true)
  }

  const handleDeleteSimulation = (id: string) => {
    setSavedSimulations((prev) => {
      const next = prev.filter((item) => item.id !== id)
      saveSimulationsToStorage(next)
      return next
    })
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
        tenor_hari: tenorDays,
        bunga_per_hari: Number(dailyInterest),
        biaya_admin: Number(adminFee),
      }),
    })
  }

  const handleSimulate = async () => {
    setFieldErrors({})

    const next: typeof fieldErrors = {}
    if (!loanAmount || Number(loanAmount) <= 0) next.loanAmount = 'Jumlah pinjaman wajib diisi.'
    if (!tenor || Number(tenor) <= 0) next.tenor = 'Tenor wajib diisi.'
    if (!dailyInterest || Number(dailyInterest) <= 0) next.dailyInterest = 'Bunga per hari wajib diisi.'

    if (Object.keys(next).length > 0) {
      setFieldErrors(next)
      return
    }

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
          tenor_hari: tenorDays,
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
        interestLabel: `Bunga (${dailyInterest}% x ${tenorDays} hari)`,
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
    setTenorUnit(item.tenorUnit)
    setDailyInterest(item.dailyInterest)
    setAdminFee(item.adminFee)
    setIsAgreed(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar onLogout={handleLogout} />

      <main className="flex w-full flex-col gap-6 px-8 py-8">
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
              prefix="Rp"
              inputMode="numeric"
              value={formatCurrencyInput(loanAmount)}
              onChange={(event) => { setLoanAmount(normalizeCurrencyInput(event.target.value)); setFieldErrors((c) => ({ ...c, loanAmount: undefined })) }}
              placeholder="Masukkan jumlah pinjaman"
              error={fieldErrors.loanAmount}
            />
            <p className="-mt-3 text-xs text-slate-400">Masukkan jumlah pinjaman pokok yang ingin diajukan.</p>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" style={{ color: tokens.colors.slate[600] }}>
                Tenor
              </label>
              <div className="grid grid-cols-[minmax(0,1fr)_160px] gap-3">
                <Input
                  inputMode="numeric"
                  value={tenor}
                  onChange={(event) => { setTenor(normalizeIntegerInput(event.target.value)); setFieldErrors((c) => ({ ...c, tenor: undefined })) }}
                  placeholder="Masukkan tenor"
                  error={fieldErrors.tenor}
                />
                <div className="relative">
                  <select
                    value={tenorUnit}
                    onChange={(event) => setTenorUnit(event.target.value as 'hari' | 'bulan')}
                    className="w-full appearance-none px-4 pr-10 py-3 text-sm transition-all duration-200 outline-none hover:border-slate-300 focus:bg-white focus:ring-2 focus:ring-[#1AA86E] focus:border-transparent focus:shadow-sm"
                    style={{
                      borderRadius: tokens.radius.md,
                      border: `1px solid ${tokens.colors.slate[200]}`,
                      backgroundColor: tokens.colors.slate[50],
                      color: tokens.colors.slate[900],
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <option value="hari">Hari</option>
                    <option value="bulan">Bulan</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400">Jika memilih bulan, sistem otomatis menghitung 1 bulan = 30 hari.</p>
            </div>

            <Input
              label="Bunga per Hari (%)"
              inputMode="decimal"
              value={dailyInterest}
              onChange={(event) => { setDailyInterest(event.target.value); setFieldErrors((c) => ({ ...c, dailyInterest: undefined })) }}
              placeholder="Masukkan bunga per hari"
              error={fieldErrors.dailyInterest}
            />

            <Input
              label="Biaya Admin (Opsional)"
              prefix="Rp"
              inputMode="numeric"
              value={formatCurrencyInput(adminFee)}
              onChange={(event) => setAdminFee(normalizeCurrencyInput(event.target.value))}
              placeholder="Masukkan biaya admin"
            />
            <p className="-mt-3 text-xs text-slate-400">Biaya tambahan yang dikenakan admin pinjol (jika ada).</p>

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
              
              <SavedSimulations simulations={savedSimulations} onReload={handleReloadSimulation} onDelete={handleDeleteSimulation} />
            </div>
          </div>

          <div className="h-full">
            <LoanSimulationResultCard {...result ?? {}} />
          </div>
        </section>

      </main>

      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Simulasi Berhasil Disimpan"
        description="Riwayat simulasi berhasil ditambahkan dan bisa dibuka kembali dari daftar simulasi tersimpan."
      >
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              Simulasi untuk tenor {tenor} {tenorUnit} sudah berhasil disimpan.
            </p>
            <p className="text-xs text-slate-400">
              Kamu bisa membuka ulang dari bagian Simulasi Tersimpan kapan saja.
            </p>
          </div>

          <Button className="w-full" onClick={() => setIsSaveModalOpen(false)}>
            Selesai
          </Button>
        </div>
      </Modal>
    </div>
  )
}
