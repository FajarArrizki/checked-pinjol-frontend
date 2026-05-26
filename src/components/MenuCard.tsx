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
      // GABUNGAN: Menggunakan min-h-[210px] dari kode kedua agar kartu lebih tinggi
      // Ditambah overflow-hidden agar warna header mentok tapi tetap mengikuti radius kartu
      className="group relative flex min-h-[210px] w-full flex-col overflow-hidden text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border"
      style={{
        borderRadius: tokens.radius.lg,
        borderColor: tokens.colors.slate[200], // Menggunakan slate 200 agar garis batas lebih jelas
        backgroundColor: 'white',
        boxShadow: tokens.shadow.sm,
      }}
    >
      {/* BAGIAN ATAS: Banner Warna (Layout dari kode 1) tapi sedikit dinaikkan tingginya menjadi h-20 */}
      <div 
        className="flex h-20 w-full shrink-0 items-center justify-center transition-colors duration-300 relative"
        style={{
          backgroundColor: theme.iconBg,
          color: theme.icon,
        }}
      >
        {/* Ikon di tengah banner (ukurannya dinaikkan sedikit ke h-10 w-10 karena banner lebih tinggi) */}
        <div className="flex h-10 w-10 items-center justify-center transition-transform duration-500 group-hover:scale-110 [&>svg]:h-full [&>svg]:w-full">
          {icon}
        </div>
        
        {/* Panah Hover (Layout dari kode 1) disesuaikan posisinya */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 hidden md:block">
          <svg className="h-6 w-6" style={{ color: theme.icon }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
          </svg>
        </span>
      </div>
      
      {/* BAGIAN BAWAH: Teks dan Deskripsi (Aksesibilitas dari kode 2) */}
      <div className="flex flex-1 flex-col items-center justify-center p-6">
        {/* AKSESIBILITAS: Judul menu text-xl */}
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        {description && (
          // AKSESIBILITAS: Deskripsi text-sm dan warna slate-600 (dipertajam sedikit dari slate-500)
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 line-clamp-2 px-2">
            {description}
          </p>
        )}
      </div>
    </button>
  )
}