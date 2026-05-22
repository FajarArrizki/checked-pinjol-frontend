import { tokens } from '../../config/tokens'

export type StatusPillValue = 'diproses' | 'selesai' | 'ditolak' | 'process' | 'terminate' | 'pending'

export const statusPillConfig: Record<
  StatusPillValue,
  {
    label: string
    style: Record<string, string>
  }
> = {
  diproses: {
    label: 'Diproses',
    style: {
      borderColor: tokens.colors.warning.base,
      backgroundColor: tokens.colors.warning.soft,
      color: tokens.colors.slate[700],
    },
  },
  process: {
    label: 'Diproses',
    style: {
      borderColor: tokens.colors.warning.base,
      backgroundColor: tokens.colors.warning.soft,
      color: tokens.colors.slate[700],
    },
  },
  selesai: {
    label: 'Selesai',
    style: {
      borderColor: tokens.colors.success.base,
      backgroundColor: tokens.colors.success.soft,
      color: tokens.colors.brand.dark,
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
    label: 'Diproses',
    style: {
      borderColor: tokens.colors.warning.base,
      backgroundColor: tokens.colors.warning.soft,
      color: tokens.colors.slate[700],
    },
  },
}
