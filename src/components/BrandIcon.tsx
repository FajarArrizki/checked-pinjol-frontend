import { tokens } from '../config/tokens'

type BrandIconProps = {
  variant?: 'navbar' | 'logo'
}

export function BrandIcon({ variant = 'navbar' }: BrandIconProps) {
  if (variant === 'logo') {
    return (
      <div className="flex flex-col items-center gap-4">
        {/* Lingkaran besar */}
        <span
          className="flex h-24 w-24 items-center justify-center"
          style={{
            borderRadius: tokens.radius.full,
            backgroundColor: tokens.colors.brand.soft,
          }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="h-12 w-12"
            style={{ color: tokens.colors.brand.primary }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2.75c.18 0 .35.04.52.11l5.75 2.56c.27.12.44.38.44.67v4.36c0 3.95-2.33 7.55-5.95 9.19a1.51 1.51 0 0 1-1.24 0c-3.62-1.64-5.95-5.24-5.95-9.19V6.09c0-.29.17-.55.44-.67l5.75-2.56c.17-.07.34-.11.52-.11Z"
            />
          </svg>
        </span>
        {/* Teks Logo Utama */}
        <span
          className="text-3xl font-bold"
          style={{ color: tokens.colors.slate[900] }}
        >
          CekPinjol
        </span>
      </div>
    )
  }

  // variant === 'navbar' (default)
  return (
    <div className="inline-flex items-center gap-3">
      {/* Kotak Icon Navbar: Dibuat sedikit lebih tegas dengan ukuran h-12 w-12 */}
      <span
        className="flex h-12 w-12 items-center justify-center border"
        style={{
          borderRadius: tokens.radius.md, // Mengubah radius dari sm ke md agar sudut kotak terlihat lebih halus & modern
          borderColor: tokens.colors.brand.primary,
          backgroundColor: tokens.colors.brand.soft,
          color: tokens.colors.brand.primary,
        }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4" // Ketebalan garis ikon dinaikkan sedikit dari 2.2 ke 2.4 agar bentuk perisai lebih solid
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.75c.18 0 .35.04.52.11l5.75 2.56c.27.12.44.38.44.67v4.36c0 3.95-2.33 7.55-5.95 9.19a1.51 1.51 0 0 1-1.24 0c-3.62-1.64-5.95-5.24-5.95-9.19V6.09c0-.29.17-.55.44-.67l5.75-2.56c.17-.07.34-.11.52-.11Z"
          />
        </svg>
      </span>

      {/* AKSESIBILITAS TEKS NAVBAR: 
          - Mengubah text-base (16px) menjadi text-xl (20px)
          - Mengubah font-semibold menjadi font-bold
          - Mengubah penanda warna ke Slate 900 demi kontras gelap yang konsisten dengan elemen teks utama lainnya
      */}
      <span 
        className="text-xl font-bold tracking-tight"
        style={{ color: tokens.colors.slate[900] }}
      >
        CekPinjol
      </span>
    </div>
  )
}