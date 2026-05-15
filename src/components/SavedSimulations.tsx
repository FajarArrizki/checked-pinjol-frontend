import { useState } from 'react'
import { tokens } from '../config/tokens'

export type SavedSimulationItem = {
  id: string
  loanAmount: string
  tenor: string
  dailyInterest: string
  adminFee: string
  totalPayment: string
  date: string
}

type SavedSimulationsProps = {
  simulations: SavedSimulationItem[]
  onReload: (item: SavedSimulationItem) => void
}

export function SavedSimulations({ simulations, onReload }: SavedSimulationsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (simulations.length === 0) {
    return (
      <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
        <p className="text-xs font-medium text-slate-400">Belum ada simulasi yang disimpan</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-5 py-3.5 text-sm transition-all duration-300 group"
        style={{
          borderRadius: tokens.radius.lg,
          border: `1px solid ${tokens.colors.slate[200]}`,
          backgroundColor: tokens.colors.slate[50],
          color: tokens.colors.slate[700]
        }}
      >
        <span className="font-semibold tracking-tight">Lihat {simulations.length} Riwayat Tersimpan</span>
        <div className={`p-1 rounded-full transition-all duration-300 ${isOpen ? 'bg-slate-200/50 rotate-180' : 'bg-transparent'}`}>
          <svg
            className="h-4 w-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {simulations.map((item) => (
            <div
              key={item.id}
                className="flex items-center justify-between gap-4 p-4 transition-all hover:shadow-md"
                style={{
                  borderRadius: tokens.radius.lg,
                  border: `1px solid ${tokens.colors.slate[100]}`,
                  backgroundColor: 'white',
                  boxShadow: tokens.shadow.sm
                }}
            >
              <div className="flex flex-1 items-center gap-6 sm:gap-8 overflow-hidden">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pinjaman</span>
                  <span className="text-sm font-bold text-slate-900 truncate">
                    Rp {Number(item.loanAmount).toLocaleString('id-ID')}
                  </span>
                </div>
                
                <div className="h-8 w-px bg-slate-100 hidden sm:block" />

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tenor</span>
                  <span className="text-sm font-bold text-slate-900 whitespace-nowrap">{item.tenor} Hari</span>
                </div>

                <div className="h-8 w-px bg-slate-100 hidden sm:block" />

                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
                  <span className="text-sm font-extrabold" style={{ color: tokens.colors.success.base }}>
                    {item.totalPayment}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onReload(item)}
                className="shrink-0 px-4 py-2 text-xs font-bold transition-all active:scale-95"
                style={{
                  color: tokens.colors.slate[900],
                  borderRadius: tokens.radius.lg
                }}
              >
                Ulang
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
