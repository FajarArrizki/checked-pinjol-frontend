import { tokens } from '../config/tokens'

type SidebarMenuPillProps = {
  label: string
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
}

export function SidebarMenuPill({ label, active = false, collapsed = false, onClick }: SidebarMenuPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-4 py-3 text-sm font-medium transition-colors ${collapsed ? 'text-center' : 'text-left'}`}
      style={{
        borderRadius: tokens.radius.full,
        backgroundColor: active ? tokens.colors.brand.soft : tokens.colors.white,
        color: tokens.colors.slate[900],
      }}
    >
      {collapsed ? label.charAt(0) : label}
    </button>
  )
}
