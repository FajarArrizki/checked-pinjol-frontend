export const tokens = {
  colors: {
    brand: {
      primary: '#1AA86E',
      soft: '#D9F5E9',
      softStrong: '#E7FFF5',
      dark: '#0F6E56',
    },
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      900: '#0F172A',
    },
    white: '#FFFFFF',
    black: '#000000',
    success: {
      soft: '#E7FFF5',
      base: '#1AA86E',
    },
    warning: {
      base: '#FBBF24',
      soft: '#FDE68A',
    },
    danger: {
      soft: '#FEE2E2',
      base: '#DC2626',
      dark: '#B91C1C',
    },
  },
  radius: {
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
  },
  spacing: {
    cardPadding: '1.25rem',
    cardGap: '1rem',
  },
} as const

export type Tokens = typeof tokens
