import type { ReactNode } from 'react'
import { tokens } from '../config/tokens'

type MenuCardProps = {
  title: string
  description?: string
  icon: ReactNode
  onClick?: () => void
  colorTheme?: {
    bg: string
    icon: string
    iconBg: string
  }
}

export function MenuCard({ title, description, icon, onClick, colorTheme }: MenuCardProps) {
  const theme = colorTheme || {
    bg: 'white',
    icon: tokens.colors.slate[700],
    iconBg: tokens.colors.slate[100],
  }

  return (
    <button
      type="button"
      onClick={onClick}
      // AKSESIBILITAS: min-h dinaikkan dari [180px] ke [210px] agar ruang kartu longgar & tidak berdesakan setelah font membesar
      className="group relative flex min-h-[210px] w-full flex-col items-center justify-center border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[100],
        backgroundColor: 'white',
        boxShadow: tokens.shadow.sm,
      }}
    >
      {/* Kotak warna ikon tetap proporsional di tengah */}
      <div
        className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center transition-transform duration-500 group-hover:scale-110"
        style={{
          borderRadius: tokens.radius.md,
          backgroundColor: theme.iconBg,
          color: theme.icon,
        }}
      >
        <div className="flex h-8 w-8 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
          {icon}
        </div>
      </div>

      {/* Panah Hover */}
      <span className="absolute right-5 top-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
        <svg className="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </span>
      
      <div>
        {/* AKSESIBILITAS: Judul menu naik dari text-base ke text-xl */}
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {description && (
          // AKSESIBILITAS: Deskripsi naik dari text-xs ke text-sm.
          // Warna abu-abunya diganti dari text-slate-400 ke text-slate-500 agar lebih kontras dan mudah dibaca
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </button>
  )
}