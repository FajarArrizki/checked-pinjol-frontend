import { tokens } from '../../config/tokens'

export type StatusPillValue = 'process' | 'selesai' | 'terminate'

export const statusPillConfig: Record<
  StatusPillValue,
  {
    label: string
    style: Record<string, string>
  }
> = {
  process: {
    label: 'In Process',
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
  terminate: {
    label: 'Terminate',
    style: {
      borderColor: tokens.colors.danger.base,
      backgroundColor: tokens.colors.danger.soft,
      color: tokens.colors.danger.dark,
    },
  },
}
