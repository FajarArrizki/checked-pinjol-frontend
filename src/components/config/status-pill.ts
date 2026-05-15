import { tokens } from '../../config/tokens'

export type StatusPillValue = 'menunggu' | 'diproses' | 'selesai' | 'ditolak' | 'process' | 'terminate' | 'pending'

export const statusPillConfig: Record<
  StatusPillValue,
  {
    label: string
    style: Record<string, string>
  }
> = {
  menunggu: {
    label: 'Menunggu',
    style: {
      borderColor: tokens.colors.warning.base,
      backgroundColor: tokens.colors.warning.soft,
      color: tokens.colors.slate[700],
    },
  },
  diproses: {
    label: 'Diproses',
    style: {
      borderColor: tokens.colors.success.base,
      backgroundColor: tokens.colors.success.soft,
      color: tokens.colors.slate[600],
    },
  },
  process: {
    label: 'Diproses',
    style: {
      borderColor: tokens.colors.success.base,
      backgroundColor: tokens.colors.success.soft,
      color: tokens.colors.slate[600],
    },
  },
  selesai: {
    label: 'Selesai',
    style: {
      borderColor: tokens.colors.slate[500],
      backgroundColor: tokens.colors.slate[200],
      color: tokens.colors.slate[500],
    },
  },
  ditolak: {
    label: 'Ditolak',
    style: {
      borderColor: tokens.colors.danger.base,
      backgroundColor: tokens.colors.danger.soft,
      color: tokens.colors.danger.dark,
    },
  },
  terminate: {
    label: 'Ditolak',
    style: {
      borderColor: tokens.colors.danger.base,
      backgroundColor: tokens.colors.danger.soft,
      color: tokens.colors.danger.dark,
    },
  },
  pending: {
    label: 'Menunggu',
    style: {
      borderColor: tokens.colors.warning.base,
      backgroundColor: tokens.colors.warning.soft,
      color: tokens.colors.slate[700],
    },
  },
}
