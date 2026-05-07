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
        {/* Teks */}
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
      <span
        className="flex h-11 w-11 items-center justify-center border text-[#1AA86E]"
        style={{
          borderRadius: tokens.radius.sm,
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
          strokeWidth="2.2"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.75c.18 0 .35.04.52.11l5.75 2.56c.27.12.44.38.44.67v4.36c0 3.95-2.33 7.55-5.95 9.19a1.51 1.51 0 0 1-1.24 0c-3.62-1.64-5.95-5.24-5.95-9.19V6.09c0-.29.17-.55.44-.67l5.75-2.56c.17-.07.34-.11.52-.11Z"
          />
        </svg>
      </span>

      <span style={{ color: tokens.colors.black }} className="text-base font-semibold">CheckedPinjol</span>
    </div>
  )
}
